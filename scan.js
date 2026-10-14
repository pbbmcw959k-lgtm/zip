// Zip document scanner: OpenCV.js (lazy, auto-hébergé dans vendor/) — find the paper, flatten it (perspective), then a clean "scan" look.
// Same algorithm as the Python version used for the demo previews. Falls back to the original photo if no document is found.
'use strict';
const Scanner = (() => {
  const SRC = new URL('vendor/opencv/opencv.js', document.baseURI).href; // @techstark/opencv-js 4.10.0-release.1
  let ready;
  function load(progress) {
    return ready ||= new Promise((res, rej) => {
      progress && progress('Préparation du scanner…', 0.05);
      const s = document.createElement('script'); s.src = SRC; s.async = true;
      s.onerror = () => { ready = null; rej(new Error('Scanner indisponible')); };
      s.onload = async () => {
        try {
          const c = window.cv, done = m => { if (m && typeof m.then === 'function') { try { delete m.then; } catch (_) { m.then = undefined; } } window.cv = m; res(m); };
          if (c && c.Mat) return done(c);
          if (c && typeof c.then === 'function') return c.then(m => done(m));   // thenable Module: never `await` it (resolves to itself)
          c.onRuntimeInitialized = () => done(c);
        } catch (e) { ready = null; rej(e); }
      };
      document.head.appendChild(s);
    });
  }
  const order = pts => { // tl, tr, br, bl
    const s = pts.map(p => p[0] + p[1]), d = pts.map(p => p[1] - p[0]);
    const i = a => a.indexOf(Math.min(...a)), j = a => a.indexOf(Math.max(...a));
    return [pts[i(s)], pts[i(d)], pts[j(s)], pts[j(d)]];
  };
  function findQuad(cv, src) {
    const k = 800 / Math.max(src.cols, src.rows), sm = new cv.Mat(), g = new cv.Mat();
    cv.resize(src, sm, new cv.Size(Math.round(src.cols * k), Math.round(src.rows * k)));
    cv.cvtColor(sm, g, cv.COLOR_RGBA2GRAY); cv.GaussianBlur(g, g, new cv.Size(5, 5), 0);
    const area = sm.cols * sm.rows, cands = [];
    const e1 = new cv.Mat(), e2 = new cv.Mat(), ker3 = cv.Mat.ones(3, 3, cv.CV_8U), ker9 = cv.Mat.ones(9, 9, cv.CV_8U);
    cv.Canny(g, e1, 40, 120); cv.dilate(e1, e1, ker3);
    cv.threshold(g, e2, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU); cv.morphologyEx(e2, e2, cv.MORPH_CLOSE, ker9);
    for (const e of [e1, e2]) {
      const cs = new cv.MatVector(), h = new cv.Mat();
      cv.findContours(e, cs, h, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      const list = []; for (let i = 0; i < cs.size(); i++) { const c = cs.get(i); list.push([cv.contourArea(c), c]); }
      list.sort((a, b) => b[0] - a[0]);
      for (const [a, c] of list.slice(0, 5)) {
        if (a < 0.15 * area) break;
        const ap = new cv.Mat(); cv.approxPolyDP(c, ap, 0.02 * cv.arcLength(c, true), true);
        let q;
        if (ap.rows === 4 && cv.isContourConvex(ap)) { q = []; for (let i = 0; i < 4; i++) q.push([ap.data32S[i * 2], ap.data32S[i * 2 + 1]]); cands.push([a, q]); }
        else { const r = cv.minAreaRect(c); q = cv.RotatedRect.points(r).map(p => [p.x, p.y]); cands.push([a * 0.9, q]); }
        ap.delete();
      }
      list.forEach(([, c]) => c.delete()); cs.delete(); h.delete();
    }
    [sm, g, e1, e2, ker3, ker9].forEach(m => m.delete());
    if (!cands.length) return null;
    cands.sort((a, b) => b[0] - a[0]);
    return order(cands[0][1].map(([x, y]) => [x / k, y / k]));
  }
  function percentile(mat, p) { // mat: CV_8UC1
    const hist = new Array(256).fill(0), d = mat.data; for (let i = 0; i < d.length; i += 3) hist[d[i]]++;
    const tot = hist.reduce((a, b) => a + b, 0) * p / 100; let acc = 0;
    for (let v = 0; v < 256; v++) { acc += hist[v]; if (acc >= tot) return v; } return 255;
  }
  // canvas -> {canvas, found}
  async function scan(canvas, progress) {
    const cv = await load(progress);
    progress && progress('Détection des bords du document…', 0.2);
    const src = cv.imread(canvas); let work = src, found = false;
    try {
      const q = findQuad(cv, src);
      if (q) {
        const [tl, tr, br, bl] = q, dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
        const W = Math.round(Math.max(dist(tr, tl), dist(br, bl))), H = Math.round(Math.max(dist(bl, tl), dist(br, tr)));
        const covers = W * H > 0.97 * src.cols * src.rows; // whole frame = already a flat scan/screenshot
        if (W > 100 && H > 100 && !covers) {
          const M = cv.getPerspectiveTransform(cv.matFromArray(4, 1, cv.CV_32FC2, q.flat()), cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, W, 0, W, H, 0, H]));
          const w = new cv.Mat(); cv.warpPerspective(src, w, M, new cv.Size(W, H)); M.delete();
          const m = Math.round(Math.min(W, H) * 0.012); work = w.roi(new cv.Rect(m, m, W - 2 * m, H - 2 * m)).clone(); w.delete(); found = true;
        }
      }
      progress && progress(found ? 'Recadrage et redressement…' : 'Aucun bord net : nettoyage de la photo entière…', 0.35);
      // clean: denoise, divide by background (shadows/white balance), levels, unsharp
      const rgb = new cv.Mat(); cv.cvtColor(work, rgb, cv.COLOR_RGBA2RGB);
      cv.GaussianBlur(rgb, rgb, new cv.Size(0, 0), 0.9);
      const f = new cv.Mat(); rgb.convertTo(f, cv.CV_32FC3);
      const kk = Math.max(31, Math.floor(Math.min(rgb.cols, rgb.rows) / 10) | 1);
      const bg = new cv.Mat(); cv.dilate(f, bg, cv.Mat.ones(9, 9, cv.CV_8U)); cv.GaussianBlur(bg, bg, new cv.Size(kk, kk), 0);
      const one = new cv.Mat(bg.rows, bg.cols, bg.type(), new cv.Scalar(1, 1, 1)); cv.add(bg, one, bg); one.delete();
      const n = new cv.Mat(); cv.divide(f, bg, n, 255);
      const n8 = new cv.Mat(); n.convertTo(n8, cv.CV_8UC3); const gr = new cv.Mat(); cv.cvtColor(n8, gr, cv.COLOR_RGB2GRAY);
      const lo = percentile(gr, 1.5), hi = Math.max(lo + 1, percentile(gr, 55));
      const lv = new cv.Mat(); n.convertTo(lv, cv.CV_32FC3, 255 / (hi - lo), -lo * 255 / (hi - lo));
      const bl = new cv.Mat(); cv.GaussianBlur(lv, bl, new cv.Size(0, 0), 1.0);
      const sh = new cv.Mat(); cv.addWeighted(lv, 1.35, bl, -0.35, 0, sh);
      const out8 = new cv.Mat(); sh.convertTo(out8, cv.CV_8UC3); // saturating cast clips 0..255
      const out = document.createElement('canvas'); cv.imshow(out, out8);
      [rgb, f, bg, n, n8, gr, lv, bl, sh, out8].forEach(m => m.delete());
      return {canvas: out, found};
    } finally { if (work !== src) work.delete(); src.delete(); }
  }
  return {scan, load};
})();
