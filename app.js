'use strict';
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const I = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  grid:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>',
  spark:'<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/><path d="M19 15c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>', chev:'<path d="m9 6 6 6-6 6"/>', sparkle:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>', docs:'<path d="M8 3h7l4 4v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M15 3v4h4M9.5 12h6M9.5 15.5h6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  up:'<path d="M12 16V4m0 0-5 5m5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  share:'<path d="M12 3v12m0-12-4 4m4-4 4 4"/><path d="M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2"/>',
  camera:'<path d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/>',
  file:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  back:'<path d="M15 5l-7 7 7 7"/>', send:'<path d="M5 12h14M13 6l6 6-6 6"/>', check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  ext:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>', trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  out:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10"/>', chev:'<path d="m9 6 6 6-6 6"/>',
  shield:'<path d="M12 3 5 6v6c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
  'Sport':'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5c2.5 2.5 2.5 14.5 0 17M3.5 12c2.5-2.5 14.5-2.5 17 0"/>',
  'Santé':'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  'Factures & achats':'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  'Logement':'<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  'Banque & impôts':'<path d="M3 9 12 4l9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  'Travail':'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
  'Administratif':'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="10" cy="11" r="2.2"/><path d="M6.5 16.5c.8-1.6 2-2.3 3.5-2.3s2.7.7 3.5 2.3M15 9.5h2.5M15 12.5h2.5"/>',
  'Voyages':'<path d="M10.5 13.5 3 11l1.5-1.5 7.5 1L16.5 6a2.1 2.1 0 0 1 3 3L15 13.5l1 7.5-1.5 1.5-2.5-7.5-3 3V21l-1.5 1-1-3.5L3 17.5 4 16h3z"/>',
  'Véhicule':'<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3zM5 11h14"/><circle cx="7.5" cy="16" r="1"/><circle cx="16.5" cy="16" r="1"/>',
  'Assurance':'<path d="M12 3 5 6v6c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6z"/>',
  'Autres':'<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
};
const ic = (n, w = 1.8) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${I[n] || I.file}</svg>`;
const COL = {'Santé':'#f0709c','Sport':'#f4874b','Factures & achats':'#e0a52a','Administratif':'#8b6cf0','Logement':'#3fb886','Banque & impôts':'#4f8be8','Travail':'#7b8aa3','Voyages':'#2fb4d0','Véhicule':'#ea6b5c','Assurance':'#2fae98','Autres':'#a1a1aa'};
const SRC = {upload:'Importé', partage:'Partagé', 'e-mail':'Reçu par e-mail'};
const MONTHS = ['janv.','févr.','mars','avr.','mai','juin','juil.','août','sept.','oct.','nov.','déc.'];
const fdate = d => { if (!d) return ''; const x = new Date(d + 'T12:00'); return `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`; };
const fdateLong = d => d ? new Date(d + 'T12:00').toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'}) : '—';
const money = a => { if (a == null) return ''; const [i, d] = a.toFixed(2).split('.'); return i.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + ',' + d + '\u00a0€'; };
let ME = null;
const api = (p, o = {}) => Store.api(p, o);
const toast = (m) => { const t = $('#toast'); t.innerHTML = ic('check', 2.2).replace('<svg', '<svg width="18" height="18"') + esc(m); t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); };
I.dots = '<circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/>';
I.close = '<path d="M6 6l12 12M18 6 6 18"/>';
I.down = '<path d="M12 4v11m0 0-4.5-4.5M12 15l4.5-4.5"/><path d="M5 19h14"/>';
I.help = '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.4a2.5 2.5 0 0 1 4.8 1c0 1.7-2.4 2.2-2.4 3.6M12 17.2v.1"/>';
I.folder = '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>';
I.clip = '<rect x="5" y="4.5" width="14" height="16" rx="2.5"/><path d="M9 4.5V3.6c0-.3.3-.6.6-.6h4.8c.3 0 .6.3.6.6v.9M9 10h6M9 14h4"/>';
I.bag = '<path d="M6 8h12l-1 12H7z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>';
I.sparkle = '<path d="M11 3.5c.7 4.4 2.6 6.3 7 7-4.4.7-6.3 2.6-7 7-.7-4.4-2.6-6.3-7-7 4.4-.7 6.3-2.6 7-7z"/><path d="M18.5 15.5c.3 1.8.9 2.4 2.5 2.7-1.6.3-2.2.9-2.5 2.7-.3-1.8-.9-2.4-2.5-2.7 1.6-.3 2.2-.9 2.5-2.7z"/>';

// ---------- brand data ----------
const MF = {'Santé':'sante','Sport':'sport','Factures & achats':'factures','Administratif':'admin','Logement':'logement','Banque & impôts':'banque','Travail':'travail','Voyages':'voyages','Véhicule':'vehicule','Assurance':'assurance','Autres':'hero'};
// tint (card), deep (accents, AA on tint), soft (header wash)
const TINT = {
  'Santé':['#fbe0df','#b73b3b','#f8d4d2'], 'Sport':['#fde6cb','#a8530f','#fbdcb6'], 'Factures & achats':['#dcecd8','#2f7041','#cfe5ca'],
  'Administratif':['#e7e0f6','#5c3fa8','#dcd2f2'], 'Logement':['#d9e6f6','#1f5ea8','#cbdcf2'], 'Banque & impôts':['#fbf0c8','#8a6200','#f7e6a8'],
  'Travail':['#e3e6ec','#3e4b61','#d6dbe4'], 'Voyages':['#d4eee9','#16705f','#c4e7e0'], 'Véhicule':['#fadbd7','#a73328','#f6cbc5'],
  'Assurance':['#e2e3f8','#3d43a8','#d5d7f4'], 'Autres':['#eeece0','#4a4a3a','#e4e1d0']};
const DESC = {'Santé':'Ordonnances, résultats, mutuelle…\nTout ce qu’il te faut, au même endroit.', 'Sport':'Licences, abonnements, certificats…\nTon énergie, bien organisée.',
  'Factures & achats':'Factures, tickets, garanties…\nTes achats sous contrôle.', 'Administratif':'Identité, attestations, démarches…\nLa paperasse, en ordre.',
  'Logement':'Loyer, quittances, énergie…\nTon chez-toi, bien rangé.', 'Banque & impôts':'Relevés, avis d’imposition…\nTes finances, au clair.',
  'Travail':'Bulletins de paie, contrats…\nTa vie pro, à portée de main.', 'Voyages':'Billets, réservations, passeports…\nPrêt à partir.',
  'Véhicule':'Carte grise, contrôle technique…\nTa voiture, en règle.', 'Assurance':'Attestations, contrats, sinistres…\nTu es couvert.', 'Autres':'Tout le reste, rangé quand même.'};
const mimg = (c, cls = '', w = 120) => `<img class="mz ${cls}" src="m/${MF[c] || 'hero'}.webp" alt="" width="${w}" decoding="async" loading="lazy" draggable="false">`;
const tint = c => TINT[c] || TINT.Autres;
const ndocs = n => `${n} doc${n > 1 ? 's' : ''}`;
const ftype = d => { const m = (d.mime || d.filename || '').toLowerCase(); return /pdf/.test(m) ? ['PDF', '#d64538', '#fde4e1'] : /png|jpe?g|image|heic|webp/.test(m) ? ['IMG', '#2c6fd6', '#dfeafc'] : ['DOC', '#2f7041', '#dcecd8']; };
const ficon = d => { const [t, c, b] = ftype(d); return `<span class="fic" style="--fc:${c};--fb:${b}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z" fill="currentColor" fill-opacity=".14"/><path d="M14 3v5h5"/></svg><b>${t}</b></span>`; };
const docRow = (d, i = 0) => `<a class="drow" href="#/doc/${d.id}" style="--i:${Math.min(i, 12)}">${ficon(d)}<span class="dm"><b>${esc(d.title)}</b><small>${esc(fdate(d.date) || '—')}${d.amount != null ? ' · ' + money(d.amount) : ''}</small></span><span class="chv" aria-hidden="true">${ic('chev', 2.2)}</span></a>`;
const empty = (h, p, cta = true) => `<div class="empty-st">${mimg('Autres', '', 96)}<h3>${h}</h3><p>${p}</p>${cta ? `<button class="btn primary" data-add>${ic('plus', 2.4)}Ajouter un document</button>` : ''}</div>`;
const card = docRow, row = docRow; // compat
// Listes longues : on n'affiche que 40 lignes, puis les suivantes à l'approche du bas de l'écran.
const PAGE = 40;
const listHTML = docs => docs.slice(0, PAGE).map(docRow).join('');
function lazyList(el, docs) {
  if (!el) return; let n = Math.min(PAGE, docs.length); if (lazyList.io) lazyList.io.disconnect();
  el.querySelectorAll('.lz').forEach(x => x.remove()); if (n >= docs.length) return;
  const s = document.createElement('div'); s.className = 'lz'; s.setAttribute('aria-hidden', 'true'); s.style.height = '1px'; el.after(s);
  const io = lazyList.io = new IntersectionObserver(es => { if (!es.some(e => e.isIntersecting)) return;
    el.insertAdjacentHTML('beforeend', docs.slice(n, n + PAGE).map((d, k) => docRow(d, 0)).join('')); n += PAGE;
    if (n >= docs.length) { io.disconnect(); s.remove(); } }, {rootMargin: '800px'});
  io.observe(s);
}

// theme: light by default; dark only if chosen in Paramètres
document.documentElement.dataset.theme = localStorage.zipTheme === 'dark' ? 'dark' : 'light';

// ---------- shell ----------
function shell(active, inner, {nav = true, cls = ''} = {}) {
  const isDocs = active === 'docs' || String(active).startsWith('cat:');
  const tab = (h, n, label, on) => `<a href="${h}" class="${on ? 'on' : ''}" ${on ? 'aria-current="page"' : ''}>${ic(n, on ? 2.2 : 1.8)}<span>${label}</span></a>`;
  return `<div class="shell ${cls}"><main class="main" id="main">${inner}</main>
    ${nav ? `<nav class="tabbar" aria-label="Navigation principale">
      ${tab('#/', 'home', 'Accueil', active === 'home')}${tab('#/zip', 'sparkle', 'Ask Zip', active === 'zip')}
      <button class="tadd" data-add aria-label="Ajouter un document">${ic('plus', 2.4)}</button>
      ${tab('#/browse', 'file', 'Documents', isDocs)}${tab('#/settings', 'gear', 'Réglages', active === 'settings')}
    </nav>` : ''}</div>`;
}
function wire() {
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => { b.classList.remove('boing'); void b.offsetWidth; b.classList.add('boing'); openAdd(b.dataset.cat); });
  document.querySelectorAll('input.fi2').forEach(i => i.onchange = e => e.target.files.length && uploadFiles(e.target.files, i.dataset.cat));
  document.querySelectorAll('[data-hop]').forEach(a => a.onclick = e => { if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; e.preventDefault(); a.classList.add('hop'); setTimeout(() => location.hash = a.getAttribute('href'), 230); });
  document.querySelectorAll('[data-back]').forEach(b => b.onclick = () => history.length > 1 ? history.back() : (location.hash = '#/'));
}
const topbar = (title = '', right = '', back = true) => `<header class="top">${back ? `<button class="rbtn" data-back aria-label="Retour">${ic('back', 2.2)}</button>` : ''}${title}<span class="sp"></span>${right}</header>`;

// ---------- 1. welcome ----------
function vWelcome() {
  return `<div class="welcome">
    <div class="wtop"><img class="logo xl" src="logo.svg" alt="Zip" width="148" height="97">
      <h1>Vos documents,<br>bien rangés.</h1><p>L’IA s’occupe du reste.</p></div>
    <div class="wart" aria-hidden="true"><span class="hill h1"></span><span class="hill h2"></span><span class="hill h3"></span>
      <span class="fold f1"></span><span class="fold f2"></span><span class="fold f3"></span>
      <img class="mz hero" src="m/hero.webp" alt="" width="190" height="240" fetchpriority="high"></div>
    <div class="wbot"><a class="btn primary big" href="#/" id="go" data-enter>Commencer ${ic('send', 2.2)}</a>
      <p class="login">Déjà un compte ? <a href="#/" data-enter>Se connecter</a></p></div></div>`;
}
function afterWelcome() { document.querySelectorAll('[data-enter]').forEach(a => a.onclick = () => { localStorage.zipWelcomed = '1'; }); }

// ---------- 2. home ----------
async function vHome() {
  const cats = ME.categories.filter(c => c !== 'Autres' || ME.counts[c]);
  return shell('home', `
    <header class="hhead"><img class="logo" src="logo.svg" alt="Zip" width="60" height="40"><a class="rbtn" href="#/zip" aria-label="Ask Zip">${ic('sparkle', 1.9)}</a></header>
    <h1 class="hello">Bonjour ${esc(ME.name)} <span aria-hidden="true">👋</span></h1><p class="lead">Voici vos documents du jour.</p>
    <a class="askcard" href="#/zip"><span class="spk" aria-hidden="true">${ic('sparkle', 1.8)}</span><span class="tx"><b>Ask Zip</b><small>Pose une question, trouve un document, ou résume un dossier.</small></span><span class="chv" aria-hidden="true">${ic('chev', 2.4)}</span></a>
    <label class="searchf">${ic('search', 2.2)}<input id="hq" type="search" placeholder="Rechercher un document…" aria-label="Rechercher un document" autocomplete="off"></label>
    <div id="hres" hidden></div>
    <section id="hcats" aria-labelledby="mc"><div class="sechead"><h2 id="mc">Mes catégories</h2><a href="#/browse">Tout voir</a></div>
    <div class="cgrid">${cats.map((c, i) => { const n = ME.counts[c] || 0, [t, d] = tint(c); return `<a class="ccard" data-hop href="#/cat/${encodeURIComponent(c)}" style="--t:${t};--d:${d};--i:${i}" aria-label="${esc(c)}, ${ndocs(n)}">
      ${mimg(c, '', 76)}<span class="cl"><span><b>${esc(c)}</b><small>${ndocs(n)}</small></span><span class="chv" aria-hidden="true">${ic('chev', 2.4)}</span></span></a>`; }).join('')}</div></section>
  `);
}
function afterHome() {
  const q = $('#hq'), res = $('#hres'), cats = $('#hcats');
  q.oninput = debounce(async () => {
    const v = q.value.trim(); if (!v) { res.hidden = true; cats.hidden = false; return; }
    const {docs} = await api('/api/docs?q=' + encodeURIComponent(v));
    res.innerHTML = `<div class="sechead"><h2>${docs.length} résultat${docs.length > 1 ? 's' : ''}</h2></div>` + (docs.length ? `<div class="dlist" id="hl">${listHTML(docs)}</div>` : `<p class="lead">Rien trouvé pour « ${esc(v)} ». Essaie <a class="lnk" href="#/zip">Ask Zip</a>.</p>`);
    res.hidden = false; cats.hidden = true; lazyList($('#hl'), docs);
  }, 180);
}

// ---------- documents (browse) ----------
let LIST = [];
async function vBrowse() {
  const {docs} = await api('/api/docs'); LIST = docs;
  return shell('docs', `${topbar('<h1 class="ttl">Documents</h1>', '', false)}
    <label class="searchf">${ic('search', 2.2)}<input id="sq" type="search" placeholder="Rechercher un document…" aria-label="Rechercher un document" autocomplete="off"></label>
    <div class="chips" role="list">${ME.categories.filter(c => ME.counts[c]).map(c => `<a role="listitem" class="chip" href="#/cat/${encodeURIComponent(c)}" style="--t:${tint(c)[0]};--d:${tint(c)[1]}">${esc(c)} <span>${ME.counts[c]}</span></a>`).join('')}</div>
    <div class="sechead"><h2 id="bc">${docs.length} documents</h2></div>
    <div class="dlist" id="bl">${docs.length ? listHTML(docs) : ''}</div>${docs.length ? '' : empty('Rien ici pour l’instant', 'Tes documents apparaîtront ici, rangés automatiquement.')}`);
}
function afterBrowse() {
  lazyList($('#bl'), LIST);
  const sq = $('#sq'); sq.oninput = debounce(async () => { const {docs} = await api('/api/docs' + (sq.value ? '?q=' + encodeURIComponent(sq.value) : '')); $('#bl').innerHTML = listHTML(docs); lazyList($('#bl'), docs); $('#bc').textContent = sq.value ? `${docs.length} résultat${docs.length > 1 ? 's' : ''}` : `${docs.length} documents`; }, 180);
}

// ---------- 5. category ----------
async function vCat(c) {
  const {docs} = await api('/api/docs?category=' + encodeURIComponent(c)); LIST = docs;
  const [t, d, s] = tint(c);
  return shell('cat:' + c, `<div class="chero" style="--t:${t};--d:${d};--s:${s}">
      <span class="blob b1" aria-hidden="true"></span><span class="blob b2" aria-hidden="true"></span>
      <header class="top"><a class="rbtn" href="#/" aria-label="Retour à l’accueil">${ic('back', 2.2)}</a><span class="sp"></span><button class="rbtn" id="more" aria-label="Plus d’options">${ic('dots', 2.6)}</button></header>
      <div class="cmasc">${mimg(c, 'pop', 130)}</div></div>
    <div class="cbody" style="--t:${t};--d:${d}">
      <span class="tag">${esc(c)}</span><h1 class="ctitle">${esc(c)}</h1>
      <p class="cnt">${ic('clip', 2)}${docs.length} document${docs.length > 1 ? 's' : ''}</p>
      <p class="cdesc">${esc(DESC[c] || '').replace('\n', '<br>')}</p>
      <button class="btn primary wide" data-add data-cat="${esc(c)}">${ic('plus', 2.4)}Ajouter un document</button>
      <div class="sechead"><h2>Documents</h2></div>
      ${docs.length ? `<div class="dlist" id="cl">${listHTML(docs)}</div>` : `<p class="lead">Aucun document pour l’instant. Dès qu’un document ${c === 'Santé' ? 'médical' : 'de ce type'} arrive, Zip le range ici.</p>`}
    </div>`, {cls: 'catpage'});
}
function afterCat(c) {
  lazyList($('#cl'), LIST);
  $('#more').onclick = () => sheet(`<div class="shead"><h3 id="shh">${esc(c)}</h3><button class="rbtn" id="shx" aria-label="Fermer">${ic('close', 2.2)}</button></div>
    <div class="menu"><a class="mrow" href="#/zip">${ic('sparkle')}<span>Demander à Zip</span>${ic('chev', 2.2)}</a><a class="mrow" href="#/browse">${ic('file')}<span>Tous les documents</span>${ic('chev', 2.2)}</a></div>`);
}

// ---------- 7. document detail ----------
async function vDoc(id) {
  const d = await api('/api/docs/' + id);
  const ents = Object.entries(d.entities || {});
  let w = '';
  if (d.warranty_end) { const e = new Date(d.warranty_end), n = new Date(); w = `<div class="info"><span class="ok ${e > n ? '' : 'ko'}">${ic(e > n ? 'shield' : 'close', 2)}</span><div><b>${e > n ? 'Sous garantie' : 'Garantie expirée'}</b><small>Jusqu’au ${fdateLong(d.warranty_end)}</small></div></div>`; }
  const [t, dk] = tint(d.category);
  return shell('cat:' + d.category, `
    ${topbar(`<div class="dtitle"><h1>${esc(d.title)}</h1><p>${esc(fdateLong(d.date))}</p></div>`, `<button class="rbtn" id="more" aria-label="Plus d’options">${ic('dots', 2.6)}</button>`)}
    <div class="paper">${(d.scan || d.thumb) ? `<img id="pvimg" src="${d.scan || d.thumb}" alt="Aperçu du document">` : `<div class="noprev">${ic('file')}Aperçu indisponible</div>`}
      ${d.scan ? `<span class="scanbadge">Scan nettoyé</span><button class="open" id="orig" data-o="${d.file}" data-s="${d.scan}" data-m="${esc(d.mime || '')}">${ic('camera', 2)}Voir l’original</button>` : ''}</div>
    <div class="dinfo">
      <a class="tag" href="#/cat/${encodeURIComponent(d.category)}" style="--t:${t};--d:${dk}">${esc(d.category)}</a>${d.status === 'enriching' ? ' <span class="tag ai">Analyse IA…</span>' : ''}
      <div class="summary"><span class="spk" aria-hidden="true">${ic('sparkle', 1.8)}</span><p>${esc(d.summary)}</p></div>
      ${w}
      <dl class="kv"><div><dt>Date</dt><dd>${fdateLong(d.date)}</dd></div>${d.issuer ? `<div><dt>Émetteur</dt><dd>${esc(d.issuer)}</dd></div>` : ''}${d.amount != null ? `<div><dt>Montant</dt><dd>${money(d.amount)}</dd></div>` : ''}
        ${ents.map(([k, v]) => `<div><dt>${esc(k[0].toUpperCase() + k.slice(1))}</dt><dd>${esc(v)}</dd></div>`).join('')}<div><dt>Fichier</dt><dd class="fn">${esc(d.filename)}</dd></div></dl>
      <label class="recat"><span>Catégorie</span><select id="recat">${ME.categories.map(c => `<option ${c === d.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select></label>
      <details class="act"><summary>${ic('sparkle')}Ce que Zip a fait</summary><ol>${d.steps.map(s => `<li>${esc(s.s)}</li>`).join('')}</ol></details>
    </div>
    <div class="dock" role="toolbar" aria-label="Actions">
      <button id="shr">${ic('share', 2)}<span>Partager</span></button>
      <a href="${d.file}" download="${esc(d.filename)}" id="dl">${ic('down', 2)}<span>Télécharger</span></a>
      <button id="del" class="red">${ic('trash', 2)}<span>Supprimer</span></button></div>`, {nav: false, cls: 'docpage'});
}
function afterDoc(id) {
  const o = $('#orig'); if (o) o.onclick = () => { if (/pdf/i.test(o.dataset.m || '')) return window.open(o.dataset.o, '_blank'); const im = $('#pvimg'), showO = o.dataset.on !== '1'; im.src = showO ? o.dataset.o : o.dataset.s; o.dataset.on = showO ? '1' : '0';
    o.innerHTML = showO ? ic('sparkle', 2) + 'Voir le scan' : ic('camera', 2) + 'Voir l’original'; const b = $('.scanbadge'); if (b) b.textContent = showO ? 'Photo d’origine' : 'Scan nettoyé'; };
  $('#recat').onchange = async e => { await api('/api/docs/' + id, {method:'PATCH', body: JSON.stringify({category: e.target.value})}); await refreshMe(); toast('Catégorie mise à jour'); route(); };
  const del = async () => { if (!confirm('Supprimer ce document ?')) return; await api('/api/docs/' + id, {method:'DELETE'}); await refreshMe(); toast('Document supprimé'); location.hash = '#/'; };
  $('#del').onclick = del;
  $('#shr').onclick = async () => { const a = $('#dl'); try { const b = await (await fetch(a.href)).blob(); const f = new File([b], a.getAttribute('download'), {type: b.type});
    if (navigator.canShare && navigator.canShare({files: [f]})) await navigator.share({files: [f], title: document.querySelector('.dtitle h1').textContent}); else { a.click(); toast('Partage indisponible ici : fichier téléchargé'); } } catch (e) { if (e.name !== 'AbortError') toast('Partage impossible'); } };
  $('#more').onclick = () => sheet(`<div class="shead"><h3 id="shh">Options</h3><button class="rbtn" id="shx" aria-label="Fermer">${ic('close', 2.2)}</button></div><div class="menu"><a class="mrow" href="${$('#dl').href}" target="_blank">${ic('ext')}<span>Ouvrir le fichier d’origine</span>${ic('chev', 2.2)}</a><button class="mrow red" id="del2">${ic('trash')}<span>Supprimer</span>${ic('chev', 2.2)}</button></div>`, () => { $('#del2').onclick = del; });
}

