// Zip demo service worker: precache app shell + demo samples; network-first for app files, cache-first for vendor libs.
const V = 'zip-pages-v5';
// Moteurs auto-hébergés (~20 Mo) : mis en cache en arrière-plan après l'installation, pour importer hors ligne.
const LIBS = ['vendor/pdfjs/pdf.min.mjs', 'vendor/pdfjs/pdf.worker.min.mjs', 'vendor/tesseract/tesseract.min.js', 'vendor/tesseract/worker.min.js', 'vendor/tesseract/core/tesseract-core-simd-lstm.wasm.js', 'vendor/tesseract/core/tesseract-core-lstm.wasm.js', 'vendor/tesseract/lang/fra.traineddata.gz', 'vendor/opencv/opencv.js'];
const PRECACHE = ["./", "index.html", "app.css", "app.js", "engine.js", "store.js", "scan.js", "chips.js", "logo.svg", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "fonts/caveat-latin.woff2", "fonts/jakarta-latin.woff2", "m/admin.webp", "m/assurance.webp", "m/banque.webp", "m/factures.webp", "m/hero.webp", "m/logement.webp", "m/sante.webp", "m/sport.webp", "m/success.webp", "m/travail.webp", "m/vehicule.webp", "m/voyages.webp", "samples/01.pdf", "samples/01.thumb.jpg", "samples/02.pdf", "samples/02.thumb.jpg", "samples/03.pdf", "samples/03.thumb.jpg", "samples/04.pdf", "samples/04.thumb.jpg", "samples/05.pdf", "samples/05.thumb.jpg", "samples/06.pdf", "samples/06.thumb.jpg", "samples/07.pdf", "samples/07.thumb.jpg", "samples/08.png", "samples/08.scan.jpg", "samples/08.thumb.jpg", "samples/09.pdf", "samples/09.thumb.jpg", "samples/10.pdf", "samples/10.thumb.jpg", "samples/11.jpg", "samples/11.scan.jpg", "samples/11.thumb.jpg", "samples/12.pdf", "samples/12.scan.jpg", "samples/12.thumb.jpg", "samples/13.pdf", "samples/13.thumb.jpg", "samples/14.pdf", "samples/14.thumb.jpg", "samples/15.pdf", "samples/15.thumb.jpg", "samples/seed.json"];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(PRECACHE))); self.skipWaiting(); });
const LIBC = 'zip-libs-v1';
const warmLibs = () => caches.open(LIBC).then(c => Promise.all(LIBS.map(u => c.match(u).then(r => r || c.add(u).catch(() => null)))));
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== LIBC).map(k => caches.delete(k)))).then(warmLibs)); self.clients.claim(); });
self.addEventListener('message', e => { if (e.data === 'warm-libs') e.waitUntil(warmLibs()); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const u = new URL(e.request.url);
  if (u.origin === location.origin && u.pathname.includes('/vendor/')) { // moteurs : cache d'abord (fichiers versionnés)
    e.respondWith(caches.open(LIBC).then(c => c.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  if (u.origin !== location.origin) { // CDN (pdf.js, tesseract, fonts): cache-first so OCR works offline after first use
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(LIBC).then(x => x.put(e.request, c)); } return res; })));
    return;
  }
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./'))));
});
