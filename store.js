// On-device storage (IndexedDB) + pipeline (pdf.js, tesseract.js lazy from CDN) + a tiny fake "API" so the UI code stays identical to the server version.
'use strict';
const Store = (() => {
  const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
  const PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  const TESS = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';
  let dbp;
  const open = () => dbp ||= new Promise((res, rej) => { const r = indexedDB.open('zip-demo', 1); r.onupgradeneeded = () => r.result.createObjectStore('docs', {keyPath: 'id', autoIncrement: true}); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
  const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('docs', mode); const s = t.objectStore('docs'); const out = fn(s); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); }); };
  const all = () => tx('readonly', s => s.getAll());
  const get = id => tx('readonly', s => s.get(+id));
  // Blobs are stored as ArrayBuffers: some WebKit builds refuse Blob values in IndexedDB.
  async function pack(d) {
    for (const k of ['fileBlob', 'thumbBlob', 'scanBlob']) if (d[k] instanceof Blob) { d[k + 'Type'] = d[k].type; d[k] = await d[k].arrayBuffer(); }
    return d;
  }
  const put = async d => { await pack(d); return tx('readwrite', s => s.put(d)); };
  const add = async d => { await pack(d); return tx('readwrite', s => s.add(d)); };
  const del = id => tx('readwrite', s => s.delete(+id));
  const clear = () => tx('readwrite', s => s.clear());
  const urls = {};
  const url = (d, k) => { const key = d.id + k; if (!urls[key] && d[k]) urls[key] = URL.createObjectURL(d[k] instanceof Blob ? d[k] : new Blob([d[k]], {type: d[k + 'Type'] || ''})); return urls[key] || null; };
  const view = (d, full) => { const o = {...d, thumb: url(d, 'thumbBlob'), file: url(d, 'fileBlob'), scan: d.scanBlob ? url(d, 'scanBlob') : null, mime: d.fileBlobType || (d.fileBlob && d.fileBlob.type) || '', status: 'ready'}; for (const k of ['fileBlob', 'thumbBlob', 'scanBlob']) { delete o[k]; delete o[k + 'Type']; } if (!full) { delete o.text; delete o.steps; } return o; };

  async function seed() {
    const base = new URL('samples/', document.baseURI);
    const list = await (await fetch(new URL('seed.json', base))).json();
    for (const s of list) {
      const get_ = p => fetch(new URL(p.replace('samples/', ''), base)).then(r => r.blob());
      const [f, t, sc] = await Promise.all([get_(s.file), get_(s.thumb), s.scan ? get_(s.scan) : null]);
      const {file, thumb, scan, provider, ...meta} = s;
      const steps = [{s: `Document de démonstration (${SRC_LABEL[s.source] || s.source})`}];
      if (sc) steps.push({s: 'Scan nettoyé : recadrage, redressement, fond blanc, contraste'});
      steps.push({s: 'Pré-analysé et classé pour la démo'});
      await add({...meta, fileBlob: f, thumbBlob: t, scanBlob: sc, steps});
    }
    localStorage.zipSeeded = '1';
  }
  const SRC_LABEL = {upload: 'importé', partage: 'partagé', 'e-mail': 'reçu par e-mail'};
  async function ready() { await open(); if (!localStorage.zipSeeded || !(await all()).length) { await clear(); await seed(); } }
  async function reset() { Object.values(urls).forEach(URL.revokeObjectURL); for (const k in urls) delete urls[k]; await clear(); await seed(); }

  // ---------- pipeline ----------
  let pdfjs, tessWorker;
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Chargement impossible : ' + src)); document.head.appendChild(s); });
  async function getPdf() { if (!pdfjs) { pdfjs = await import(PDFJS); pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; } return pdfjs; }
  async function ocr(canvasOrBlob, progress) {
    if (!tessWorker) {
      progress('Téléchargement du moteur OCR (une seule fois, ~10 Mo)…', 0.05);
      if (!window.Tesseract) await loadScript(TESS);
      tessWorker = await Tesseract.createWorker('fra', 1, { logger: m => { if (m.status === 'recognizing text') progress(`Lecture du texte… ${Math.round(m.progress * 100)} %`, 0.3 + m.progress * 0.6); else if (m.status) progress(({'loading language traineddata': 'Téléchargement du français…', 'initializing api': 'Préparation de l’OCR…'})[m.status] || 'Préparation de l’OCR…', 0.15); } });
    }
    const { data } = await tessWorker.recognize(canvasOrBlob);
    return data.text || '';
  }
  const canvasBlob = (c, q = 0.82) => new Promise(r => c.toBlob(r, 'image/jpeg', q));
  async function imageCanvas(blob, max) {
    const bmp = await createImageBitmap(blob);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height)); const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); return c;
  }
  async function ingest(file, progress = () => {}) {
    const steps = [{s: 'Importé depuis l’appareil'}]; let text = '', thumbBlob = null, scanBlob = null;
    const mime = file.type || (file.name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    if (mime === 'application/pdf') {
      progress('Ouverture du PDF…', 0.05);
      const lib = await getPdf(); const pdf = await lib.getDocument({data: await file.arrayBuffer()}).promise;
      for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
        const tc = await (await pdf.getPage(i)).getTextContent(); let line = [], lastY = null;
        for (const it of tc.items) { const y = Math.round(it.transform[5]); if (lastY !== null && Math.abs(y - lastY) > 2) { text += line.join(' ') + '\n'; line = []; } line.push(it.str); lastY = y; }
        text += line.join(' ') + '\n';
      }
      const page = await pdf.getPage(1); const vp = page.getViewport({scale: 1.6}); const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
      await page.render({canvasContext: c.getContext('2d'), viewport: vp}).promise;
      thumbBlob = await canvasBlob(c);
      if (text.replace(/\s/g, '').length < 20) { steps.push({s: 'PDF scanné : reconnaissance optique (OCR)'}); const big = document.createElement('canvas'); const v2 = page.getViewport({scale: 2.5}); big.width = v2.width; big.height = v2.height; await page.render({canvasContext: big.getContext('2d'), viewport: v2}).promise; text = await ocr(big, progress); }
      else steps.push({s: `Texte extrait du PDF (pdf.js) — ${text.length} caractères`});
    } else if (mime.startsWith('image/')) {
      const photo = await imageCanvas(file, 2000); let page = photo;
      try {
        const r = await Scanner.scan(photo, progress); page = r.canvas;
        steps.push({s: r.found ? 'Document détecté : recadré, perspective corrigée, fond nettoyé (OpenCV)' : 'Aucun contour de document trouvé : photo entière nettoyée (sans recadrage)'});
        scanBlob = await canvasBlob(page, 0.85);
      } catch (e) { steps.push({s: `Scanner indisponible (${e.message}) — photo d’origine conservée`}); }
      const tc = document.createElement('canvas'); const k = Math.min(1, 700 / Math.max(page.width, page.height)); tc.width = Math.round(page.width * k); tc.height = Math.round(page.height * k); tc.getContext('2d').drawImage(page, 0, 0, tc.width, tc.height);
      thumbBlob = await canvasBlob(tc);
      text = await ocr(page, (m, f) => progress(m, f == null ? null : 0.4 + (f - 0.3) * 0.9));
      steps.push({s: `Texte reconnu par OCR (tesseract.js, français) — ${text.length} caractères`});
    } else { text = await file.text(); }
    progress('Classement…', 0.95);
    const meta = Z.extract(text, file.name);
    steps.push({s: `Classé dans « ${meta.category} » (moteur : règles françaises sur l’appareil, confiance ${Math.round(meta.confidence * 100)} %)`});
    steps.push({s: 'Indexé pour la recherche — rien n’a quitté ce téléphone'});
    const id = await add({source: 'upload', filename: file.name, mime, ...meta, text, fileBlob: file, thumbBlob, scanBlob, steps, created: Date.now() / 1000});
    return view(await get(id));
  }

  // ---------- fake API (same shapes as the FastAPI server) ----------
  const sortDocs = ds => ds.sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.created - a.created);
  async function api(path, o = {}) {
    const u = new URL(path, 'http://x'); const p = u.pathname; const m = (o.method || 'GET').toUpperCase();
    if (p === '/api/me') { const ds = await all(); const counts = {}; ds.forEach(d => counts[d.category] = (counts[d.category] || 0) + 1);
      return {id: 1, name: 'Kylian', email: 'kylian@demo', handle: 'kylian', inbox: 'kylian@zip.app', counts, categories: Z.CATEGORIES, provider: 'local', dev: false}; }
    if (p === '/api/docs' && m === 'GET') {
      let ds = sortDocs(await all()); const c = u.searchParams.get('category'), q = u.searchParams.get('q'), lim = +(u.searchParams.get('limit') || 500);
      if (c) ds = ds.filter(d => d.category === c);
      if (q) ds = Z.search(ds, q);
      return {docs: ds.slice(0, lim).map(d => view(d))};
    }
    const md = p.match(/^\/api\/docs\/(\d+)$/);
    if (md) {
      if (m === 'GET') { const d = await get(md[1]); if (!d) throw new Error('Document introuvable'); return view(d, true); }
      if (m === 'PATCH') { const d = await get(md[1]); Object.assign(d, JSON.parse(o.body)); d.steps.push({s: `Catégorie modifiée manuellement : « ${d.category} »`}); await put(d); return view(d, true); }
      if (m === 'DELETE') { await del(md[1]); return {ok: true}; }
    }
    if (p === '/api/upload') { const files = o.body.getAll('files'); const out = []; for (const f of files) out.push(await ingest(f, o.progress)); return {docs: out}; }
    if (p === '/api/chat') { const q = JSON.parse(o.body).message || ''; const r = Z.answer(q, await all()); return {reply: r.reply, docs: r.docs.map(d => view(d)), steps: r.steps}; }
    if (p === '/api/logout') return {ok: true};
    throw new Error('Action indisponible dans la démo');
  }
  return {ready, reset, api, ingest, all};
})();