// ---------- 6. Ask Zip ----------
const CHAT = JSON.parse(sessionStorage.zipChat || '[]');
const miniDoc = d => `<a class="minidoc" href="#/doc/${d.id}">${ficon(d)}<span class="dm"><b>${esc(d.title)}</b><small>${esc(fdate(d.date) || '')}</small></span><span class="chv" aria-hidden="true">${ic('chev', 2.2)}</span></a>`;
function msgHTML(m) {
  if (m.me) return `<div class="msg me">${esc(m.text)}</div>`;
  const av = `<span class="zav" aria-hidden="true">${ic('sparkle', 1.8)}</span>`;
  if (m.typing) return `<div class="msg bot">${av}<div class="bub"><div class="typing" aria-label="Zip réfléchit"><i></i><i></i><i></i></div></div></div>`;
  return `<div class="msg bot">${av}<div class="bub"><div class="txt">${esc(m.text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</div>
    ${m.docs && m.docs.length ? `<div class="results">${m.docs.slice(0, 4).map(miniDoc).join('')}</div>` : ''}
    ${m.steps ? `<details><summary class="why">Comment j’ai cherché</summary><ul class="whylist">${m.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ul></details>` : ''}</div></div>`;
}
async function vZip() {
  const chips = SmartChips.build(await Store.all());
  const total = Object.values(ME.counts).reduce((a, b) => a + b, 0);
  return shell('zip', `${topbar(`<h1 class="ttl chat-t"><span aria-hidden="true">${ic('sparkle', 1.9)}</span>Ask Zip</h1>`)}
    <div class="msgs" id="msgs" aria-live="polite">${CHAT.length ? CHAT.map(msgHTML).join('') : `<div class="msg bot"><span class="zav" aria-hidden="true">${ic('sparkle', 1.8)}</span><div class="bub"><div class="txt">Salut ${esc(ME.name)} ! Je connais tes ${total} documents. Demande-moi n’importe quoi : une facture, une garantie, une date…</div></div></div>`}</div>
    <div class="composer"><form id="cf"><input id="ci" placeholder="Pose ta question…" aria-label="Ta question pour Zip" autocomplete="off" enterkeyhint="send"><button class="send" aria-label="Envoyer la question">${ic('send', 2.4)}</button></form>
      <div class="sugg" aria-label="Suggestions basées sur tes documents">${chips.map(c => `<button type="button" data-q="${esc(c.q)}" aria-label="${esc(c.q)}">${c.generic ? '' : ic('sparkle', 2)}${esc(c.label)}</button>`).join('')}</div></div>`, {nav: false, cls: 'chatpage'});
}
async function ask(q) {
  if (!q.trim()) return;
  CHAT.push({me: true, text: q}); $('#msgs').insertAdjacentHTML('beforeend', msgHTML({me: true, text: q}) + msgHTML({typing: true}));
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
  const [r] = await Promise.all([api('/api/chat', {method:'POST', body: JSON.stringify({message: q})}), new Promise(s => setTimeout(s, 550))]);
  const m = {text: r.reply, docs: r.docs, steps: r.steps}; CHAT.push(m); sessionStorage.zipChat = JSON.stringify(CHAT.slice(-30));
  $('#msgs .typing').closest('.msg').outerHTML = msgHTML(m);
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
}
function afterZip() {
  $('#cf').onsubmit = e => { e.preventDefault(); const v = $('#ci').value; $('#ci').value = ''; ask(v); };
  document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => ask(b.dataset.q));
  window.scrollTo(0, document.body.scrollHeight);
}

