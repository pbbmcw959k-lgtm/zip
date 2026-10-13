// Zip — suggestions Ask Zip calculées à partir des vrais documents (et vérifiées avec l'assistant).
'use strict';
const SmartChips = (() => {
  const T = [ // [regex sur titre/texte, question, libellé court]
    [/carte (nationale )?d.identit/, 'Où est ma carte d’identité ?', 'Ma carte d’identité'],
    [/passeport/, 'Où est mon passeport ?', 'Mon passeport'],
    [/permis de conduire/, 'Où est mon permis de conduire ?', 'Mon permis'],
    [/carte grise|certificat d.immatriculation/, 'Où est ma carte grise ?', 'Ma carte grise'],
    [/quittance/, 'Où est ma quittance de loyer ?', 'Ma quittance de loyer'],
    [/attestation d.assurance|assurance habitation/, 'Où est mon attestation d’assurance ?', 'Mon attestation d’assurance'],
    [/avis d.imp/, 'Où est mon avis d’imposition ?', 'Mon avis d’imposition'],
    [/bulletin de (paie|salaire)|fiche de paie/, 'Retrouve ma dernière fiche de paie', 'Ma dernière fiche de paie'],
    [/ordonnance/, 'Retrouve ma dernière ordonnance', 'Ma dernière ordonnance'],
    [/controle technique/, 'Quand date mon contrôle technique ?', 'Mon contrôle technique'],
    [/licence/, 'Où est ma licence sportive ?', 'Ma licence sportive'],
  ];
  const n = s => Z.norm(s || '');
  const short = s => String(s || '').replace(/\s*\((fictif|fictive)\)/i, '').split(/\s+/).slice(0, 2).join(' ');
  const kindOf = d => { const w = n(d.title).split(/\s+/)[0]; return ({facture: 'facture', ticket: 'ticket', releve: 'relevé', billet: 'billet', ordonnance: 'ordonnance', quittance: 'quittance', bulletin: 'fiche de paie', avis: 'avis', attestation: 'attestation', abonnement: 'abonnement', licence: 'licence'})[w] || 'document'; };
  const fem = k => /facture|ordonnance|quittance|fiche|attestation|licence/.test(k);
  function build(docs) {
    if (!docs.length) return [['Trouve-moi…', 'Trouve-moi la facture de mon canapé'], ['Montre-moi…', 'Montre-moi mes documents santé'], ['Où est…', 'Où est mon avis d’imposition ?']].map(([l, q]) => ({label: l, q, generic: true}));
    const today = new Date().toISOString().slice(0, 10), out = [], used = new Set();
    const ok = (q, test) => { try { const r = Z.answer(q, docs); return r.docs.length && test(r) ? r : null; } catch (e) { return null; } };
    const add = (label, q, test, id) => { if (out.length >= 4 || out.some(c => c.q === q) || (id && used.has(id))) return; if (ok(q, test)) { out.push({label, q}); id && used.add(id); } };
    // 1. le plus récent ajouté
    const recent = [...docs].sort((a, b) => (b.id || 0) - (a.id || 0))[0];
    if (recent) { const k = kindOf(recent), who = short(recent.issuer); const q = `Résume ${fem(k) ? 'ma dernière' : 'mon dernier'} ${k}${who ? ' ' + who : ''}`;
      add(`Résume : ${k} ${who}`.trim(), q, r => r.docs[0].id === recent.id, recent.id); }
    // 2. garantie qui expire le plus tôt
    const w = docs.filter(d => d.warranty_end && d.warranty_end >= today).sort((a, b) => a.warranty_end.localeCompare(b.warranty_end))[0];
    if (w) { const item = n(w.title).includes('—') ? w.title.split('—')[1].trim() : w.title; const q = `Jusqu’à quand est garanti mon achat ${short(w.issuer) || item} ?`;
      add(`Garantie ${short(w.issuer) || item}`, q, r => r.docs[0].id === w.id && /garanti/.test(r.reply), w.id); }
    // 3. documents importants détectés
    for (const [re, q, label] of T) { const hits = docs.filter(d => re.test(n(d.title)) || re.test(n(d.text).slice(0, 400))); if (!hits.length) continue;
      const best = hits.sort((a, b) => (b.date || '').localeCompare(a.date || ''))[0]; add(label, q, r => hits.some(h => h.id === r.docs[0].id), best.id); }
    // 4. catégorie la plus remplie
    const cnt = {}; docs.forEach(d => cnt[d.category] = (cnt[d.category] || 0) + 1);
    const [cat, c] = Object.entries(cnt).filter(([k]) => k !== 'Autres').sort((a, b) => b[1] - a[1])[0] || [];
    if (cat && c >= 2) { const withAmt = docs.filter(d => d.category === cat && d.amount != null).length; const q = withAmt >= 2 ? `Combien j’ai dépensé en ${cat.toLowerCase()} ?` : `Montre-moi mes documents ${cat.toLowerCase()}`;
      add(withAmt >= 2 ? `Dépenses ${cat}` : `Mes documents ${cat}`, q, r => r.docs.filter(d => d.category === cat).length >= Math.min(2, c)); }
    return out.length ? out : build([]);
  }
  return {build};
})();
if (typeof module !== 'undefined') module.exports = SmartChips;
