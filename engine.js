// Zip on-device engine: French keyword classifier + field extraction + keyword assistant (port of the server's local engine).
'use strict';
const Z = (() => {
const CATEGORIES = ["Santé","Factures & achats","Logement","Banque & impôts","Travail","Administratif","Voyages","Véhicule","Assurance","Autres"];
const norm = s => String(s ?? '').replace(/€/g, ' eur').replace(/[\u202f\u00a0]/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7f]/g, '').toLowerCase();
const RULES = {
 "Santé": ["ordonnance","docteur","dr ","medecin","pharmacie","patient","posologie","cpam","mutuelle","analyse","laboratoire","comprime","consultation","kine","dentiste","remboursement"],
 "Factures & achats": ["facture","ticket de caisse","achat","commande","garantie","total ttc","tva","magasin","article","livraison","canape","meuble","quantite","prix unitaire"],
 "Logement": ["quittance","loyer","bail","proprietaire","locataire","charges locatives","edf","electricite","kwh","energie","consommation","abonnement","logement","gaz","eau","syndic","appartement"],
 "Banque & impôts": ["impot","avis d'imposition","dgfip","revenu fiscal","releve de compte","iban","banque","credit","taxe fonciere","prelevement a la source","virement"],
 "Travail": ["bulletin de paie","salaire","employeur","contrat de travail","net a payer","conges","urssaf","fiche de paie"],
 "Administratif": ["carte d'identite","passeport","etat civil","prefecture","mairie","attestation","caf","france travail","justificatif"],
 "Voyages": ["billet","sncf","tgv","vol","embarquement","reservation","hotel","train","depart","arrivee","passager","ouigo","air france"],
 "Véhicule": ["carte grise","certificat d'immatriculation","controle technique","vidange","garage","immatriculation","pneus","amende"],
 "Assurance": ["assurance","contrat d'assurance","police n","sinistre","franchise","cotisation","assure","habitation","attestation d'assurance"],
};
const TITLES = [["ordonnance","Ordonnance"],["avis d'imposition","Avis d'imposition"],["quittance","Quittance de loyer"],["bulletin de paie","Bulletin de paie"],["releve de remboursements","Relevé de remboursements"],
 ["billet","Billet de train"],["carte d'embarquement","Carte d'embarquement"],["attestation d'assurance","Attestation d'assurance"],["controle technique","Contrôle technique"],
 ["ticket de caisse","Ticket de caisse"],["facture","Facture"],["releve de compte","Relevé de compte"]];
const MONTHS = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];
const count = (t, k) => t.split(k).length - 1;
const iso = (y, m, d) => { const dt = new Date(Date.UTC(y, m - 1, d)); return dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d ? dt.toISOString().slice(0, 10) : null; };
function dates(t) {
  const out = [];
  for (const m of t.matchAll(/\b(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})\b/g)) { const x = iso(+m[3], +m[2], +m[1]); if (x) out.push(x); }
  for (const m of norm(t).matchAll(new RegExp(`\\b(\\d{1,2}) (${MONTHS.join('|')}) (\\d{4})`, 'g'))) { const x = iso(+m[3], MONTHS.indexOf(m[2]) + 1, +m[1]); if (x) out.push(x); }
  return out;
}
const addMonths = (isoD, n) => { const d = new Date(isoD + 'T00:00:00Z'); const y = d.getUTCFullYear(), m = d.getUTCMonth() + n; return iso(y + Math.floor(m / 12), (m % 12) + 1, Math.min(d.getUTCDate(), 28)); };
const num = s => parseFloat(s.replace(/ /g, '').replace(',', '.'));
const titleCase = s => s.split(/\s+/).map((w, i) => ['du','de','la','le','des'].includes(w) && i ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

function extract(text, filename = '', hint = '') {
  const t = norm(text + ' ' + filename + ' ' + hint);
  const scores = Object.fromEntries(Object.entries(RULES).map(([c, ks]) => [c, ks.reduce((a, k) => a + count(t, k), 0)]));
  const best = Math.max(...Object.values(scores));
  const category = best > 0 ? Object.keys(scores).find(c => scores[c] === best) : 'Autres';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let issuer = '';
  for (const l of lines.slice(0, 3)) {
    const c0 = l.split(/\s+[—-]\s+/)[0].replace(/\s*[({](?:fictif|fictive)[)}]/gi, '').trim();
    if (!['quittance de loyer','facture','ordonnance','ticket de caisse'].includes(norm(c0)) && c0.length > 2) { issuer = c0.slice(0, 60); break; }
  }
  if (issuer && issuer === issuer.toUpperCase() && /[A-Z]/.test(issuer)) issuer = titleCase(issuer.toLowerCase());
  const stem = filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ');
  let title = (TITLES.find(([k]) => t.includes(k)) || [])[1] || (stem ? stem.charAt(0).toUpperCase() + stem.slice(1) : 'Document');
  const entities = {};
  const md = text.match(/\b(?:Dr\.?|Docteur)\s+([A-ZÉ][\wéèï-]+(?:\s+[A-ZÉ][\wéèï-]+)?)/);
  if (md) { entities['médecin'] = 'Dr ' + md[1].trim(); if (category === 'Santé' && title !== 'Relevé de remboursements') title = `${title} — ${entities['médecin']}`; }
  const nt = norm(text); let amount = null;
  for (const re of [/(?:total\s*ttc|net\s*a\s*payer|reste\s*a\s*payer|montant\s*total|cotisation annuelle|prix total|total rembourse[^:]*)\s*[:-]?\s*(\d{1,3}(?: \d{3})*[.,]\d{2})\s*eur/, /(?:total|prix|montant)\s*[:-]?\s*(\d{1,3}(?: \d{3})*[.,]\d{2})\s*eur/]) {
    const m = nt.match(re); if (m) { amount = num(m[1]); break; }
  }
  if (amount == null) { const all = [...nt.matchAll(/(\d{1,3}(?: \d{3})*[.,]\d{2})\s*eur\b/g)].map(m => num(m[1])); if (all.length) amount = Math.max(...all); }
  const ds = dates(text); const date = ds[0] || null;
  let warranty_end = null;
  const mw = nt.match(/garantie\s*[:-]?\s*(\d+)\s*(ans?|mois)/);
  if (mw && date && category === 'Factures & achats') warranty_end = addMonths(date, mw[2].startsWith('an') ? +mw[1] * 12 : +mw[1]);
  const art = text.match(/\b(canap[eé][\w ]{0,30}|table[\w ]{0,20}|lit [\w ]{0,20}|matelas[\w ]{0,20}|lave-linge[\w +]{0,20}|r[eé]frig[eé]rateur[\w ]{0,20}|t[eé]l[eé]vis(?:eur|ion)[\w ]{0,20}|ordinateur[\w ]{0,20})/i);
  if (art && category === 'Factures & achats') { entities.article = art[1].trim(); title = `Facture — ${entities.article}`; }
  else if (['Ticket de caisse','Billet de train','Facture','Contrôle technique'].includes(title) && issuer) title = `${title} — ${issuer}`;
  let summary = title + (issuer && !norm(title).includes(norm(issuer)) ? ` émis par ${issuer}` : '') + (date ? `, daté du ${date.split('-').reverse().join('/')}` : '') + (amount != null ? `, montant ${eur(amount)}` : '') + '.';
  return { category, title, issuer, date, amount, currency: amount != null ? 'EUR' : null, entities, warranty_end, summary, confidence: Math.round(Math.min(0.95, 0.4 + 0.08 * best) * 100) / 100 };
}
const eur = x => { const [i, d] = x.toFixed(2).split('.'); return i.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + ',' + d + '\u00a0€'; };

// ---------- search & assistant ----------
const SYN = {"ordonnance":["ordonnance","prescription"],"docteur":["dr","docteur","medecin"],"canape":["canape","sofa"],"sofa":["canape","sofa"],
  "meuble":["meuble","meubles","mobilier","canape","table","chaise","lit","matelas"],"meubles":["meuble","meubles","mobilier","canape","table","chaise","lit","matelas"],
  "impots":["impot","imposition","dgfip","fiscal"],"impot":["impot","imposition","dgfip","fiscal"],"loyer":["loyer","quittance"],"train":["train","sncf","tgv","billet"],
  "facture":["facture","ticket"],"medicaments":["medicament","pharmacie","comprime"],"electricite":["electricite","energie","kwh"],"salaire":["salaire","paie"],
  "voiture":["voiture","vehicule","controle technique","clio"],"sang":["sang","analyse","laboratoire"],"mutuelle":["mutuelle","remboursement","remboursements"]};
const STOP = new Set("combien depense depenses paye payer total jusqu quand garanti garantie est ce qui que quoi le la les de du des un une mon ma mes ton ta tes retrouve trouve moi montre cherche donne ou quel quelle pour avec et a au aux en sur dans s il te plait stp j ai je veux voir dernier derniere peux tu m sous encore achats achat qu".split(' '));
const terms = q => (norm(q).replace(/'/g, ' ').match(/[a-z0-9]+/g) || []).filter(w => !STOP.has(w) && w.length > 1);
const variants = t => { const s = new Set([t]); for (const [k, v] of Object.entries(SYN)) if (t === k || v.includes(t)) { s.add(k); v.forEach(x => s.add(x)); } return [...s]; };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function search(docs, q, cutoff = 0.45) {
  const ts = terms(q); if (!ts.length) return [];
  const out = [];
  for (const d of docs) {
    const f = { title: norm(d.title), ent: norm(JSON.stringify(d.entities || {})), issuer: norm(d.issuer), cat: norm(d.category), text: norm(d.text), sum: norm(d.summary) };
    let score = 0, hit = 0;
    for (const t of ts) {
      let best = 0;
      for (const v of variants(t)) {
        const rx = new RegExp('\\b' + esc(v), 'g'), has = s => (rx.lastIndex = 0, rx.test(s));
        const s = 5 * has(f.title) + 4 * has(f.ent) + 3 * has(f.issuer) + 2 * has(f.cat) + Math.min(3, (f.text.match(rx) || []).length) + has(f.sum);
        best = Math.max(best, s);
      }
      score += best; if (best > 0) hit++;
    }
    if (hit) out.push([d, score * (hit / ts.length) ** 2]);
  }
  out.sort((a, b) => b[1] - a[1]);
  return out.length ? out.filter(x => x[1] >= out[0][1] * cutoff).map(x => x[0]) : [];
}
function metaHits(docs, q) {
  const ts = terms(q);
  return docs.filter(d => { const m = norm([d.title, d.issuer, d.category, JSON.stringify(d.entities || {}), d.summary].join(' ')); return ts.some(t => variants(t).some(v => new RegExp('\\b' + esc(v)).test(m))); });
}
const MO = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const fmt = d => { if (!d) return ''; const [y, m, dd] = d.split('-').map(Number); return `${dd} ${MO[m - 1]} ${y}`; };
function answer(q, docs) {
  const nq = norm(q), today = new Date().toISOString().slice(0, 10);
  const total = /\b(combien|total|somme|depense|rembours)/.test(nq), warranty = /garanti/.test(nq), when = /\bquand\b|a quelle heure|quelle date/.test(nq);
  const steps = [`Compréhension : ${terms(q).join(', ') || '—'}${total ? ' · intention « total »' : warranty ? ' · intention « garantie »' : when ? ' · intention « date »' : ''}`];
  let res = total ? (metaHits(docs, q).length ? metaHits(docs, q) : search(docs, q, 0.01)) : search(docs, q);
  steps.push(`Recherche sur l’appareil dans ${docs.length} documents (titres, entités, émetteurs, texte OCR)`);
  const done = (reply) => { steps.push(`${res.length} résultat(s)`); return { reply, docs: res.slice(0, 6), steps }; };
  if (warranty && !res.length) {
    res = docs.filter(d => d.warranty_end && d.warranty_end >= today);
    return done(res.length ? `Vous avez ${res.length} achat${res.length > 1 ? 's' : ''} encore sous garantie : ` + res.map(d => `**${d.title}** (jusqu’au ${fmt(d.warranty_end)})`).join(', ') + '.' : 'Aucun achat sous garantie pour le moment.');
  }
  if (!res.length) return done("Je n’ai rien trouvé qui corresponde. Essayez avec un autre mot — un nom, un magasin, une date ?");
  const top = res[0];
  if (warranty) {
    const w = res.find(d => d.warranty_end);
    return done(w ? `**${w.title}** est garanti jusqu’au ${fmt(w.warranty_end)}${w.warranty_end >= today ? ' — encore valable.' : ' — la garantie est expirée.'}` : `Je n’ai pas trouvé de date de garantie sur **${top.title}**.`);
  }
  if (total) {
    const p = res.filter(d => d.amount != null); const s = p.reduce((a, d) => a + d.amount, 0);
    return done(`Au total : **${eur(s)}** sur ${p.length} document${p.length > 1 ? 's' : ''} (` + p.map(d => `${d.title} : ${eur(d.amount)}`).join(', ') + ').');
  }
  if (when && top.category === 'Voyages') {
    const m = norm(top.text).match(/(?:aller|depart)[^\n]*?(\d{2})\/(\d{2})\/(\d{4})\s*a\s*(\d{2}):(\d{2})/);
    if (m) return done(`D’après **${top.title}**, votre départ est le ${fmt(`${m[3]}-${m[2]}-${m[1]}`)} à ${m[4]}h${m[5]}.`);
  }
  let msg = `J’ai trouvé **${top.title}**` + (top.issuer && !norm(top.title).includes(norm(top.issuer)) ? ` de ${top.issuer}` : '') + (top.date ? ` du ${fmt(top.date)}` : '') + '.';
  if (top.amount != null) msg += ` Montant : ${eur(top.amount)}.`;
  if (top.warranty_end) msg += ` Garantie jusqu’au ${fmt(top.warranty_end)}.`;
  if (res.length > 1) msg += ` Et ${res.length - 1} autre${res.length > 2 ? 's' : ''} document${res.length > 2 ? 's' : ''} proche${res.length > 2 ? 's' : ''}.`;
  return done(msg);
}
return { CATEGORIES, extract, search, answer, norm, eur };
})();
if (typeof module !== 'undefined') module.exports = Z;