// ---------- 9. profile / settings ----------
function vSettings() {
  return shell('settings', `
    <header class="prof"><span class="pav" aria-hidden="true">${esc(ME.name[0])}</span><div><h1>${esc(ME.name)}</h1><p>${esc(ME.inbox)}</p></div><span class="sp"></span><a class="rbtn" href="#/prefs" aria-label="Paramètres">${ic('gear', 2)}</a></header>
    <button class="zplus" id="zplus"><span class="spk" aria-hidden="true">${ic('sparkle', 1.8)}</span><span class="tx"><b>Zip+ <span class="soon">Bientôt</span></b><small>Passe à la version premium et débloque toutes les fonctionnalités.</small></span>${ic('chev', 2.4)}</button>
    <nav class="menu" aria-label="Menu du compte">
      <a class="mrow" href="#/browse">${ic('file')}<span>Mes documents</span>${ic('chev', 2.2)}</a>
      <a class="mrow" href="#/cats">${ic('folder')}<span>Catégories</span>${ic('chev', 2.2)}</a>
      <a class="mrow" href="#/zip">${ic('sparkle')}<span>Ask Zip</span>${ic('chev', 2.2)}</a>
      <a class="mrow" href="#/prefs">${ic('gear')}<span>Paramètres</span>${ic('chev', 2.2)}</a>
      <a class="mrow" href="#/help">${ic('help')}<span>Aide & support</span>${ic('chev', 2.2)}</a></nav>
    <div class="bye" aria-hidden="true">${mimg('Autres', '', 80)}<span class="hand">À bientôt<br>sur Zip ! <i>♡</i></span></div>`);
}
function afterSettings() { $('#zplus').onclick = () => toast('Zip+ arrive bientôt'); }
function vPrefs() {
  const dark = document.documentElement.dataset.theme === 'dark';
  return shell('settings', `${topbar('<h1 class="ttl">Paramètres</h1>')}
    <div class="menu">
      <label class="mrow">${ic('moon')}<span>Mode sombre</span><input type="checkbox" role="switch" id="dk" ${dark ? 'checked' : ''} class="sw"></label>
      <a class="mrow" href="#/inbox">${ic('mail')}<span>Adresse e-mail Zip <span class="soon">Bientôt</span></span>${ic('chev', 2.2)}</a>
      <a class="mrow" href="#/welcome">${ic('home')}<span>Revoir l’écran d’accueil</span>${ic('chev', 2.2)}</a>
      <button class="mrow red" id="wipe">${ic('trash')}<span>Vider ma bibliothèque</span>${ic('chev', 2.2)}</button>
      <button class="mrow red" id="lo">${ic('out')}<span>Réinitialiser la démo</span>${ic('chev', 2.2)}</button></div>
    <p class="note">Démo : tes documents restent uniquement sur cet appareil (aucun envoi vers un serveur). N’importe pas de vrais documents sensibles.</p>`);
}
function afterPrefs() { $('#dk').onchange = e => { document.documentElement.dataset.theme = localStorage.zipTheme = e.target.checked ? 'dark' : 'light'; }; $('#lo').onclick = resetDemo; $('#wipe').onclick = wipeAll; }
async function wipeAll() {
  if (!confirm('Supprimer tous les documents de cet appareil ? Cette action est définitive.')) return;
  await Store.wipe(); sessionStorage.removeItem('zipChat'); CHAT.length = 0; await refreshMe(); toast('Bibliothèque vidée'); location.hash = '#/browse';
}
function vCats() {
  const cats = ME.categories.filter(c => c !== 'Autres' || ME.counts[c]);
  return shell('docs', `${topbar('<h1 class="ttl">Catégories</h1>')}<div class="menu">${cats.map(c => catRow(c)).join('')}</div>`);
}
const catRow = (c, input = false) => { const n = ME.counts[c] || 0, [t] = tint(c);
  const inner = `<span class="cav" style="--t:${t}" aria-hidden="true">${mimg(c, '', 52)}</span><b>${esc(c)}</b><small>${ndocs(n)}</small>${ic('chev', 2.2)}`;
  return input ? `<label class="crow">${inner}<input type="file" multiple accept="image/*,application/pdf" class="fi2 vh" data-cat="${esc(c)}" aria-label="Ajouter un document dans ${esc(c)}"></label>` : `<a class="crow" href="#/cat/${encodeURIComponent(c)}">${inner}</a>`; };
