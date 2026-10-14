// Zip on-device engine: French keyword classifier + field extraction + keyword assistant (port of the server's local engine).
'use strict';
const Z = (() => {
const CATEGORIES = ["Santé","Sport","Factures & achats","Administratif","Logement","Banque & impôts","Travail","Voyages","Véhicule","Assurance","Autres"];
const norm = s => String(s ?? '').replace(/€/g, ' eur').replace(/[\u202f\u00a0]/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x00-\x7f]/g, '').toLowerCase();
// Mots-clés par catégorie ; "mot:N" = poids N (défaut 1). Les expressions très spécifiques pèsent plus lourd.
const RULES = {
 "Santé": ["ordonnance:2","docteur","dr ","medecin","pharmacie","patient","posologie","cpam:2","mutuelle","analyse","laboratoire","comprime","consultation","kine","dentiste","remboursement","carte vitale:4","assurance maladie:3","ameli:3","vaccin:2","vaccination:2","veterinaire:3","carnet de sante:3","osteopathe"],
 "Sport": ["licence","club","salle de sport","fitness","certificat medical sport","marathon","inscription course","piscine","natation","running","trail","athletisme","sportive","sportif","musculation","yoga","federation","semi-marathon","dossard","coach","football","fff:2","tennis","rugby","basket"],
 "Factures & achats": ["facture","ticket de caisse","achat","commande","garantie","total ttc","tva","magasin","article","livraison","canape","meuble","quantite","prix unitaire","amazon","fnac","darty"],
 "Logement": ["quittance:2","loyer:2","bail","proprietaire","locataire","charges locatives","edf","electricite","kwh","energie","consommation","abonnement","logement","gaz","eau","syndic","appartement","plombier:2","depot de garantie:3","bail de location:3","chauffe-eau:2","devis travaux:2"],
 "Banque & impôts": ["impot","avis d'imposition:3","dgfip:2","revenu fiscal","releve de compte:2","iban","banque","credit","taxe fonciere:3","taxe d'habitation:4","prelevement a la source","virement","releve d'identite bancaire:4","rib:2","bic"],
 "Travail": ["bulletin de paie:3","salaire","employeur","contrat de travail:3","cdi:2","cdd:2","net a payer","conges","fiche de paie:3","note de frais:4","frais professionnels:3","siret:3","auto-entrepreneur:3","micro-entreprise:3","freelance:3","prestation:2","kbis:3"],
 "Administratif": ["carte d'identite:3","passeport:3","etat civil:2","acte de naissance:3","prefecture","mairie","attestation","caf:2","france travail:2","justificatif","urssaf:3","attestation de vigilance:4","scolarite:3","ecole:2","college:2","lycee:2","universite:2","bulletin de notes:4","certificat de scolarite:4"],
 "Voyages": ["billet","sncf","tgv","vol","embarquement","reservation","hotel","train","depart","arrivee","passager","ouigo","air france:2","avion:2"],
 "Véhicule": ["carte grise:3","certificat d'immatriculation:3","controle technique:3","vidange","garage","immatriculation","pneus","amende:2","antai:3","stationnement","permis de conduire:3"],
 "Assurance": ["assurance","contrat d'assurance:2","police n","sinistre","franchise","cotisation","assure","habitation","attestation d'assurance:3","avis d'echeance:2","maif","macif","axa","matmut"],
};
const RW = Object.fromEntries(Object.entries(RULES).map(([c, ks]) => [c, ks.map(k => { const m = k.match(/^(.*):(\d)$/); return m ? [m[1], +m[2]] : [k, 1]; })]));
const TITLES = [["licence sportive","Licence sportive"],["abonnement fitness","Abonnement salle de sport"],["ordonnance","Ordonnance"],["avis d'imposition","Avis d'imposition"],["quittance","Quittance de loyer"],["bulletin de paie","Bulletin de paie"],["releve de remboursements","Relevé de remboursements"],
 ["billet","Billet de train"],["carte d'embarquement","Carte d'embarquement"],["attestation d'assurance","Attestation d'assurance"],["controle technique","Contrôle technique"],
 ["releve d'identite bancaire","RIB"],["note de frais","Note de frais"],["attestation de vigilance","Attestation de vigilance URSSAF"],["certificat de scolarite","Certificat de scolarité"],["carte vitale","Carte Vitale"],["passeport","Passeport"],["carte d'identite","Carte d'identité"],
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
  const scores = Object.fromEntries(Object.entries(RW).map(([c, ks]) => [c, ks.reduce((a, [k, w]) => a + w * count(t, k), 0)]));
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
  else if (['Ticket de caisse','Billet de train','Facture','Contrôle technique','Licence sportive','Abonnement salle de sport'].includes(title) && issuer) title = `${title} — ${issuer}`;
  if (title.length > 80) title = title.slice(0, 77).trim() + '…';
  // échéances : « valable du … au … », « avant le … », « date d'expiration … », « expire le … »
  let expires = warranty_end;
  const DT = '(\\d{1,2}[/.-]\\d{1,2}[/.-]\\d{4})';
  for (const re of [new RegExp('valable (?:du ' + DT + ' )?(?:au|jusqu.au) ' + DT), new RegExp('(?:avant le|expire le|date d.expiration|fin de validite|valide jusqu.au|echeance le)\\s*:?\\s*' + DT)]) {
    const m = nt.match(re); if (m) { const v = dates(m[m.length - 1])[0]; if (v && (!expires || v < expires)) expires = v; }
  }
  if (/\bvaccin|vaccination/.test(nt) && !expires) { /* pas d'échéance inventée */ }
  // sens de l'argent : crédit (remboursement, salaire reçu) ou débit (facture, loyer, achat)
  const flow = /releve de remboursements|total rembourse|rembourse par/.test(nt) ? 'credit' : /bulletin de paie|fiche de paie|net a payer/.test(nt) && category === 'Travail' ? 'income' : amount != null ? 'debit' : null;
  const iban = text.match(/\bFR\d{2}(?:[ ]?[\dA-Z*°+]{4}){2,6}/);
  if (iban && /releve d.identite bancaire|\brib\b|\bbic\b/.test(nt)) entities.IBAN = iban[0].replace(/\s+/g, ' ').slice(0, 9) + ' •••• ' + iban[0].replace(/\s+/g, '').slice(-4);
  let summary = title + (issuer && !norm(title).includes(norm(issuer)) ? ` émis par ${issuer}` : '') + (date ? `, daté du ${date.split('-').reverse().join('/')}` : '') + (amount != null ? `, montant ${eur(amount)}` : '') + '.';
  return { category, title, issuer, date, amount, currency: amount != null ? 'EUR' : null, entities, warranty_end, expires, flow, summary, confidence: Math.round(Math.min(0.95, 0.4 + 0.08 * best) * 100) / 100 };
}
const eur = x => { const [i, d] = x.toFixed(2).split('.'); return i.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + ',' + d + '\u00a0€'; };

// ---------- search & assistant ----------
const SYN = {"ordonnance":["ordonnance","prescription"],"docteur":["dr","docteur","medecin"],"canape":["canape","sofa"],"sofa":["canape","sofa"],
  "meuble":["meuble","meubles","mobilier","canape","table","chaise","lit","matelas"],"meubles":["meuble","meubles","mobilier","canape","table","chaise","lit","matelas"],
  "impots":["impot","imposition","dgfip","fiscal"],"impot":["impot","imposition","dgfip","fiscal"],"loyer":["loyer","quittance"],"train":["train","sncf","tgv","billet"],
  "facture":["facture","ticket"],"medicaments":["medicament","pharmacie","comprime"],"electricite":["electricite","energie","kwh"],"salaire":["salaire","paie"],
  "voiture":["voiture","vehicule","controle technique","clio"],"sang":["sang","analyse","laboratoire"],"mutuelle":["mutuelle","remboursement","remboursements"],"rib":["rib","iban","releve d identite bancaire","bic"],"iban":["rib","iban","bic"],"edf":["edf","electricite","energie","kwh"],"engie":["engie","gaz","energie"],"factures":["facture","ticket"],"sport":["sport","sportive","licence","fitness","salle","club","marathon","running"],"gym":["salle de sport","fitness","musculation"],"course":["course","marathon","running","dossard"]};
const STOP = new Set("combien depense depenses paye payer total jusqu quand garanti garantie est ce qui que quoi le la les de du des un une mon ma mes ton ta tes retrouve trouve moi montre cherche donne ou quel quelle pour avec et a au aux en sur dans s il te plait stp j ai je veux voir dernier derniere peux tu m sous encore achats achat qu tout tous toutes ce ces cela bientot expire expirent expirer arrive echeance echeances prochaine prochain prochaines".split(' '));
const terms = q => (norm(q).replace(/'/g, ' ').match(/[a-z0-9]+/g) || []).filter(w => !STOP.has(w) && w.length > 1);
const variants = t => { const s = new Set([t]); for (const [k, v] of Object.entries(SYN)) if (t === k || v.includes(t)) { s.add(k); v.forEach(x => s.add(x)); } return [...s]; };
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// champs normalisés mémorisés par document (la normalisation du texte OCR est l'étape coûteuse)
const FC = new WeakMap();
const fields = d => { let f = FC.get(d); if (!f) { f = { title: norm(d.title), ent: norm(JSON.stringify(d.entities || {})), issuer: norm(d.issuer), cat: norm(d.category), text: norm(d.text), sum: norm(d.summary) }; f.meta = [f.title, f.issuer, f.cat, f.ent, f.sum].join(' '); FC.set(d, f); } return f; };
function search(docs, q, cutoff = 0.45) {
  const ts = terms(q); if (!ts.length) return [];
  const out = [];
  for (const d of docs) {
    const f = fields(d);
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
  const ts = terms(q); if (!ts.length) return [];
  const meta = d => fields(d).meta;
  // d'abord le mot exact (« table » ne doit pas ramener le canapé), sinon les synonymes
  const exact = docs.filter(d => ts.some(t => new RegExp('\\b' + esc(t)).test(meta(d))));
  if (exact.length) return exact;
  return docs.filter(d => ts.some(t => variants(t).some(v => new RegExp('\\b' + esc(v)).test(meta(d)))));
}
const MO = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
const fmt = d => { if (!d) return ''; const [y, m, dd] = d.split('-').map(Number); return `${dd} ${MO[m - 1]} ${y}`; };
const MNAMES = ["janvier","fevrier","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","decembre"];
const daysTo = (d, today) => Math.round((new Date(d + 'T00:00:00Z') - new Date(today + 'T00:00:00Z')) / 864e5);
function answer(q, docs) {
  // « je paie », « j'ai payé » décrivent l'intention, pas le contenu cherché
  const q2 = String(q).replace(/\b(je|on|j['’]ai|ai-je|tu)\s+(pai\w*|pay\w*)\b/gi, ' ').replace(/\b(ca|ça)\s+co[uû]te\w*/gi, ' ');
  const nq = norm(q), today = new Date().toISOString().slice(0, 10);
  const refund = /rembours/.test(nq) && !/depens/.test(nq);
  const total = /\b(combien|total|somme|depense|rembours)/.test(nq), warranty = /garanti/.test(nq), when = /\bquand\b|a quelle heure|quelle date/.test(nq);
  const expiring = /expir|echeance|bientot|perime|renouvel|arrive a (terme|echeance)/.test(nq) && !warranty;
  const rib = /\brib\b|\biban\b|identite bancaire|coordonnees bancaires/.test(nq);
  const mi = MNAMES.findIndex(m => new RegExp('\\b' + m + '\\b').test(nq)), my = (nq.match(/\b(20\d{2})\b/) || [])[1];
  const wantsInvoices = /\bfactures?\b|\btickets?\b/.test(nq);
  const intent = expiring ? 'échéances' : rib ? 'RIB' : total ? (refund ? 'remboursements' : 'total') : warranty ? 'garantie' : when ? 'date' : mi >= 0 ? 'mois' : '';
  const steps = [`Compréhension : ${terms(q2).filter(t => !MNAMES.includes(t)).join(', ') || '—'}${intent ? ` · intention « ${intent} »` : ''}`];
  steps.push(`Recherche sur l’appareil dans ${docs.length} documents (titres, entités, émetteurs, texte OCR)`);
  let res = [];
  const done = (reply) => { steps.push(`${res.length} résultat(s)`); return { reply, docs: res.slice(0, 6), steps }; };
  // 1. échéances
  if (expiring) {
    const dl = d => d.expires || d.warranty_end;
    const fut = docs.filter(d => dl(d) && dl(d) >= today).sort((a, b) => dl(a).localeCompare(dl(b)));
    const soon = fut.filter(d => daysTo(dl(d), today) <= 90);
    const label = d => `**${d.title}** (${d.warranty_end && dl(d) === d.warranty_end ? 'garantie ' : ''}jusqu’au ${fmt(dl(d))})`;
    if (soon.length) { res = soon; return done(`${soon.length} document${soon.length > 1 ? 's arrivent' : ' arrive'} à échéance dans les 3 prochains mois : ` + soon.map(label).join(', ') + '.'); }
    res = fut;
    return done(fut.length ? `Rien n’expire dans les 3 prochains mois. Prochaines échéances : ` + fut.slice(0, 3).map(label).join(', ') + '.' : 'Je n’ai trouvé aucune date d’échéance dans tes documents.');
  }
  // 2. RIB / IBAN
  if (rib) {
    res = docs.filter(d => /\brib\b/i.test(norm(d.title)) || (d.entities && d.entities.IBAN));
    return done(res.length ? `Voici ${res.length > 1 ? 'tes RIB' : 'ton RIB'} : **${res[0].title}**${res[0].entities && res[0].entities.IBAN ? ` (IBAN ${res[0].entities.IBAN})` : ''}.` : 'Je n’ai pas trouvé de RIB dans tes documents. Ajoute-le (photo ou PDF depuis l’app de ta banque) : Zip le rangera dans « Banque & impôts ».');
  }
  // 3. filtre par mois (« mes factures de septembre »)
  let pool = docs;
  if (mi >= 0) {
    pool = docs.filter(d => d.date && +d.date.slice(5, 7) === mi + 1 && (!my || d.date.startsWith(my)));
    if (wantsInvoices) pool = pool.filter(d => /^(facture|ticket)/.test(norm(d.title)) || d.category === 'Factures & achats');
    const rest = terms(q2).filter(t => !MNAMES.includes(t) && !/^(factures?|tickets?|documents?|papiers?|20\d\d)$/.test(t));
    if (!rest.length && !total) {
      res = pool.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const what = wantsInvoices ? 'facture' : 'document';
      return done(res.length ? `En ${MO[mi]}${my ? ' ' + my : ''}, j’ai trouvé ${res.length} ${what}${res.length > 1 ? 's' : ''} : ` + res.map(d => `**${d.title}**${d.amount != null ? ` (${eur(d.amount)})` : ''}`).join(', ') + '.' : `Aucun${wantsInvoices ? 'e facture' : ' document'} daté${wantsInvoices ? 'e' : ''} de ${MO[mi]}${my ? ' ' + my : ''}.`);
    }
  }
  const qs = q2.replace(new RegExp('\\b(' + MO.join('|') + ')\\b', 'gi'), ' ');
  res = total ? (metaHits(pool, qs).length ? metaHits(pool, qs) : search(pool, qs, 0.01)) : search(pool, qs);
  if (warranty && !res.length) {
    res = docs.filter(d => d.warranty_end && d.warranty_end >= today);
    return done(res.length ? `Tu as ${res.length} achat${res.length > 1 ? 's' : ''} encore sous garantie : ` + res.map(d => `**${d.title}** (jusqu’au ${fmt(d.warranty_end)})`).join(', ') + '.' : 'Aucun achat sous garantie pour le moment.');
  }
  if (!res.length) return done("Je n’ai rien trouvé qui corresponde. Essaie avec un autre mot — un nom, un magasin, une date ?");
  if (/\b(dernier|derniere|recent|recente)\b/.test(nq) && res.length > 1) { const best = res[0], p = res.filter(d => d.category === best.category && d.date); if (p.length > 1) { p.sort((a, b) => b.date.localeCompare(a.date)); res = [p[0], ...res.filter(d => d !== p[0])]; } }
  const top = res[0];
  if (/\bresum/.test(nq) && top.summary) return done(`Résumé de **${top.title}** : ${top.summary}`);
  if (warranty) {
    const w = res.find(d => d.warranty_end);
    return done(w ? `**${w.title}** est garanti jusqu’au ${fmt(w.warranty_end)}${w.warranty_end >= today ? ' — encore valable.' : ' — la garantie est expirée.'}` : `Je n’ai pas trouvé de date de garantie sur **${top.title}**.`);
  }
  if (total) {
    const withAmt = res.filter(d => d.amount != null);
    const flowOf = d => d.flow || (/rembours/.test(norm(d.title)) ? 'credit' : /bulletin de paie|fiche de paie/.test(norm(d.title)) ? 'income' : 'debit');
    const p = withAmt.filter(d => refund ? flowOf(d) === 'credit' : flowOf(d) === 'debit');
    const excluded = withAmt.filter(d => !p.includes(d));
    if (!p.length) return done(refund ? 'Je n’ai pas trouvé de remboursement correspondant.' : `Je n’ai pas trouvé de dépense correspondante${excluded.length ? ' (seulement des montants reçus : ' + excluded.map(d => `${d.title} : ${eur(d.amount)}`).join(', ') + ')' : ''}.`);
    res = [...p, ...res.filter(d => !p.includes(d))];
    const s = p.reduce((a, d) => a + d.amount, 0);
    let msg = `${refund ? 'Remboursements reçus' : 'Au total'} : **${eur(s)}** sur ${p.length} document${p.length > 1 ? 's' : ''} (` + p.map(d => `${d.title} : ${eur(d.amount)}`).join(', ') + ').';
    const cr = excluded.filter(d => flowOf(d) === 'credit');
    if (!refund && cr.length) msg += ` Non comptés car reçus : ${cr.map(d => `${d.title} (${eur(d.amount)})`).join(', ')}.`;
    steps.push(refund ? 'Seuls les montants reçus (remboursements) sont additionnés' : 'Seules les dépenses sont additionnées (remboursements et salaires exclus)');
    return done(msg);
  }
  if (when && top.category === 'Voyages') {
    const m = norm(top.text).match(/(?:aller|depart)[^\n]*?(\d{2})\/(\d{2})\/(\d{4})\s*a\s*(\d{2}):(\d{2})/);
    if (m) return done(`D’après **${top.title}**, ton départ est le ${fmt(`${m[3]}-${m[2]}-${m[1]}`)} à ${m[4]}h${m[5]}.`);
  }
  let msg = `J’ai trouvé **${top.title}**` + (top.issuer && !norm(top.title).includes(norm(top.issuer)) ? ` de ${top.issuer}` : '') + (top.date ? ` du ${fmt(top.date)}` : '') + '.';
  if (top.amount != null) msg += ` Montant : ${eur(top.amount)}.`;
  if (top.warranty_end) msg += ` Garantie jusqu’au ${fmt(top.warranty_end)}.`;
  if (res.length > 1) msg += ` Et ${res.length - 1} autre${res.length > 2 ? 's' : ''} document${res.length > 2 ? 's' : ''} proche${res.length > 2 ? 's' : ''}.`;
  return done(msg);
}
// Qualité d'un texte OCR : une photo sombre ou sans document produit du « bruit » (symboles, fragments).
const COMMON = new Set("de la le les des du un une et en au aux pour par sur avec dans est sont vous votre vos nous notre date total montant prix tva ttc eur euros facture ticket client numero adresse rue avenue boulevard nom prenom madame monsieur page reference contrat periode paiement payer net mois annee carte document merci conservez caisse article quantite code ville france tel telephone mail email signature fait le valable jusqu au droits service sante dr docteur patient medecin pharmacie assurance banque compte releve impot avis bulletin paie salaire loyer quittance billet train depart arrivee garantie achat commande livraison".split(' '));
function textQuality(text, conf = 0, framed = true) {
  const t = norm(text), letters = (t.match(/[a-z]/g) || []).length, words = t.match(/[a-z]{2,}/g) || [];
  const common = words.filter(w => COMMON.has(w)).length, longw = words.filter(w => w.length >= 4 && /[aeiouy]/.test(w)).length;
  const junk = (String(text).match(/[^\w\s.,:;'’()\-/€%°]/g) || []).length / Math.max(1, String(text).replace(/\s/g, '').length);
  if (letters < 25) return {ok: false, empty: true, reason: 'aucun texte trouvé'};
  if (common < 3 || (conf && conf < 35) || (conf && conf < 55 && common < 8) || junk > 0.25 || longw < 4) return {ok: false, empty: false, reason: `texte incohérent, confiance OCR ${Math.round(conf)} %, ${common} mots reconnus`};
  return {ok: true, common, conf};
}
return { CATEGORIES, textQuality, extract, search, answer, norm, eur };
})();
if (typeof module !== 'undefined') module.exports = Z;
