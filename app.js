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
const toast = (m) => { const t = $('#toast'); t.innerHTML = ic('check', 2.2).replace('<svg', '<svg width="17" height="17"') + esc(m); t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2600); };

// theme
document.documentElement.dataset.theme = localStorage.zipTheme === 'dark' ? 'dark' : 'light';
function toggleTheme() {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = localStorage.zipTheme = dark ? 'light' : 'dark';
}

// ---------- auth ----------
function renderAuth(mode = 'login') {
  $('#app').innerHTML = `<div class="auth"><div class="box glass fade-in">
    <div class="orb lg" style="margin:0 auto"></div>
    <h1>${mode === 'login' ? 'Bon retour sur Zip' : 'Bienvenue sur Zip'}</h1>
    <p>Vos documents, rangés pour vous.<br>Ordonnances, factures, billets — retrouvés en une phrase.</p>
    <form id="af">
      ${mode === 'register' ? '<div class="field"><label>Prénom</label><input name="name" autocomplete="given-name" required></div>' : ''}
      <div class="field"><label>E-mail</label><input name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label>Mot de passe</label><input name="password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" minlength="8" required></div>
      <div class="err" id="aerr"></div>
      <button class="btn primary">${mode === 'login' ? 'Se connecter' : 'Créer mon espace'}</button>
    </form>
    <div class="sw">${mode === 'login' ? 'Pas encore de compte ? <button id="sw">Créer un compte</button>' : 'Déjà inscrit ? <button id="sw">Se connecter</button>'}</div>
  </div></div>`;
  $('#sw').onclick = () => renderAuth(mode === 'login' ? 'register' : 'login');
  $('#af').onsubmit = async e => {
    e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
    try { await api('/api/' + (mode === 'login' ? 'login' : 'register'), {method:'POST', body: JSON.stringify(f)}); boot(); }
    catch (err) { $('#aerr').textContent = err.message; }
  };
}

// ---------- shell ----------
function shell(active, inner) {
  const counts = ME.counts || {};
  const nav = (h, n, label, on) => `<a class="navi ${on ? 'on' : ''}" href="${h}" ${on ? 'aria-current="page"' : ''}>${ic(n)}<span>${label}</span></a>`;
  const isDocs = active === 'grid' || String(active).startsWith('cat:');
  const tab = (h, n, label, on) => `<a href="${h}" class="${on ? 'on' : ''}" ${on ? 'aria-current="page"' : ''}>${ic(n, 2)}<span>${label}</span></a>`;
  return `<div class="shell">
    <aside class="side" aria-label="Menu principal">
      <div class="brand"><div class="logo" aria-hidden="true">Z</div>Zip</div>
      ${nav('#/', 'home', 'Accueil', active === 'home')}${nav('#/zip', 'sparkle', 'Ask Zip', active === 'spark')}${nav('#/browse', 'docs', 'Documents', isDocs)}
      <button class="btn primary" style="width:100%;margin:10px 0" data-add>${ic('plus', 2.2)}Ajouter un document</button>
      <div class="sep">Catégories</div>
      ${ME.categories.filter(c => counts[c]).map(c => `<a class="navi ${active === 'cat:' + c ? 'on' : ''}" href="#/cat/${encodeURIComponent(c)}"><span class="mini" aria-hidden="true">${Mascot.svg(c, 26)}</span><span>${esc(c)}</span><span class="n">${counts[c]}</span></a>`).join('')}
      <div class="foot">${nav('#/settings', 'gear', 'Réglages', active === 'settings')}</div>
    </aside>
    <main class="main" id="main">${inner}</main>
    <nav class="tabbar" aria-label="Navigation principale">
      ${tab('#/', 'home', 'Accueil', active === 'home')}
      ${tab('#/zip', 'sparkle', 'Ask Zip', active === 'spark')}
      <button class="tadd" data-add aria-label="Ajouter un document"><span class="pl">${ic('plus', 2.4)}</span><span>Ajouter</span></button>
      ${tab('#/browse', 'docs', 'Documents', isDocs)}
      ${tab('#/settings', 'gear', 'Réglages', active === 'settings')}
    </nav></div>`;
}
const askBar = (ph = 'Retrouve un document, une garantie…') => `<a class="askbar" href="#/zip" aria-label="Ask Zip : poser une question sur vos documents">
  <span class="spk" aria-hidden="true">${ic('sparkle', 1.8)}</span><span class="tx"><b>Ask Zip</b><span>${ph}</span></span></a>`;