function vHelp() {
  return shell('settings', `${topbar('<h1 class="ttl">Aide & support</h1>')}
    <div class="menu text"><div><b>Comment ajouter un document ?</b><p>Touche <b>+</b> : « Scanner » prend une photo (recadrage et nettoyage automatiques), « Importer » prend un PDF ou une image.</p></div>
    <div><b>Comment retrouver un document ?</b><p>Utilise la recherche de l’accueil ou demande à <b>Ask Zip</b> : « la facture de mon canapé », « mon avis d’imposition »…</p></div>
    <div><b>Où sont mes données ?</b><p>Dans cette démo, uniquement sur cet appareil (stockage local du navigateur).</p></div></div>`);
}
function vInbox() {
  return shell('settings', `${topbar('<h1 class="ttl">Adresse e-mail Zip</h1>')}
    <div class="menu text"><div><b>${esc(ME.inbox)} <span class="soon">Bientôt</span></b><p>Donne cette adresse en magasin ou pour tes commandes : chaque facture reçue sera lue, classée et rangée automatiquement. Pas encore active dans cette démo, utilise « Importer » en attendant.</p></div></div>
    <button class="btn primary wide" id="cp">${ic('copy', 2)}Copier l’adresse</button>`);
}
function afterInbox() { $('#cp').onclick = () => { navigator.clipboard?.writeText(ME.inbox); toast('Adresse copiée'); }; }

