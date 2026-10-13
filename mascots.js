// Zip mascots — an original family of soft, rounded "pebble" characters (hand-made SVG).
// Same base body for everyone; each category gets its own outfit + prop and a pastel body tint.
'use strict';
const Mascot = (() => {
  const P = {
    'Santé':            {a: '#ffd9e4', b: '#ff9fbf', c: '#f0709c'},
    'Sport':            {a: '#ffe3cc', b: '#ffb27a', c: '#f4874b'},
    'Factures & achats':{a: '#fff1c4', b: '#ffd66b', c: '#eab33a'},
    'Administratif':    {a: '#e9e2ff', b: '#bba8ff', c: '#9479f2'},
    'Logement':         {a: '#d6f7e6', b: '#8fe0b7', c: '#4fc493'},
    'Banque & impôts':  {a: '#dbe9ff', b: '#9cc2ff', c: '#5f97f2'},
    'Travail':          {a: '#e6ebf2', b: '#b9c4d4', c: '#8d9bb0'},
    'Voyages':          {a: '#d4f6fb', b: '#86def0', c: '#3fc0db'},
    'Véhicule':         {a: '#ffe0dc', b: '#ffa79c', c: '#ef7466'},
    'Assurance':        {a: '#d3f5ef', b: '#86dccb', c: '#3dbfa8'},
    'Autres':           {a: '#eeeef2', b: '#cfcfd8', c: '#a9a9b6'},
  };
  let n = 0;
  function svg(cat, size = 120) {
    const p = P[cat] || P.Autres, id = 'm' + (n++);
    const g = `
      <defs>
        <radialGradient id="${id}b" cx="38%" cy="28%" r="78%"><stop offset="0" stop-color="${p.a}"/><stop offset=".55" stop-color="${p.b}"/><stop offset="1" stop-color="${p.c}"/></radialGradient>
        <radialGradient id="${id}f" cx="45%" cy="35%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity=".0"/></radialGradient>
        <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9ecf3"/></linearGradient>
        <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe58a"/><stop offset="1" stop-color="#f2b43a"/></linearGradient>
        <linearGradient id="${id}d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b5f73"/><stop offset="1" stop-color="#34374a"/></linearGradient>
        <filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>`;
    // shared pieces
    const shadow = `<ellipse cx="100" cy="186" rx="46" ry="7" fill="#2a2140" opacity=".12" filter="url(#${id}s)"/>`;
    const feet = (fill = `url(#${id}b)`) => `<ellipse cx="80" cy="176" rx="15" ry="9" fill="${fill}"/><ellipse cx="120" cy="176" rx="15" ry="9" fill="${fill}"/>`;
    const body = `<path d="M100 34c38 0 60 30 60 70 0 42-24 72-60 72s-60-30-60-72c0-40 22-70 60-70z" fill="url(#${id}b)"/>
      <path d="M44 120c6 34 28 56 56 56s50-22 56-56c-10 26-30 40-56 40s-46-14-56-40z" fill="#3a1f5a" opacity=".07"/>
      <ellipse cx="80" cy="62" rx="18" ry="10" fill="url(#${id}f)" opacity=".9" transform="rotate(-25 80 62)"/>`;
    const face = `<g>
      <ellipse cx="85" cy="92" rx="7.5" ry="10" fill="#2b2a3a"/><ellipse cx="115" cy="92" rx="7.5" ry="10" fill="#2b2a3a"/>
      <circle cx="87.5" cy="88" r="2.8" fill="#fff"/><circle cx="117.5" cy="88" r="2.8" fill="#fff"/>
      <ellipse cx="74" cy="108" rx="8" ry="5" fill="#ff7fa3" opacity=".45"/><ellipse cx="126" cy="108" rx="8" ry="5" fill="#ff7fa3" opacity=".45"/>
      <path d="M93 109q7 7 14 0" fill="none" stroke="#2b2a3a" stroke-width="3.2" stroke-linecap="round"/></g>`;
    const armL = (r = 0) => `<rect x="34" y="112" width="16" height="34" rx="8" fill="url(#${id}b)" transform="rotate(${20 + r} 42 116)"/>`;
    const armR = (r = 0) => `<rect x="150" y="112" width="16" height="34" rx="8" fill="url(#${id}b)" transform="rotate(${-20 - r} 158 116)"/>`;
    const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="url(#${id}b)"/>`;
    let back = '', front = '', top = '', over = '', feetEl = feet(), arms = armL() + armR();
    switch (cat) {
      case 'Santé':
        front = `<path d="M62 120c10 8 24 12 38 12s28-4 38-12c4 18 2 40-6 54H68c-8-14-10-36-6-54z" fill="url(#${id}w)"/>
          <path d="M100 132v40" stroke="#dfe3ec" stroke-width="2"/><path d="M84 124l16 16 16-16" fill="none" stroke="#dfe3ec" stroke-width="3" stroke-linejoin="round"/>
          <rect x="112" y="146" width="14" height="10" rx="3" fill="#fff" stroke="#e7eaf1"/><path d="M119 148v6M116 151h6" stroke="#f0709c" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M80 120c-4 18 4 30 16 30" fill="none" stroke="#5b6b8c" stroke-width="3.5" stroke-linecap="round"/><circle cx="98" cy="152" r="6" fill="#c9d3e6" stroke="#5b6b8c" stroke-width="3"/>`;
        arms = `<rect x="34" y="112" width="16" height="34" rx="8" fill="url(#${id}w)" transform="rotate(20 42 116)"/><rect x="150" y="112" width="16" height="34" rx="8" fill="url(#${id}w)" transform="rotate(-20 158 116)"/>`;
        top = `<circle cx="100" cy="46" r="11" fill="#e8edf6" stroke="#c4cddd" stroke-width="2"/><circle cx="100" cy="46" r="5" fill="#fff"/>`;
        break;
      case 'Sport':
        top = `<path d="M44 74c18-12 38-16 56-16s38 4 56 16l-3 13c-17-10-35-14-53-14s-36 4-53 14z" fill="#ff5a6e"/><path d="M47 80c16-9 34-13 53-13s37 4 53 13" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/>
          <path d="M152 76l14-6-4 12z" fill="#ff5a6e"/>`;
        feetEl = ''; over = `<g transform="translate(-4 4)"><path d="M62 172c0-8 8-12 18-12s18 4 20 12-6 10-19 10-19-2-19-10z" fill="#fff"/><path d="M64 176h34" stroke="#ff5a6e" stroke-width="3"/><path d="M76 164l6 6M82 162l6 6" stroke="#7aa7ff" stroke-width="2.2" stroke-linecap="round"/></g>
          <g transform="translate(8 0)"><path d="M100 172c2-8 10-12 20-12s18 4 18 12-6 10-19 10-21-2-19-10z" fill="#fff"/><path d="M102 176h34" stroke="#ff5a6e" stroke-width="3"/><path d="M114 164l6 6M120 162l6 6" stroke="#7aa7ff" stroke-width="2.2" stroke-linecap="round"/></g></g>`.replace('<g transform="translate(-4 4)"><g>', '<g transform="translate(-4 4)"><g>');
        arms = armL(-50) + armR(-50);
        front = `<path d="M90 128l10 14 10-14" fill="none" stroke="#5f97f2" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="100" cy="150" r="10" fill="url(#${id}g)" stroke="#e0a22d" stroke-width="2"/><path d="M100 145l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" fill="#fff8d6"/>`;
        break;
      case 'Factures & achats':
        front = `<g transform="rotate(-6 128 140)"><path d="M116 112h30v52l-5-4-5 4-5-4-5 4-5-4-5 4z" fill="#fff" stroke="#eceff5"/><path d="M121 122h20M121 130h20M121 138h14M121 148h20" stroke="#cfd5e2" stroke-width="2.5" stroke-linecap="round"/><path d="M121 148h20" stroke="#eab33a" stroke-width="3"/></g>
          ${hand(124, 142)}
          <g transform="translate(46 132)"><path d="M4 10h30l-3 30H7z" fill="#ff8fb8"/><path d="M11 12c0-10 16-10 16 0" fill="none" stroke="#e05f93" stroke-width="3"/><circle cx="19" cy="24" r="4" fill="#fff" opacity=".8"/></g>`;
        arms = armL(-10) + armR(-55);
        break;
      case 'Administratif':
        top = `<g fill="none" stroke="#3a3550" stroke-width="3.4"><circle cx="85" cy="92" r="13" fill="#fff" fill-opacity=".25"/><circle cx="115" cy="92" r="13" fill="#fff" fill-opacity=".25"/><path d="M98 91h4M72 90l-10-4M128 90l10-4"/></g>
          <path d="M70 46q30-18 60 0" fill="none" stroke="${p.c}" stroke-width="5" stroke-linecap="round" opacity=".6"/>`;
        front = `<g transform="translate(74 130)"><rect x="0" y="22" width="52" height="12" rx="3" fill="#5f97f2"/><rect x="4" y="11" width="46" height="12" rx="3" fill="#ff8fb8"/><rect x="2" y="0" width="48" height="12" rx="3" fill="#86dccb"/>
          <path d="M6 4h36M8 15h34M4 26h40" stroke="#fff" stroke-width="2" opacity=".7"/></g>${hand(72, 150)}${hand(128, 150)}`;
        arms = armL(-30) + armR(-30);
        break;
      case 'Logement':
        front = `<g transform="translate(108 112)"><path d="M4 24L24 6l20 18v24H4z" fill="#fff"/><path d="M0 26L24 4l24 22" fill="none" stroke="#ef7466" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="18" y="32" width="12" height="16" rx="3" fill="#ffd66b"/><rect x="8" y="26" width="8" height="8" rx="2" fill="#9cc2ff"/><rect x="34" y="8" width="5" height="10" fill="#ef7466"/></g>${hand(116, 158)}${hand(148, 156)}
          <g transform="translate(52 140) rotate(-30)"><circle cx="8" cy="8" r="7" fill="none" stroke="url(#${id}g)" stroke-width="4"/><path d="M15 8h18M27 8v6M32 8v5" stroke="#eab33a" stroke-width="4" stroke-linecap="round"/></g>`;
        arms = armL(-20) + armR(-40);
        break;
      case 'Banque & impôts':
        front = `<g transform="translate(100 120)"><ellipse cx="24" cy="26" rx="26" ry="21" fill="#ffb7cf"/><circle cx="44" cy="22" r="8" fill="#ff9fbf"/><circle cx="46" cy="21" r="1.8" fill="#c0507a"/><circle cx="41" cy="21" r="1.8" fill="#c0507a"/>
          <path d="M14 8l-4-8 10 5z" fill="#ff9fbf"/><rect x="16" y="6" width="14" height="3.5" rx="1.75" fill="#c0507a"/><path d="M8 44v6M38 44v6" stroke="#ff9fbf" stroke-width="6" stroke-linecap="round"/><circle cx="18" cy="20" r="2.5" fill="#2b2a3a"/></g>
          <g transform="translate(50 128)"><circle cx="14" cy="14" r="14" fill="url(#${id}g)" stroke="#e0a22d" stroke-width="2"/><text x="14" y="19.5" text-anchor="middle" font-family="Inter,Arial" font-weight="800" font-size="15" fill="#b9831c">€</text></g>${hand(64, 150)}`;
        arms = armL(-35) + armR(-25);
        break;
      case 'Travail':
        top = `<path d="M92 122l8 6 8-6-4 30-4 4-4-4z" fill="#5f97f2"/><path d="M92 122l8 6 8-6" fill="#3f73cf"/>`;
        front = `<g transform="translate(104 136)"><rect x="0" y="8" width="48" height="32" rx="7" fill="url(#${id}d)"/><rect x="16" y="0" width="16" height="10" rx="3" fill="none" stroke="#34374a" stroke-width="4"/><rect x="0" y="20" width="48" height="4" fill="#6b7088"/><rect x="20" y="18" width="8" height="8" rx="2" fill="#ffd66b"/></g>${hand(126, 136)}
          <rect x="62" y="122" width="76" height="60" fill="none"/>`;
        arms = armL() + armR(-10);
        break;
      case 'Voyages':
        top = `<ellipse cx="100" cy="50" rx="52" ry="11" fill="#ffe08a"/><path d="M70 50c0-20 14-30 30-30s30 10 30 30z" fill="#ffd66b"/><path d="M71 44h58" stroke="#ff8fb8" stroke-width="6"/>`;
        front = `<g transform="translate(114 120)"><rect x="0" y="10" width="38" height="50" rx="8" fill="#ff8fb8"/><rect x="12" y="0" width="14" height="12" rx="4" fill="none" stroke="#e05f93" stroke-width="4"/>
          <path d="M10 18v34M28 18v34" stroke="#e05f93" stroke-width="3" opacity=".5"/><circle cx="19" cy="30" r="6" fill="#ffd66b"/><rect x="6" y="40" width="12" height="7" rx="2" fill="#86def0"/>
          <circle cx="8" cy="62" r="3.5" fill="#34374a"/><circle cx="30" cy="62" r="3.5" fill="#34374a"/></g>${hand(132, 122)}`;
        arms = armL() + armR(-40);
        break;
      case 'Véhicule':
        top = `<path d="M54 66c6-22 26-32 46-32s40 10 46 32z" fill="#ef7466"/><path d="M130 64c14 0 26 2 30 6-10 4-22 4-34 2z" fill="#d85a4c"/><circle cx="100" cy="38" r="5" fill="#d85a4c"/>`;
        front = `<g transform="translate(70 124)"><circle cx="30" cy="26" r="24" fill="none" stroke="url(#${id}d)" stroke-width="7"/><circle cx="30" cy="26" r="6" fill="#5b5f73"/><path d="M8 24h16M36 24h16M30 32v16" stroke="#5b5f73" stroke-width="6" stroke-linecap="round"/></g>${hand(66, 150)}${hand(134, 150)}`;
        arms = armL(-30) + armR(-30);
        break;
      case 'Assurance':
        back = `<path d="M150 70v100" stroke="#5b5f73" stroke-width="4" stroke-linecap="round"/><path d="M150 170q0 8-8 8" fill="none" stroke="#5b5f73" stroke-width="4" stroke-linecap="round"/>`;
        top = `<path d="M60 64c6-30 46-44 76-30 14 6 24 18 28 32-8-6-16-6-22 0-6-6-16-6-22 0-6-6-16-6-22 0-6-6-16-6-22 0-8-6-14-6-16-2z" fill="#3dbfa8"/><path d="M98 30c-10 10-12 24-10 36M120 34c4 10 4 22 0 32" fill="none" stroke="#2fa38e" stroke-width="2.5"/><circle cx="110" cy="26" r="3" fill="#2fa38e"/>`;
        front = `<g transform="translate(66 124)"><path d="M18 0l18 7v14c0 12-8 20-18 25C8 41 0 33 0 21V7z" fill="#fff"/><path d="M18 4l14 5.5v11.5c0 9.5-6 16-14 20-8-4-14-10.5-14-20V9.5z" fill="#86dccb"/><path d="M11 22l5 5 10-10" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>${hand(70, 150)}${hand(150, 128)}`;
        arms = armL(-30) + armR(-70);
        break;
    }
    return `<svg viewBox="0 0 200 200" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${g}${shadow}${back}${feetEl}${arms}${body}${over}${face}${front}${top}</svg>`;
  }
  return {svg, palette: P};
})();
if (typeof module !== 'undefined') module.exports = Mascot;