function wire() {
  document.querySelectorAll('[data-add]').forEach(b => b.onclick = () => openAdd());
  document.querySelectorAll('.fi2').forEach(i => i.onchange = e => e.target.files.length && uploadFiles(e.target.files));
  const th = $('#th'); if (th) th.onclick = toggleTheme;
  const lo = $('#lo'); if (lo) lo.onclick = resetDemo;
}

// ---------- components ----------
const badge = c => `<span class="badge" style="--c:${COL[c]}">${ic(c, 2.2)}</span>`;
const thumb = d => `<div class="thumb" style="${d.thumb ? `background-image:url(${d.thumb})` : ''}">${badge(d.category)}</div>`;
const row = (d, i = 0) => `<a class="row glass" href="#/doc/${d.id}" style="animation-delay:${i * 40}ms">${thumb(d)}
  <div class="meta"><div class="t">${esc(d.title)}</div><div class="s">${esc([d.issuer, fdate(d.date)].filter(Boolean).join(' · '))}</div>
  <div class="tags"><span class="chip c" style="--c:${COL[d.category]}">${esc(d.category)}</span>${d.warranty_end && d.warranty_end >= today() ? '<span class="chip ok">Sous garantie</span>' : ''}${d.status === 'enriching' ? '<span class="chip ai">Analyse IA…</span>' : ''}<span class="chip">${SRC[d.source] || d.source}</span></div></div>
  ${d.amount != null ? `<div class="amt">${money(d.amount)}</div>` : ''}</a>`;
const card = (d, i = 0) => `<a class="card glass" href="#/doc/${d.id}" style="animation-delay:${i * 50}ms"><div class="pv" style="${d.thumb ? `background-image:url(${d.thumb})` : ''}"></div>
  <div class="bd"><span class="chip c" style="--c:${COL[d.category]}">${esc(d.category)}</span>${d.status === 'enriching' ? ' <span class="chip ai">Analyse IA…</span>' : ''}<div class="t" style="margin-top:8px">${esc(d.title)}</div><div class="s">${esc([fdate(d.date), d.amount != null ? money(d.amount) : ''].filter(Boolean).join(' · '))}</div></div></a>`;
const today = () => new Date().toISOString().slice(0, 10);
const empty = (h, p, cta = true) => `<div class="empty-st"><div class="art"><i></i><i></i><i></i></div><h3>${h}</h3><p>${p}</p>${cta ? `<button class="btn primary" data-add style="margin-top:8px">${ic('plus', 2.2)}Ajouter un document</button>` : ''}</div>`;
const greet = () => { const h = new Date().getHours(); return h < 6 ? 'Bonne nuit' : h < 18 ? 'Bonjour' : 'Bonsoir'; };