// ---------- 4. add sheet ----------
function sheet(html, after) {
  $('#sheet-root').innerHTML = `<div class="scrim" id="scrim"></div><div class="sheet" role="dialog" aria-modal="true" aria-labelledby="shh">${html}</div>`;
  $('#scrim').onclick = closeSheet; const x = $('#shx'); if (x) x.onclick = closeSheet; wire(); after && after(); const f = $('.sheet button, .sheet a, .sheet label'); f && f.focus?.({preventScroll: true});
}
function closeSheet() { $('#sheet-root').innerHTML = ''; }
function openAdd(cat) {
  if (cat) { const i = document.createElement('input'); i.type = 'file'; i.multiple = true; i.accept = 'image/*,application/pdf'; i.className = 'vh'; i.id = 'fi'; i.onchange = () => i.files.length && uploadFiles(i.files, cat); document.body.appendChild(i); setTimeout(() => i.remove(), 60000); i.click(); return; }
  const cats = ME.categories.filter(c => c !== 'Autres' || ME.counts[c]);
  sheet(`<div class="shead"><button class="rbtn ghost" id="shx2" aria-label="Retour">${ic('back', 2.2)}</button><h3 id="shh">Ajouter un document</h3><button class="rbtn ghost" id="shx" aria-label="Fermer">${ic('close', 2.2)}</button></div>
    <div class="tiles">
      <label class="tile">${ic('camera', 1.8)}<b>Scanner</b><small>Prendre une photo</small><input type="file" accept="image/*" capture="environment" class="fi2 vh" aria-label="Scanner : prendre une photo"></label>
      <label class="tile" id="drop">${ic('up', 1.8)}<b>Importer</b><small>PDF ou image</small><input type="file" id="fi" multiple accept="image/*,application/pdf" class="fi2 vh" aria-label="Importer : PDF ou image"></label></div>
    <h4>Ou depuis une catégorie</h4><div class="menu clist">${cats.map(c => catRow(c, true)).join('')}</div>
    <p class="note">${ic('mail', 2)} Par e-mail : <b>${esc(ME.inbox)}</b> <span class="soon">Bientôt</span></p>`, () => { $('#shx2').onclick = closeSheet; });
  const d = $('#drop');
  d.ondragover = e => { e.preventDefault(); d.classList.add('over'); }; d.ondragleave = () => d.classList.remove('over');
  d.ondrop = e => { e.preventDefault(); e.dataTransfer.files.length && uploadFiles(e.dataTransfer.files); };
}

