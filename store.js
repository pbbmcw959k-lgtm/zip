// On-device storage (IndexedDB) + pipeline (pdf.js, tesseract.js lazy from CDN) + a tiny fake "API" so the UI code stays identical to the server version.
'use strict';
const Store = (() => {
  // Bibliothèques auto-hébergées (vendor/) : l'import fonctionne hors ligne une fois l'app mise en cache.
  const V = new URL('vendor/', document.baseURI).href;
  const PDFJS = V + 'pdfjs/pdf.min.mjs', PDFJS_WORKER = V + 'pdfjs/pdf.worker.min.mjs';
  const TESS = V + 'tesseract/tesseract.min.js';
  const BLOBS = ['fileBlob', 'thumbBlob', 'scanBlob'];
  // v2 : métadonnées (docs) et fichiers (blobs) séparés, pour que les listes ne chargent jamais les fichiers.
  let dbp;
  const open = () => dbp ||= new Promise((res, rej) => {
    const r = indexedDB.open('zip-demo', 2);
    r.onupgradeneeded = e => {
      const db = r.result, t = r.transaction;
      if (!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', {keyPath: 'id', autoIncrement: true});
      if (!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs', {keyPath: 'id'});
      if (e.oldVersion === 1) { // migration v1 -> v2 : sortir les fichiers des fiches
        const docs = t.objectStore('docs'), blobs = t.objectStore('blobs');
        docs.openCursor().onsuccess = ev => { const c = ev.target.result; if (!c) return; const d = c.value, b = {id: d.id};
          for (const k of BLOBS) { if (d[k] != null) { b[k] = d[k]; b[k + 'Type'] = d[k + 'Type']; } delete d[k]; delete d[k + 'Type']; }
          blobs.put(b); c.update(d); c.continue(); };
      }
    };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  });
  const tx = async (stores, mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction(stores, mode); const out = fn(...[].concat(stores).map(n => t.objectStore(n))); t.oncomplete = () => res(out && out.result !== undefined ? out.result : out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error || new Error('Stockage plein ou indisponible')); }); };
  const all = () => tx('docs', 'readonly', s => s.getAll());
  const get = id => tx('docs', 'readonly', s => s.get(+id));
  const getBlobs = id => tx('blobs', 'readonly', s => s.get(+id));
  // Les fichiers sont stockés en ArrayBuffer : certaines versions de WebKit refusent les Blob dans IndexedDB.
  async function split(d) {
    const b = {};
    for (const k of BLOBS) { if (d[k] instanceof Blob) { b[k + 'Type'] = d[k].type; b[k] = await d[k].arrayBuffer(); } else if (d[k] != null) b[k] = d[k]; delete d[k]; }
    return b;
  }
  const put = d => tx('docs', 'readwrite', s => s.put(d));
  async function add(d) { const b = await split(d); return tx(['docs', 'blobs'], 'readwrite', (s, bs) => { const r = s.add(d); r.onsuccess = () => bs.put({...b, id: r.result}); return r; }); }
  const del = id => tx(['docs', 'blobs'], 'readwrite', (s, bs) => { s.delete(+id); bs.delete(+id); });
  const clear = () => tx(['docs', 'blobs'], 'readwrite', (s, bs) => { s.clear(); bs.clear(); });
  const urls = {};
  const url = (id, b, k) => { const key = id + k; if (!urls[key] && b && b[k]) urls[key] = URL.createObjectURL(new Blob([b[k]], {type: b[k + 'Type'] || ''})); return urls[key] || null; };
  // view(d) : fiche légère pour les listes ; view(d, true, blobs) : fiche complète avec les fichiers
  const view = (d, full, b) => { const o = {...d, mime: d.mime || (b && b.fileBlobType) || '', status: 'ready'};
    if (full) { o.thumb = url(d.id, b, 'thumbBlob'); o.file = url(d.id, b, 'fileBlob'); o.scan = url(d.id, b, 'scanBlob'); } else { delete o.text; delete o.steps; } return o; };
  const fullView = async id => { const d = await get(id); if (!d) throw new Error('Document introuvable'); return view(d, true, await getBlobs(id)); };

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
      await add(enrich({...meta, fileBlob: f, thumbBlob: t, scanBlob: sc, steps}));
    }
    localStorage.zipSeeded = '2';
  }
  // champs ajoutés en v2 (échéance, sens débit/crédit, IBAN masqué) calculés pour les fiches existantes
  const enrich = d => { if (d.flow !== undefined) return d; const e = Z.extract(d.text || '', d.filename || ''); d.expires = e.expires || d.warranty_end || null; d.flow = e.flow; d.entities = {...(d.entities || {}), ...e.entities}; return d; };
  const SRC_LABEL = {upload: 'importé', partage: 'partagé', 'e-mail': 'reçu par e-mail'};
  async function ready() {
    await open();
    // La démo n'est injectée qu'au tout premier lancement : une bibliothèque vidée reste vide.
    if (!localStorage.zipSeeded) { await clear(); await seed(); }
    else { const ds = await all(); const old = ds.filter(d => d.flow === undefined); if (old.length) await tx('docs', 'readwrite', s => old.forEach(d => s.put(enrich(d)))); }
    persist();
  }
  // Demande au navigateur de ne pas effacer les données en cas de manque d'espace (iOS/Safari : best effort).
  async function persist() { try { if (navigator.storage && navigator.storage.persist && !(await navigator.storage.persisted())) await navigator.storage.persist(); } catch (_) {} }
  async function reset() { Object.values(urls).forEach(URL.revokeObjectURL); for (const k in urls) delete urls[k]; await clear(); await seed(); }
  async function wipe() { Object.values(urls).forEach(URL.revokeObjectURL); for (const k in urls) delete urls[k]; await clear(); }

  // ---------- pipeline ----------
  const MAX_MB = 60, MAX_TEXT_PAGES = 100, MAX_OCR_PAGES = 10, MAX_TEXT_CHARS = 150000;
  const fail = m => { const e = new Error(m); e.fr = true; return e; };
  let pdfjs, tessWorker;
  const loadScript = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(fail('Le moteur de lecture n’a pas pu être chargé. Vérifie ta connexion puis réessaie.')); document.head.appendChild(s); });
  async function getPdf() { if (!pdfjs) { try { pdfjs = await import(PDFJS); } catch (e) { throw fail('Le lecteur PDF n’a pas pu être chargé. Vérifie ta connexion puis réessaie.'); } pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER; } return pdfjs; }
  async function ocr(canvasOrBlob, progress) {
    if (!tessWorker) {
      progress('Préparation de la lecture du texte (une seule fois)…', 0.05);
      if (!window.Tesseract) await loadScript(TESS);
      try {
        tessWorker = await Tesseract.createWorker('fra', 1, { workerPath: V + 'tesseract/worker.min.js', corePath: V + 'tesseract/core', langPath: V + 'tesseract/lang', workerBlobURL: false,
          logger: m => { if (m.status === 'recognizing text') progress(`Lecture du texte… ${Math.round(m.progress * 100)} %`, 0.3 + m.progress * 0.6); else if (m.status) progress('Préparation de l’OCR…', 0.15); } });
      } catch (e) { tessWorker = null; throw fail('La lecture du texte (OCR) n’a pas pu démarrer. Vérifie ta connexion puis réessaie.'); }
    }
    const { data } = await tessWorker.recognize(canvasOrBlob);
    return {text: data.text || '', conf: data.confidence || 0};
  }
  const canvasBlob = (c, q = 0.82) => new Promise(r => c.toBlob(r, 'image/jpeg', q));
  async function imageCanvas(blob, max) {
    let bmp; try { bmp = await createImageBitmap(blob); } catch (e) { throw fail('Cette image est illisible ou dans un format que ce navigateur ne sait pas ouvrir. Essaie en JPG ou PNG.'); }
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height)); const c = document.createElement('canvas');
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k); c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height); return c;
  }
  const pdfError = e => { const n = (e && (e.name || '')) + ' ' + (e && e.message || '');
    if (/Password/i.test(n)) return fail('Ce PDF est protégé par un mot de passe. Enregistre-le sans mot de passe puis réessaie.');
    if (/Invalid|Missing|Unexpected|FormatError|corrupt|structure/i.test(n)) return fail('Ce PDF est endommagé ou illisible. Essaie de le télécharger à nouveau.');
    return e && e.fr ? e : fail('Ce PDF n’a pas pu être ouvert.'); };
  async function pageText(pdf, i) {
    const tc = await (await pdf.getPage(i)).getTextContent(); let out = '', line = [], lastY = null;
    for (const it of tc.items) { const y = Math.round(it.transform[5]); if (lastY !== null && Math.abs(y - lastY) > 2) { out += line.join(' ') + '\n'; line = []; } line.push(it.str); lastY = y; }
    return out + line.join(' ') + '\n';
  }
  async function render(page, scale) { const vp = page.getViewport({scale}); const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; await page.render({canvasContext: c.getContext('2d'), viewport: vp}).promise; return c; }
  async function ingest(file, progress = () => {}) {
    const steps = [{s: 'Importé depuis l’appareil'}]; let text = '', thumbBlob = null, scanBlob = null, quality = null;
    const lower = (file.name || '').toLowerCase();
    const mime = file.type || (lower.endsWith('.pdf') ? 'application/pdf' : /\.(jpe?g|png|heic|heif|webp|gif)$/.test(lower) ? 'image/jpeg' : '');
    if (mime !== 'application/pdf' && !mime.startsWith('image/')) throw fail(`« ${file.name} » n’est pas pris en charge : importe un PDF ou une photo (JPG, PNG, HEIC).`);
    if (file.size > MAX_MB * 1e6) throw fail(`« ${file.name} » est trop lourd (${Math.round(file.size / 1e6)} Mo). Taille maximale : ${MAX_MB} Mo.`);
    if (!file.size) throw fail(`« ${file.name} » est vide.`);
    if (mime === 'application/pdf') {
      progress('Ouverture du PDF…', 0.05);
      const lib = await getPdf(); let pdf;
      try { pdf = await lib.getDocument({data: await file.arrayBuffer()}).promise; } catch (e) { throw pdfError(e); }
      const n = pdf.numPages, nt = Math.min(n, MAX_TEXT_PAGES), pages = [];
      for (let i = 1; i <= nt; i++) { pages.push(await pageText(pdf, i)); if (n > 5) progress(`Lecture des pages… ${i}/${nt}`, 0.05 + 0.2 * i / nt); }
      const page1 = await pdf.getPage(1);
      thumbBlob = await canvasBlob(await render(page1, 1.6));
      // pages sans texte (scannées) : OCR page par page, plafonné
      const empty = pages.map((t, i) => t.replace(/\s/g, '').length < 20 ? i + 1 : 0).filter(Boolean);
      const toOcr = empty.slice(0, MAX_OCR_PAGES), confs = []; let done = 0;
      for (const [j, i] of toOcr.entries()) {
        const c = await render(i === 1 ? page1 : await pdf.getPage(i), 2.2);
        const r = await ocr(c, (m, f) => progress(m.replace('Lecture du texte', `Lecture de la page ${i} (${j + 1}/${toOcr.length})`), f));
        pages[i - 1] = r.text; c.width = c.height = 0; confs.push(r.conf);
        // deux premières pages sans aucun texte : inutile de continuer (pages blanches)
        if (j === 1 && Z.textQuality(pages[toOcr[0] - 1] + pages[i - 1], 0).empty) { done = j + 1; break; }
        done = j + 1;
      }
      if (toOcr.length) quality = Z.textQuality(toOcr.slice(0, done).map(i => pages[i - 1]).join('\n'), confs.reduce((a, b) => a + b, 0) / Math.max(1, confs.length));
      text = pages.join('\n');
      if (text.length > MAX_TEXT_CHARS) { text = text.slice(0, MAX_TEXT_CHARS); steps.push({s: `Texte très long : les ${Math.round(MAX_TEXT_CHARS / 1000)} 000 premiers caractères sont indexés`}); }
      const textPages = nt - empty.length;
      if (textPages) steps.push({s: `Texte extrait du PDF (pdf.js) — ${textPages} page${textPages > 1 ? 's' : ''}`});
      if (toOcr.length) steps.push({s: `Pages scannées lues par OCR : ${done}${empty.length > done ? ` sur ${empty.length}${done < toOcr.length ? ' (pages blanches : lecture arrêtée)' : ` (limite de ${MAX_OCR_PAGES} pages dans la démo)`}` : ''}`});
      if (n > MAX_TEXT_PAGES) steps.push({s: `Document de ${n} pages : seules les ${MAX_TEXT_PAGES} premières sont indexées`});
      if (!toOcr.length || textPages) quality = null; // un PDF avec du vrai texte n'est pas « illisible »
    } else {
      const photo = await imageCanvas(file, 2000); let page = photo, found = false;
      try {
        const r = await Scanner.scan(photo, progress); page = r.canvas; found = r.found;
        steps.push({s: r.found ? 'Document détecté : recadré, perspective corrigée, fond nettoyé (OpenCV)' : 'Aucun contour de document trouvé : photo entière nettoyée (sans recadrage)'});
        scanBlob = await canvasBlob(page, 0.85);
      } catch (e) { steps.push({s: 'Scanner indisponible — photo d’origine conservée'}); }
      const tc = document.createElement('canvas'); const k = Math.min(1, 700 / Math.max(page.width, page.height)); tc.width = Math.round(page.width * k); tc.height = Math.round(page.height * k); tc.getContext('2d').drawImage(page, 0, 0, tc.width, tc.height);
      thumbBlob = await canvasBlob(tc);
      const r = await ocr(page, (m, f) => progress(m, f == null ? null : 0.4 + (f - 0.3) * 0.9));
      text = r.text; quality = Z.textQuality(text, r.conf, found);
      steps.push({s: `Texte reconnu par OCR (tesseract.js, français) — ${text.trim().length} caractères, confiance ${Math.round(r.conf)} %`});
    }
    progress('Classement…', 0.95);
    let meta;
    if (quality && !quality.ok) {
      const isPdf = mime === 'application/pdf';
      meta = {category: 'Autres', title: quality.empty ? (isPdf ? 'Pages vides ou illisibles' : 'Aucun document détecté') : (isPdf ? 'Scan illisible' : 'Photo illisible'), issuer: '', date: null, amount: null, currency: null, entities: {}, warranty_end: null, expires: null, flow: null,
        summary: isPdf ? (quality.empty ? 'Zip n’a trouvé aucun texte dans ces pages scannées. Vérifie le fichier ou scanne à nouveau le document.' : 'Les pages scannées sont trop floues ou trop sombres pour être lues. Scanne à nouveau le document avec plus de lumière.')
          : quality.empty ? 'Zip n’a trouvé aucun texte sur cette image. Reprends la photo en cadrant bien le document.' : 'Le texte de cette photo est trop flou ou trop sombre pour être lu. Reprends-la avec plus de lumière, à plat et sans reflet.', confidence: 0, unreadable: true};
      steps.push({s: `Qualité insuffisante (${quality.reason}) : document non classé pour éviter une erreur`});
    } else {
      meta = Z.extract(text, file.name);
      steps.push({s: `Classé dans « ${meta.category} » (moteur : règles françaises sur l’appareil, confiance ${Math.round(meta.confidence * 100)} %)`});
    }
    steps.push({s: 'Indexé pour la recherche — rien n’a quitté ce téléphone'});
    const id = await add({source: 'upload', filename: file.name, mime, ...meta, text: meta.unreadable ? '' : text, fileBlob: file, thumbBlob, scanBlob, steps, created: Date.now() / 1000});
    return fullView(id);
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
      if (m === 'GET') return fullView(md[1]);
      if (m === 'PATCH') { const d = await get(md[1]); if (!d) throw new Error('Document introuvable'); Object.assign(d, JSON.parse(o.body)); d.steps.push({s: `Catégorie modifiée manuellement : « ${d.category} »`}); await put(d); return fullView(md[1]); }
      if (m === 'DELETE') { await del(md[1]); return {ok: true}; }
    }
    if (p === '/api/upload') { const files = o.body.getAll('files'); const out = [], errors = [];
      for (const f of files) { try { out.push(await ingest(f, o.progress)); } catch (e) { errors.push(e.fr ? e.message : `« ${f.name} » n’a pas pu être importé.`); console.warn(e); } }
      if (!out.length) throw fail(errors[0] || 'Import impossible.'); return {docs: out, errors}; }
    if (p === '/api/chat') { const q = JSON.parse(o.body).message || ''; const r = Z.answer(q, await all()); return {reply: r.reply, docs: r.docs.map(d => view(d)), steps: r.steps}; }
    if (p === '/api/logout') return {ok: true};
    throw new Error('Action indisponible dans la démo');
  }
  return {ready, reset, wipe, api, ingest, all, persist};
})();