// ---------- views ----------
async function vHome() {
  const cats = ME.categories.filter(c => c !== 'Autres' || ME.counts[c]);
  const total = Object.values(ME.counts).reduce((x, y) => x + y, 0);
  return shell('home', `
    <header class="homebar"><div><h1 class="wordmark">Zip</h1><p class="sub">${total} document${total > 1 ? 's' : ''} rangé${total > 1 ? 's' : ''}</p></div></header>
    ${askBar()}
    <section aria-labelledby="hadd"><h2 class="sec" id="hadd">Ajouter un document</h2>
    <div class="addrow">
      <label class="addbtn">${ic('camera', 2)}<span><b>Scanner</b><small>Prendre une photo</small></span><input type="file" accept="image/*" capture="environment" class="fi2 vh" aria-label="Scanner un document avec l’appareil photo"></label>
      <label class="addbtn">${ic('up', 2)}<span><b>Importer</b><small>PDF ou image</small></span><input type="file" multiple accept="image/*,application/pdf" class="fi2 vh" aria-label="Importer un fichier PDF ou une image"></label>
    </div></section>
    <section aria-labelledby="hcat"><h2 class="sec" id="hcat">Catégories</h2>
    <ul class="catlist" role="list">${cats.map(c => { const n = ME.counts[c] || 0; return `<li><a class="catrow" href="#/cat/${encodeURIComponent(c)}">
      <span class="av" aria-hidden="true">${Mascot.svg(c, 40)}</span><span class="nm">${esc(c)}</span><span class="ct">${n ? n + ' doc' + (n > 1 ? 's' : '') : 'Vide'}</span><span class="chv" aria-hidden="true">${ic('chev', 2)}</span></a></li>`; }).join('')}</ul></section>
    <p class="demo-note">Démo : vos données restent sur cet appareil. N’importez pas de documents sensibles.</p>
  `);
}
async function vBrowse(q = '') {
  const {docs} = await api('/api/docs' + (q ? '?q=' + encodeURIComponent(q) : ''));
  return shell('grid', `
    <h1 class="big">Documents</h1>${askBar()}
    <label class="search glass">${ic('search')}<input id="sq" placeholder="Filtrer : nom, magasin, médecin…" aria-label="Filtrer les documents" value="${esc(q)}"></label>
    <div class="seg"><button class="on">Tout</button>${ME.categories.filter(c => ME.counts[c]).map(c => `<button onclick="location.hash='#/cat/${encodeURIComponent(c)}'">${esc(c)}</button>`).join('')}</div>
    ${docs.length ? `<div class="grid">${docs.map(card).join('')}</div>` : (q ? empty('Aucun résultat', `Rien ne correspond à « ${esc(q)} ». Essayez un autre mot, ou demandez à Zip.`, false) : empty('Rien ici pour l’instant', 'Vos documents apparaîtront ici, classés automatiquement.'))}
  `);
}
async function vCat(c) {
  const {docs} = await api('/api/docs?category=' + encodeURIComponent(c));
  const total = docs.reduce((a, d) => a + (d.amount || 0), 0);
  return shell('cat:' + c, `
    <div class="topbar"><a class="iconbtn" href="#/" aria-label="Retour à l’accueil">${ic('back', 2)}</a></div>
    <div class="chead"><span class="av" aria-hidden="true">${Mascot.svg(c, 44)}</span><div><h1>${esc(c)}</h1><p>${docs.length} document${docs.length > 1 ? 's' : ''}${total ? ' · ' + money(total) : ''}</p></div></div>
    ${askBar('Une question sur ces documents ?')}
    ${docs.length ? `<div class="grid">${docs.map(card).join('')}</div>` : empty('Aucun document ici', `Dès qu’un document ${c === 'Santé' ? 'médical' : 'de cette catégorie'} arrivera, Zip le rangera ici.`)}
  `);
}
async function vDoc(id) {
  const d = await api('/api/docs/' + id);
  const ents = Object.entries(d.entities || {});
  let w = '';
  if (d.warranty_end) {
    const s = new Date(d.date), e = new Date(d.warranty_end), n = new Date();
    const p = Math.max(0, Math.min(100, (e - n) / (e - s) * 100));
    w = `<div class="warranty glass"><div class="ring" style="--p:${p}%"></div><div><b style="font-size:15px">${e > n ? 'Sous garantie' : 'Garantie expirée'}</b><div class="muted" style="font-size:13.5px;margin-top:2px">Jusqu’au ${fdateLong(d.warranty_end)}</div></div></div>`;
  }
  return shell('cat:' + d.category, `
    <div class="topbar"><button class="iconbtn" onclick="history.back()" aria-label="Retour">${ic('back', 2)}</button><span class="eyebrow">${SRC[d.source] || ''}</span><a class="iconbtn" href="${d.file}" target="_blank" aria-label="Ouvrir le fichier d’origine">${ic('ext', 2)}</a></div>
    <div class="detail" style="margin-top:12px">
      <div class="preview">${(d.scan || d.thumb) ? `<img id="pvimg" src="${d.scan || d.thumb}" alt="">` : `<div style="padding:60px;text-align:center" class="muted">${ic('file')}Aperçu indisponible</div>`}
        ${d.scan ? `<button class="open" id="orig" data-o="${d.file}" data-s="${d.scan}" data-m="${esc(d.mime || '')}">${ic('camera', 2)}Voir l’original</button>${'<span class="scanbadge">Scan nettoyé</span>'}` : `<a class="open" href="${d.file}" target="_blank">${ic('ext', 2)}Ouvrir l’original</a>`}</div>
      <div class="dt" style="display:flex;flex-direction:column;gap:14px">
        <div><span class="chip c" style="--c:${COL[d.category]}">${ic(d.category, 2).replace('<svg', '<svg width="11" height="11" style="vertical-align:-1px;margin-right:4px"')}${esc(d.category)}</span>${d.status === 'enriching' ? ' <span class="chip ai">Analyse IA en cours…</span>' : ''}
        <h1>${esc(d.title)}</h1><div class="muted" style="font-size:14.5px">${esc([d.issuer, fdateLong(d.date)].filter(Boolean).join(' · '))}</div></div>
        <div class="summary glass"><div class="orb sm"></div><div>${esc(d.summary)}</div></div>
        ${w}
        <div class="kv glass">
          <div><span>Date</span><b>${fdateLong(d.date)}</b></div>
          ${d.issuer ? `<div><span>Émetteur</span><b>${esc(d.issuer)}</b></div>` : ''}
          ${d.amount != null ? `<div><span>Montant</span><b>${money(d.amount)}</b></div>` : ''}
          ${ents.map(([k, v]) => `<div><span>${esc(k[0].toUpperCase() + k.slice(1))}</span><b>${esc(v)}</b></div>`).join('')}
          <div><span>Fichier</span><b style="font-weight:450">${esc(d.filename)}</b></div>
        </div>
        <details class="act glass"><summary><div class="orb sm" style="width:22px;height:22px"></div>Ce que Zip a fait<span style="margin-left:auto;color:var(--ink3)">${ic('chev')}</span></summary>
          <ol>${d.steps.map(s => `<li>${esc(s.s)}</li>`).join('')}</ol></details>
        <div class="actions"><select class="pill" id="recat">${ME.categories.map(c => `<option ${c === d.category ? 'selected' : ''}>${esc(c)}</option>`).join('')}</select>
          <button class="btn danger" id="del">${ic('trash')}Supprimer</button></div>
      </div></div>`);
}
function afterDoc(id) {
  const o = $('#orig'); if (o) o.onclick = () => { if (/pdf/i.test(o.dataset.m || '')) return window.open(o.dataset.o, '_blank'); const im = $('#pvimg'), showO = o.dataset.on !== '1'; im.src = showO ? o.dataset.o : o.dataset.s; o.dataset.on = showO ? '1' : '0';
    o.innerHTML = showO ? ic('spark', 2) + 'Voir le scan' : ic('camera', 2) + 'Voir l’original'; const b = $('.scanbadge'); if (b) b.textContent = showO ? 'Photo d’origine' : 'Scan nettoyé'; };
  $('#recat').onchange = async e => { await api('/api/docs/' + id, {method:'PATCH', body: JSON.stringify({category: e.target.value})}); await refreshMe(); toast('Catégorie mise à jour'); route(); };
  $('#del').onclick = async () => { if (!confirm('Supprimer ce document ?')) return; await api('/api/docs/' + id, {method:'DELETE'}); await refreshMe(); toast('Document supprimé'); location.hash = '#/'; };
}