// ---------- processing + 8. success ----------
function openProcessing() {
  $('#sheet-root').innerHTML = `<div class="overlay proc" role="dialog" aria-modal="true" aria-labelledby="shh"><div class="pw">
    <img class="mz" src="m/hero.webp" alt="" width="130"><h3 id="shh">Zip range ton document…</h3>
    <p id="pmsg" role="status">Lecture du document…</p><div class="pbar"><i id="pbar"></i></div><div class="steps" id="ps"></div></div></div>`;
}
let lastStep = '';
function onProgress(msg, f) {
  const m = $('#pmsg'); if (m) m.textContent = msg; const b = $('#pbar'); if (b && f != null) b.style.width = Math.round(f * 100) + '%';
  const key = msg.replace(/[\d %…]+$/, '');
  if (key !== lastStep && !/\d+ %/.test(msg)) { lastStep = key; const ps = $('#ps'); ps && ps.insertAdjacentHTML('beforeend', `<div>${ic('check', 2.6)}${esc(msg.replace(/…$/, ''))}</div>`); }
}
async function uploadFiles(files, cat) {
  const fd = new FormData(); [...files].forEach(f => fd.append('files', f));
  openProcessing();
  try {
    let [r] = await Promise.all([api('/api/upload', {method:'POST', body: fd, progress: onProgress}), new Promise(s => setTimeout(s, 700))]);
    if (cat) r = {docs: await Promise.all(r.docs.map(d => d.category === cat ? d : api('/api/docs/' + d.id, {method:'PATCH', body: JSON.stringify({category: cat})})))};
    await refreshMe(); showResult(r.docs);
    if (r.errors && r.errors.length) setTimeout(() => toast(r.errors.length > 1 ? `${r.errors.length} fichiers n’ont pas pu être importés` : r.errors[0]), 300);
  } catch (e) { closeSheet(); toast(e && e.fr ? e.message : 'Import impossible : ' + frErr(e)); }
}
const frErr = e => { const m = String(e && e.message || e || ''); return /quota|space|full/i.test(m) ? 'espace de stockage plein sur cet appareil.' : /network|fetch|load/i.test(m) ? 'problème de connexion.' : 'erreur inattendue, réessaie.'; };
const lowerTitle = t => String(t || "document").split(" — ")[0];
function showResult(docs) {
  const d = docs[0] || {}, c = d.category || 'Autres', [t, dk] = tint(c), many = docs.length > 1;
  if (!many && d.unreadable) return showUnreadable(d);
  const art = d.thumb ? `<span class="flydoc" style="background-image:url(${d.thumb})"></span>` : `<span class="flydoc"></span>`;
  $('#sheet-root').innerHTML = `<div class="overlay success" role="dialog" aria-modal="true" aria-labelledby="shh" style="--t:${t};--d:${dk}"><div class="sw2">
    <div class="sart" aria-hidden="true">${art}<img class="mz smasc" src="m/success.webp" alt="" width="200"><span class="okb">${ic('check', 3)}</span></div>
    <h2 id="shh">${many ? docs.length + ' documents ajoutés !' : 'Document ajouté !'}</h2>
    <p>${many ? `Tes documents ont bien été rangés automatiquement.` : `Ton document « ${esc(lowerTitle(d.title))} » a bien été enregistré dans <b>${esc(c)}</b>.`}</p>
    <button class="btn primary big" id="okb">Voir mes documents</button>
    <button class="btn text" id="okd">${many ? 'Fermer' : 'Ouvrir ce document'}</button></div></div>`;
  $('#okb').onclick = () => { closeSheet(); const h = '#/cat/' + encodeURIComponent(c); location.hash === h ? route() : (location.hash = h); };
  $('#okd').onclick = () => { closeSheet(); if (many || !d.id) return route(); location.hash = '#/doc/' + d.id; };
  $('#okb').focus({preventScroll: true});
}