// assistant
const CHAT = JSON.parse(sessionStorage.zipChat || '[]');
function msgHTML(m) {
  if (m.me) return `<div class="msg me">${esc(m.text)}</div>`;
  if (m.typing) return `<div class="msg bot"><div class="typing"><i></i><i></i><i></i></div></div>`;
  return `<div class="msg bot"><div class="txt">${esc(m.text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</div>
    ${m.docs && m.docs.length ? `<div class="results">${m.docs.map(card).join('')}</div>` : ''}
    ${m.steps ? `<details><summary class="why">${ic('spark').replace('<svg', '<svg width="13" height="13"')}Comment j’ai cherché</summary><ul class="whylist">${m.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ul></details>` : ''}</div>`;
}
function vZip() {
  return shell('spark', `<div class="chat">
    <div class="chathead" id="zh"><span class="spk" aria-hidden="true">${ic('sparkle', 1.8)}</span><div><h1 class="name">Ask Zip</h1><div class="st" id="zst" role="status">${Object.values(ME.counts).reduce((a, b) => a + b, 0)} documents · tout reste sur cet appareil</div></div></div>
    <div class="msgs" id="msgs">${CHAT.length ? CHAT.map(msgHTML).join('') : `<div style="text-align:center;margin-top:10px"><div style="font-size:1.4rem;font-weight:650;letter-spacing:-.02em">Que cherchez-vous ?</div><div class="muted" style="margin-top:6px">Décrivez-le comme à un ami. Zip retrouve le bon papier.</div>
      <div class="suggest">${['Retrouve mon ordonnance du docteur Philippe', 'La facture de mon canapé', 'Mon avis d’imposition', 'Qu’est-ce qui est sous garantie ?', 'Mon billet de train pour Paris'].map(s => `<button data-q="${esc(s)}">${esc(s)}</button>`).join('')}</div></div>`}</div>
    <div class="composer"><form id="cf"><input id="ci" placeholder="Posez votre question…" aria-label="Votre question pour Zip" autocomplete="off"><button aria-label="Envoyer la question">${ic('send', 2.2)}</button></form></div></div>`);
}
async function ask(q) {
  if (!q.trim()) return;
  if (!CHAT.length) $('#msgs').innerHTML = ''; 
  CHAT.push({me: true, text: q}); $('#msgs').insertAdjacentHTML('beforeend', msgHTML({me: true, text: q}) + msgHTML({typing: true}));
  $('#zst').innerHTML = 'Je lis vos documents…'; const slow = setTimeout(() => { const z = $('#zst'); if (z) z.innerHTML = 'Je rédige la réponse…'; }, 2500);
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
  const [r] = await Promise.all([api('/api/chat', {method:'POST', body: JSON.stringify({message: q})}), new Promise(s => setTimeout(s, 650))]);
  clearTimeout(slow); const m = {text: r.reply, docs: r.docs, steps: r.steps}; CHAT.push(m); sessionStorage.zipChat = JSON.stringify(CHAT.slice(-30));
  $('#msgs .typing').parentElement.outerHTML = msgHTML(m);
  $('#zst').innerHTML = `${r.docs.length ? r.docs.length + ' résultat' + (r.docs.length > 1 ? 's' : '') : 'Prêt'}`;
  window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
}
function afterZip() {
  $('#cf').onsubmit = e => { e.preventDefault(); const v = $('#ci').value; $('#ci').value = ''; ask(v); };
  document.querySelectorAll('[data-q]').forEach(b => b.onclick = () => ask(b.dataset.q));
  window.scrollTo(0, document.body.scrollHeight);
  if (window.__pendingAsk) { const q = window.__pendingAsk; window.__pendingAsk = null; ask(q); }
}

function vSettings() {
  const dark = document.documentElement.dataset.theme === 'dark';
  return shell('settings', `<h1 class="big">Réglages</h1>
    <ul class="setlist" role="list">
      <li><label class="setrow"><span>${ic('moon', 2)}<b>Mode sombre</b></span><input type="checkbox" role="switch" id="dk" ${dark ? 'checked' : ''} class="sw"></label></li>
      <li><a class="setrow" href="#/inbox"><span>${ic('mail', 2)}<b>Adresse e-mail Zip</b></span><span class="ct">Bientôt ${ic('chev', 2)}</span></a></li>
      <li><button class="setrow" id="lo"><span>${ic('out', 2)}<b>Réinitialiser la démo</b></span></button></li>
    </ul>
    <p class="demo-note">Démo : vos documents restent uniquement sur cet appareil (aucun envoi vers un serveur).</p>`);
}
function afterSettings() { $('#dk').onchange = e => { document.documentElement.dataset.theme = localStorage.zipTheme = e.target.checked ? 'dark' : 'light'; }; }
function vInbox() {
  return shell('mail', `
    <div class="eyebrow">Réception automatique</div><h1 class="big">Votre adresse Zip</h1>
    <p class="muted" style="font-size:15px;line-height:1.5;max-width:560px">Donnez-la en magasin ou utilisez-la pour vos commandes en ligne. Chaque facture ou reçu envoyé ici est lu, classé et rangé — sans rien faire.</p>
    <div class="mailcard"><div class="eyebrow">Votre adresse personnelle <span class="chip" style="margin-left:6px">Bientôt disponible</span></div><div class="addr">${esc(ME.inbox)}</div>
      <div class="actions"><button class="btn primary" id="cp">${ic('copy')}Copier</button></div></div>
    <div class="how glass" style="padding:18px;border-radius:22px">
      <div><span class="n">1</span><span><b>En magasin</b> — « Vous voulez la facture par e-mail ? » Donnez votre adresse Zip.</span></div>
      <div><span class="n">2</span><span><b>Zip la reçoit</b> — pièces jointes PDF, photos, ou reçu dans le corps du mail.</span></div>
      <div><span class="n">3</span><span><b>C’est rangé</b> — catégorie, montant, garantie : tout est extrait.</span></div>
    </div>
    ${ME.dev ? `<h2 class="sec">Tester la réception <span class="chip">Outil de dev</span></h2>
    <form id="sim" class="glass" style="padding:6px 18px 18px;border-radius:22px">
      <div class="field"><label>De</label><input name="sender" value="factures@maison-lumiere.example"></div>
      <div class="field"><label>Objet</label><input name="subject" value="Votre facture Maison Lumière"></div>
      <div class="field"><label>Message</label><textarea name="body" rows="3">Bonjour, veuillez trouver ci-joint votre facture. Merci pour votre achat !</textarea></div>
      <div class="field"><label>Pièce jointe (PDF ou image)</label><input type="file" name="files" accept="image/*,application/pdf"></div>
      <button class="btn primary" style="margin-top:16px">${ic('send', 2)}Simuler un e-mail entrant</button>
    </form>` : `<div class="glass" style="padding:16px 18px;border-radius:20px;margin-top:16px;font-size:13.5px;color:var(--ink2)">Bientôt disponible : dans cette démo, la réception par e-mail n’est pas encore active. En attendant, importez vos documents avec le bouton +.</div>`}`);
}
function afterInbox() {
  $('#cp').onclick = () => { navigator.clipboard?.writeText(ME.inbox); toast('Adresse copiée'); };
  if ($('#sim')) $('#sim').onsubmit = async e => {
    e.preventDefault(); const fd = new FormData(e.target);
    openProcessing('E-mail reçu');
    try { const r = await api('/api/dev/simulate-email', {method:'POST', body: fd}); await refreshMe(); showResult(r.docs); }
    catch (err) { closeSheet(); toast(err.message); }
  };
}

// ---------- add / share sheet ----------
function sheet(html) { $('#sheet-root').innerHTML = `<div class="scrim" id="scrim"></div><div class="sheet" role="dialog"><div class="grab"></div>${html}</div>`; $('#scrim').onclick = closeSheet; }
function closeSheet() { $('#sheet-root').innerHTML = ''; }
function openAdd() {
  sheet(`<h3 id="shh">Ajouter un document</h3><p class="muted">Zip lit, classe et range pour vous.</p>
    <div class="addlist">
      <label class="addopt">${ic('camera', 2)}<span><b>Scanner</b><small>Photographier un papier : recadrage et nettoyage automatiques</small></span><input type="file" accept="image/*" capture="environment" class="fi2 vh" aria-label="Scanner avec l’appareil photo"></label>
      <label class="addopt" id="drop">${ic('up', 2)}<span><b>Importer</b><small>Un PDF ou une image depuis vos fichiers</small></span><input type="file" id="fi" multiple accept="image/*,application/pdf" class="vh" aria-label="Importer un fichier"></label>
      <div class="addopt off" aria-disabled="true">${ic('mail', 2)}<span><b>Par e-mail <span class="soon">Bientôt</span></b><small>Transférez vos factures à <span class="mono">${esc(ME.inbox)}</span></small></span></div>
    </div>
    <button class="btn ghost wide" id="shc">Annuler</button>`);
  $('#shc').onclick = closeSheet; $('.sheet').setAttribute('aria-labelledby', 'shh');
  const go = files => files.length && uploadFiles(files);
  $('#fi').onchange = e => go(e.target.files); document.querySelectorAll('.fi2').forEach(i => i.onchange = e => go(e.target.files));
  const d = $('#drop');
  d.ondragover = e => { e.preventDefault(); d.classList.add('over'); }; d.ondragleave = () => d.classList.remove('over');
  d.ondrop = e => { e.preventDefault(); go(e.dataTransfer.files); };
}
function openProcessing(label = 'Analyse en cours') {
  sheet(`<div class="proc"><div class="orb lg busy"></div><h3 style="margin-top:14px">${label}</h3><div class="muted" style="font-size:14px" id="pmsg">Zip lit votre document…</div>
    <div class="pbar"><i id="pbar"></i></div><div class="steps" id="ps"></div></div>`);
}
let lastStep = '';
function onProgress(msg, f) {
  const m = $('#pmsg'); if (m) m.textContent = msg; const b = $('#pbar'); if (b && f != null) b.style.width = Math.round(f * 100) + '%';
  const key = msg.replace(/[\d %…]+$/, '');
  if (key !== lastStep && !/\d+ %/.test(msg)) { lastStep = key; const ps = $('#ps'); ps && ps.insertAdjacentHTML('beforeend', `<div>${ic('check', 2.4)}${esc(msg.replace(/…$/, ''))}</div>`); }
}
async function uploadFiles(files) {
  const fd = new FormData(); [...files].forEach(f => fd.append('files', f));
  openProcessing();
  try {
    const [r] = await Promise.all([api('/api/upload', {method:'POST', body: fd, progress: onProgress}), new Promise(s => setTimeout(s, 900))]);
    await refreshMe(); showResult(r.docs);
  } catch (e) { closeSheet(); toast(e.message); }
}
function showResult(docs) {
  sheet(`<div class="proc" style="padding-top:8px"><div style="width:56px;height:56px;border-radius:50%;background:rgba(52,211,153,.15);color:#10b981;display:grid;place-items:center">${ic('check', 2.4).replace('<svg', '<svg width="28" height="28"')}</div>
    <h3 style="margin-top:8px">${docs.length > 1 ? docs.length + ' documents rangés' : 'Rangé dans ' + esc(docs[0]?.category || '')}</h3><div class="muted" style="font-size:14px">${!docs.length ? 'Aucun document trouvé.' : docs.some(d => d.status === 'enriching') ? '<span class="orb sm busy" style="display:inline-block;width:14px;height:14px;vertical-align:-2px;margin-right:6px"></span>Le modèle IA local affine l’analyse…' : 'Zip a tout extrait automatiquement.'}</div></div>
    <div class="list" style="margin-top:16px">${docs.map(row).join('')}</div>
    <button class="btn primary" style="width:100%;margin-top:16px" id="okb">Terminé</button>`);
  $('#okb').onclick = () => { closeSheet(); route(); };
  if (docs.some(d => d.status === 'enriching')) setTimeout(async () => {
    if (!$('#okb')) return;
    const fresh = await Promise.all(docs.map(d => api('/api/docs/' + d.id)));
    const changed = fresh.some((f, i) => f.status !== docs[i].status);
    if (changed) { await refreshMe(); showResult(fresh); } else if ($('#okb')) showResult.poll = setTimeout(() => showResult(fresh), 0);
  }, 2500);
  document.querySelectorAll('.sheet .row').forEach(a => a.addEventListener('click', closeSheet));
}

// ---------- router ----------
async function refreshMe() { ME = await api('/api/me'); }
async function route() {
  closeSheet();
  const h0 = location.hash;
  const h = decodeURIComponent(location.hash.slice(1) || '/'); const [, a, b] = h.split('/');
  let html, after;
  try {
    if (!a) html = await vHome();
    else if (a === 'browse') html = await vBrowse(new URLSearchParams(location.search).get('q') || '');
    else if (a === 'cat') html = await vCat(b);
    else if (a === 'doc') { html = await vDoc(b); after = () => afterDoc(b); }
    else if (a === 'zip') { html = vZip(); after = afterZip; }
    else if (a === 'inbox') { html = vInbox(); after = afterInbox; }
    else if (a === 'settings') { html = vSettings(); after = afterSettings; }
    else html = await vHome();
  } catch (e) { if (e.message === 'auth') return; html = shell('', empty('Oups', esc(e.message), false)); }
  $('#app').innerHTML = html; wire(); after && after();
  const sq = $('#sq'); if (sq) { sq.oninput = debounce(async () => { const {docs} = await api('/api/docs?q=' + encodeURIComponent(sq.value)); const g = sq.closest('main').querySelector('.grid,.empty-st'); const nh = docs.length ? `<div class="grid">${docs.map(card).join('')}</div>` : (sq.value ? empty('Aucun résultat', 'Essayez un autre mot, ou demandez à Zip.', false) : ''); if (g) g.outerHTML = nh || '<div class="grid"></div>'; }, 220); }
  const st = $('#shareTile'); if (st) st.onclick = () => openShareInfo();
  const rst = $('#rst'); if (rst) rst.onclick = resetDemo;
  if (!a || a !== 'zip') window.scrollTo(0, 0);
  clearTimeout(route.poll);
  if (document.querySelector('.chip.ai')) route.poll = setTimeout(async () => { if (!$('#sheet-root').innerHTML && location.hash === h0) { const y = scrollY; await refreshMe(); await route(); scrollTo(0, y); } }, 3000);
}
function openShareInfo() {
  const can = !!navigator.share;
  sheet(`<h3>Partager vers Zip</h3><div class="muted" style="font-size:14.5px">Envoyez un PDF ou une photo depuis Mail, Photos, Fichiers, WhatsApp…</div>
    <div class="how" style="margin-top:18px">
      <div><span class="n">1</span><span><b>Installez Zip</b> — menu du navigateur → « Ajouter à l’écran d’accueil ».</span></div>
      <div><span class="n">2</span><span><b>Dans n’importe quelle app</b> — touchez « Partager ».</span></div>
      <div><span class="n">3</span><span><b>Choisissez Zip</b> — le document est classé en quelques secondes.</span></div></div>
    <div class="muted" style="font-size:12.5px;margin-top:14px">Dans cette démo hébergée en statique, le partage depuis une autre app n’est pas encore actif. Utilisez « Importer » : photo, fichier ou appareil photo.</div>
    <button class="btn primary" style="width:100%;margin-top:16px" data-add2>${ic('up', 2)}Importer un fichier maintenant</button>`);
  $('[data-add2]').onclick = openAdd;
}
const debounce = (f, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
addEventListener('hashchange', route);
addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); location.hash = '#/zip'; } });

async function resetDemo() {
  if (!confirm('Réinitialiser la démo ? Les documents importés sur ce téléphone seront effacés.')) return;
  closeSheet(); await Store.reset(); sessionStorage.removeItem('zipChat'); CHAT.length = 0; await refreshMe(); toast('Démo réinitialisée'); location.hash = '#/'; route();
}
async function boot() {
  $('#app').innerHTML = `<div class="auth"><div style="text-align:center"><div class="orb lg busy" style="margin:0 auto"></div><div class="muted" style="margin-top:18px;font-size:14px">Préparation de votre espace…</div></div></div>`;
  try { await Store.ready(); await refreshMe(); } catch (e) { $('#app').innerHTML = `<div class="auth"><div class="box glass">${empty('Stockage indisponible', 'Ce navigateur bloque le stockage local (navigation privée ?). ' + esc(e.message), false)}</div></div>`; return; }
  route();
}
if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
boot();