function showUnreadable(d) {
  const [t, dk] = tint('Autres');
  $('#sheet-root').innerHTML = `<div class="overlay success" role="dialog" aria-modal="true" aria-labelledby="shh" style="--t:${t};--d:${dk}"><div class="sw2">
    <div class="sart" aria-hidden="true">${d.thumb ? `<span class="flydoc" style="background-image:url(${d.thumb})"></span>` : '<span class="flydoc"></span>'}<img class="mz smasc" src="m/hero.webp" alt="" width="200"></div>
    <h2 id="shh">${esc(d.title)}</h2>
    <p>${esc(d.summary)}</p>
    <button class="btn primary big" id="okr">Supprimer et réessayer</button>
    <button class="btn text" id="okk">Garder quand même (dans « Autres »)</button></div></div>`;
  $('#okr').onclick = async () => { await api('/api/docs/' + d.id, {method: 'DELETE'}); await refreshMe(); closeSheet(); openAdd(); };
  $('#okk').onclick = () => { closeSheet(); location.hash = '#/doc/' + d.id; };
  $('#okr').focus({preventScroll: true});
}

// ---------- router ----------
async function refreshMe() { ME = await api('/api/me'); }
let prevHash = '';
async function route() {
  closeSheet();
  const h = decodeURIComponent(location.hash.slice(1) || '/'); const [, a, b] = h.split('/');
  if (!a && !localStorage.zipWelcomed) return renderView(vWelcome(), afterWelcome, 'welcome');
  let html, after, kind = a || 'home';
  try {
    if (!a) { html = await vHome(); after = afterHome; }
    else if (a === 'welcome') { html = vWelcome(); after = afterWelcome; }
    else if (a === 'browse') { html = await vBrowse(); after = afterBrowse; }
    else if (a === 'cat') { html = await vCat(b); after = () => afterCat(b); }
    else if (a === 'doc') { html = await vDoc(b); after = () => afterDoc(b); }
    else if (a === 'zip') { html = await vZip(); after = afterZip; }
    else if (a === 'settings') { html = vSettings(); after = afterSettings; }
    else if (a === 'prefs') { html = vPrefs(); after = afterPrefs; }
    else if (a === 'cats') html = vCats();
    else if (a === 'help') html = vHelp();
    else if (a === 'inbox') { html = vInbox(); after = afterInbox; }
    else { html = await vHome(); after = afterHome; }
  } catch (e) { html = shell('', empty('Oups', esc(e.message), false)); }
  renderView(html, after, kind);
}
function renderView(html, after, kind) {
  const app = $('#app'); app.innerHTML = html; app.dataset.view = kind;
  wire(); after && after();
  if (kind !== 'zip') window.scrollTo(0, 0);
  // Pages avec barre du bas : fond html/body = fond de la barre (Safari 26 teinte la zone sous sa barre flottante avec ce fond).
  document.documentElement.classList.toggle('hasnav', !!app.querySelector('.tabbar, .dock, .composer'));
  if (kind === 'home') a2hs();
}
// ---------- barre du bas : compense une barre de navigateur qui recouvre le bas de la page (iOS 26.0, WebViews) ----------
(() => {
  const vv = window.visualViewport; if (!vv) return; let raf = 0, last = -1;
  const upd = () => { raf = 0; if (Math.abs(vv.scale - 1) > 0.01) return; // pas pendant un zoom
    const hidden = Math.max(0, Math.round(innerHeight - vv.height - vv.offsetTop));
    const v = hidden > 0 && hidden < 140 ? hidden : 0; // clavier ouvert (> 140 px) : on ne bouge pas la barre
    if (v !== last) { last = v; document.documentElement.style.setProperty('--vvb', v + 'px'); } };
  const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
  vv.addEventListener('resize', q); vv.addEventListener('scroll', q); addEventListener('orientationchange', q); q();
})();
// ---------- suggestion « Ajouter à l'écran d'accueil » (iPhone/iPad Safari, une seule fois) ----------
function a2hs() {
  const ua = navigator.userAgent, ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  const inApp = /FBAN|FBAV|Instagram|Line\/|Twitter|LinkedInApp|GSA\/|CriOS|FxiOS|EdgiOS|Snapchat|TikTok|Telegram|Discord/.test(ua) || (ios && !/Safari\//.test(ua));
  if (!ios || standalone || localStorage.zipA2hs || $('#a2hs')) return;
  const el = document.createElement('div'); el.id = 'a2hs'; el.className = 'a2hs'; el.setAttribute('role', 'note');
  el.innerHTML = inApp
    ? `<span class="a2i" aria-hidden="true">${ic('ext', 2)}</span><span class="a2t"><b>Ouvre Zip dans Safari</b><small>Puis Partager › « Sur l’écran d’accueil » pour l’utiliser comme une vraie app.</small></span><button class="a2x" aria-label="Masquer ce conseil">${ic('close', 2.2)}</button>`
    : `<span class="a2i" aria-hidden="true">${ic('share', 2)}</span><span class="a2t"><b>Installe Zip comme une app</b><small>Touche Partager ${ic('share', 2)} puis « Sur l’écran d’accueil » : plein écran, sans barre Safari.</small></span><button class="a2x" aria-label="Masquer ce conseil">${ic('close', 2.2)}</button>`;
  const lead = $('.lead'); lead && lead.after(el);
  el.querySelector('.a2x').onclick = () => { localStorage.zipA2hs = '1'; el.remove(); };
}
const debounce = (f, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
addEventListener('hashchange', route);
addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); location.hash = '#/zip'; } if (e.key === 'Escape') closeSheet(); });
async function resetDemo() {
  if (!confirm('Réinitialiser la démo ? Les documents importés sur cet appareil seront effacés.')) return;
  closeSheet(); await Store.reset(); sessionStorage.removeItem('zipChat'); CHAT.length = 0; await refreshMe(); toast('Démo réinitialisée'); location.hash = '#/'; route();
}
async function boot() {
  $('#app').innerHTML = `<div class="boot"><img class="logo xl" src="logo.svg" alt="Zip" width="148" height="97"><p>Préparation de ton espace…</p></div>`;
  try { await Store.ready(); await refreshMe(); } catch (e) { $('#app').innerHTML = `<div class="boot">${empty('Stockage indisponible', 'Ce navigateur bloque le stockage local (navigation privée ?). Ouvre Zip dans un onglet normal.', false)}</div>`; console.warn(e); return; }
  route();
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then(r => r.active && r.active.postMessage('warm-libs')).catch(() => {});
boot();
