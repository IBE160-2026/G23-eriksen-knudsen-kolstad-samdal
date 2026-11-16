/*
 * Felles for de tre resultatkonseptene A, B og C (2026-11-15). Forslag – ikke godkjent av gruppen.
 * Ingen beregning skjer her. Tallene kommer fra ../konsepter-2026-11-12/felles.js (testeksempel 01)
 * og ../konsepter-2026-11-12/data-kontorstol-pro.js (testeksempel 02 og 03), kopiert fra de håndkontrollerte fasitene.
 * Klassifiseringen produksjon/innkjøp er den samme som i PRD FR-17 og felles.js (art):
 *   Komponent (Kjøpes inn) = innkjøp, Ferdigvare og Komponent (Produseres selv) = produksjonsordre.
 * Velg testeksempel med ?data=01|02|03.
 */
window.RK = (function () {
  'use strict';
  const Q = new URLSearchParams(location.search);
  const DS = ['01', '02', '03'].includes(Q.get('data')) ? Q.get('data') : '01';
  const B = window.COSI;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  /* Kontorstol Pro (02/03): samme grensesnitt som felles.js, med utregning fra fasitens ark Utregning */
  function proData(D) {
    const fmt = B.fmt, H = D.H, UKER = Array.from({ length: H }, (_, i) => i + 1), DELER = D.deler, EKS = D.eksepsjoner;
    const byVn = Object.fromEntries(DELER.map(p => [p.vn, p]));
    const eksepsjoner = vn => EKS.filter(x => x.vn === vn);
    const forfaltFor = vn => { const f = D.forslag.find(x => x.vn === vn && x.uke === 1); return f && f.forfalt || 0; };
    const HIT = { B: /^Bruttobehov/, FL: /^Forventet lager/, NB: /^(Disponibel|Nettobehov)/, POM: /^Planlagt ordremottak/, POF: /^Frigis/, PM: /^Disponibel/ };
    const seg = (vn, w, k) => { const t = (D.utregning[vn] || {})[w]; if (!t) return null;
      return t.split(/\.\s+(?=[A-ZÆØÅ])/).map(s => s.replace(/\.$/, '')).filter(Boolean).map(s => ({ txt: s, hit: HIT[k] ? HIT[k].test(s) : false })); };
    function forklarCelle(p, k, w) {
      const i = w - 1, rad = B.RADER.find(r => r.k === k), v = p[k][i]; let svar = '', src = w, merknad = '';
      if (k === 'B') svar = p.niva === '0' ? `Kundene trenger ${fmt(v)} i uke ${w} (prognostiserte behov).` : `${p.d} trenger ${fmt(v)} i uke ${w} for frigivelsene til delen over.`;
      else if (k === 'PM') svar = v ? `Et mottak på ${fmt(v)} er lagt inn i uke ${w}.` : `Ingen planlagte mottak i uke ${w}.`;
      else if (k === 'FL') svar = `Lageret er ${fmt(v)} ved slutten av uke ${w}.`;
      else if (k === 'NB') svar = v ? `Det mangler ${fmt(v)} for å holde sikkerhetslageret på ${p.ss} i uke ${w}.` : `Lageret holder sikkerhetslageret i uke ${w}.`;
      else if (k === 'POM') svar = v ? `En ny ordre må levere ${fmt(v)} i uke ${w}.` : `Ingen ny ordre trengs i uke ${w}.`;
      else if (k === 'POF') { const ff = w === 1 ? forfaltFor(p.vn) : 0; src = w + p.L;
        svar = v ? `Bestill ${fmt(v)} i uke ${w}${ff ? `, hvorav ${ff} er forfalt` : ''}.` : `Ingenting skal bestilles i uke ${w}.`;
        merknad = src > H ? `Et mottak i uke ${src} er etter planperioden.` : `Ordren skal komme i uke ${src} (uke ${w} + ledetid ${p.L}).`; }
      return { tittel: `${rad.navn}: ${fmt(v)}`, under: `${p.vn} ${p.d} · uke ${w}`, svar, linjer: [], utregning: src <= H ? seg(p.vn, src, k) : null, utregningUke: src, merknad, regel: rad.regel, eksepsjoner: EKS.filter(x => x.vn === p.vn && x.uke === w) };
    }
    return { H, UKER, META: D.meta, TYPER: B.TYPER, DELER, EKSEPSJONER: EKS, RADER: B.RADER, byVn, fmt, kort: B.kort, art: B.art, eksepsjoner,
      kritiske: () => DELER.filter(p => eksepsjoner(p.vn).length),
      forslag: () => D.forslag.map(f => ({ uke: f.uke, del: byVn[f.vn], mengde: f.mengde, forfalt: f.uke === 1 ? (f.forfalt || 0) : 0 })),
      forklarCelle, forklarRad: B.forklarRad };
  }
  const C = DS === '01' ? B : proData(window.COSI_PRO[DS]);
  const fmt = C.fmt;
  const isProd = p => C.art(p) !== 'Innkjøp';
  const F = C.forslag().map(f => ({ ...f, prod: isProd(f.del), eks: C.EKSEPSJONER.filter(x => x.vn === f.del.vn && x.uke === f.uke) }));
  const K = C.kritiske();

  /* Enkelt språk for eksepsjonene. Det offisielle navnet (PRD, ordbanken) vises alltid ved siden av i detaljene. */
  const ENKEL = {
    BF: { kort: 'Kommer for sent', tekst: 'Lageret går tomt før en ny leveranse rekker å komme.' },
    SS: { kort: 'Sikkerhetslageret brukes', tekst: 'Lageret blir lavere enn sikkerhetslageret før en ny leveranse kan komme.' },
    MF: { kort: 'Leveransen må komme tidligere', tekst: 'En leveranse som allerede er bestilt, trengs før den er ventet.' },
    KM: { kort: 'Leveransen trengs kanskje ikke', tekst: 'En leveranse som allerede er bestilt, ser ikke ut til å trenges i planperioden.' },
    LH: { kort: 'Planen er for kort for denne delen', tekst: 'Delen tar så lang tid å skaffe at planen ikke viser alt som må bestilles nå.' }
  };
  const xlabel = (x, { week = true } = {}) => `<span class="rk-x ${x.t}"><span class="rk-xg" aria-hidden="true">${C.TYPER[x.t].g}</span>${ENKEL[x.t].kort}${week ? (x.uke ? ' · uke ' + x.uke : ' · hele planen') : ''}</span>`;
  const typeTekst = p => p.type === 'Ferdigvare' ? 'Ferdigprodukt – produseres internt' : p.type === 'Komponent (Produseres selv)' ? 'Produseres internt' : 'Kjøpes inn fra leverandør';
  const handling = f => (f.prod ? 'Produser ' : 'Bestill ') + fmt(f.mengde) + ' ' + f.del.d;
  const ICON = {
    prod: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 17V9l5 3V9l5 3V5l6 3v9z"/></svg>',
    inn: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 3h3l2 10h9l2-7H6"/><circle cx="8" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/></svg>'
  };

  /* Prototypelinje og topp: samme i alle tre, så sammenligningen handler om resultatvisningen */
  function frame(navn) {
    const top = document.createElement('div');
    top.innerHTML = `<div class="rk-proto" role="note"><span><b>${esc(navn)} – prototype, ikke godkjent av gruppen.</b> Filen leses ikke. Tallene er testdata: fasit for testeksempel ${DS} (${esc(C.META.produkt)}).</span>
      <label>Testdata <select id="rk-ds"><option value="01">01 · Kontorstol Basic</option><option value="02">02 · Kontorstol Pro</option><option value="03">03 · Kontorstol Pro (økt behov)</option></select></label></div>
      <header class="rk-head"><div><h1 class="rk-prod">${esc(C.META.produkt)} <span class="rk-vn">${C.META.varenummer}</span></h1>
      <p class="rk-meta">Plan for uke 1–${C.H} · ${esc(C.META.fil)}</p></div>
      <p class="rk-forslag"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v5M10 14v.5"/></svg>Dette er forslag fra planen. Ingenting er bestilt eller satt i produksjon ennå.</p></header>`;
    document.body.prepend(...top.children);
    const s = document.getElementById('rk-ds'); s.value = DS;
    s.addEventListener('change', () => { const q = new URLSearchParams(location.search); q.set('data', s.value); location.search = q.toString(); });
  }

  /* ---------- Detaljpanel: én del, eller hele beregningen. Ikke-modalt, Esc lukker, fokus tilbake. ---------- */
  let drawer, trigger = null;
  function ensureDrawer() {
    if (drawer) return drawer;
    drawer = document.createElement('aside');
    drawer.className = 'rk-drawer'; drawer.hidden = true; drawer.setAttribute('aria-labelledby', 'rk-d-h');
    drawer.innerHTML = '<div class="rk-d-top"><h2 id="rk-d-h" tabindex="-1"></h2><button type="button" class="rk-btn" data-close>Lukk</button></div><div class="rk-d-body"></div>';
    document.body.appendChild(drawer);
    drawer.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { close(); return; }
      const t = e.target.closest('[data-calc]');
      if (t) { const box = drawer.querySelector('#rk-calc'), open = box.hidden; box.hidden = !open; t.setAttribute('aria-expanded', String(open)); t.textContent = open ? 'Skjul beregningen' : 'Vis beregningen'; return; }
      const c = e.target.closest('[data-c]');
      if (c) { drawer.querySelectorAll('.rk-t .on').forEach(x => x.classList.remove('on')); c.classList.add('on'); const [vn, k, w] = c.dataset.c.split('|'); explain(vn, k, +w); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) close(); });
    return drawer;
  }
  function close() { drawer.hidden = true; document.body.classList.remove('rk-has-drawer'); if (trigger && document.contains(trigger)) trigger.focus(); }
  function show(title, html, wide) {
    ensureDrawer(); trigger = document.activeElement;
    drawer.querySelector('#rk-d-h').textContent = title;
    drawer.querySelector('.rk-d-body').innerHTML = html;
    drawer.classList.toggle('wide', !!wide); drawer.hidden = false; document.body.classList.add('rk-has-drawer');
    drawer.querySelector('.rk-d-body').scrollTop = 0; drawer.querySelector('#rk-d-h').focus();
  }
  /* Beregningstabell (FR-14): de seks radene per del, én kolonne per uke. Hvert tall er en knapp (FR-18: klikk, ikke peking). */
  function table(parts) {
    let h = `<div class="rk-tw"><table class="rk-t"><thead><tr><th scope="col">Rad</th>${C.UKER.map(w => `<th scope="col">Uke ${w}</th>`).join('')}</tr></thead>`;
    parts.forEach(p => {
      const xs = C.eksepsjoner(p.vn);
      h += `<tbody><tr class="ph"><th colspan="${C.H + 1}" scope="rowgroup">${parts.length > 1 ? `<span class="rk-vn">${p.vn}</span> ${esc(p.d)} <span class="rk-muted">· ${C.kort(p.type)}</span> ${xs.map(x => xlabel(x)).join(' ')}` : 'Beregning per uke'}</th></tr>`;
      C.RADER.forEach(r => {
        h += `<tr class="${r.k}"><th scope="row">${r.navn}</th>` + C.UKER.map(w => {
          const v = p[r.k][w - 1], x = r.k === 'NB' && xs.some(e => e.uke === w);
          return `<td${x ? ' class="x"' : ''}><button type="button" data-c="${p.vn}|${r.k}|${w}" aria-label="${esc(p.d)}, ${r.navn}, uke ${w}: ${fmt(v)}${x ? ', har eksepsjon' : ''}">${fmt(v)}</button></td>`; }).join('') + '</tr>';
      });
      h += '</tbody>';
    });
    return h + '</table></div><div class="rk-ex" id="rk-ex" aria-live="polite"><p class="rk-muted">Velg et tall for å se hvordan det er regnet ut.</p></div>';
  }
  function explain(vn, k, w) {
    const p = C.byVn[vn], f = C.forklarCelle(p, k, w);
    let h = `<p class="rk-muted">${esc(f.under)}</p><h3>${esc(f.tittel)}</h3>`;
    if (f.svar) h += `<p class="rk-ans">${esc(f.svar)}</p>`;
    if (f.linjer && f.linjer.length) h += `<ol class="rk-lines">${f.linjer.map(([a, v], i) => `<li${i === f.linjer.length - 1 ? ' class="res"' : ''}><span>${esc(a)}</span><b>${v}</b></li>`).join('')}</ol>`;
    if (f.utregning) h += `<ol class="rk-lines">${f.utregning.map(s => `<li${s.hit ? ' class="res"' : ''}><span>${esc(s.txt)}</span></li>`).join('')}</ol><p class="rk-muted">Fra arket Utregning i fasiten.</p>`;
    if (f.merknad) h += `<p>${esc(f.merknad)}</p>`;
    f.eksepsjoner.forEach(x => { h += `<p class="rk-xm ${x.t}"><b>${ENKEL[x.t].kort}</b> (${C.TYPER[x.t].navn}). ${esc(x.melding)}</p>`; });
    if (f.regel) h += `<details><summary>Regelen</summary><p>${esc(f.regel)}</p></details>`;
    drawer.querySelector('#rk-ex').innerHTML = h;
  }
  function openPart(vn) {
    const p = C.byVn[vn], xs = C.eksepsjoner(vn), fs = F.filter(f => f.del.vn === vn), prod = isProd(p);
    let h = `<p class="rk-type ${prod ? 'prod' : 'inn'}">${ICON[prod ? 'prod' : 'inn']}${typeTekst(p)}</p>
      <dl class="rk-facts"><div><dt>På lager nå</dt><dd>${fmt(p.lager)}</dd></div><div><dt>Sikkerhetslager</dt><dd>${fmt(p.ss)}</dd></div><div><dt>Tid å ${prod ? 'produsere' : 'skaffe'}</dt><dd>${p.L} ${p.L === 1 ? 'uke' : 'uker'}</dd></div></dl>`;
    if (xs.length) h += `<h3>Krever oppfølging</h3>` + xs.map(x => `<div class="rk-xm ${x.t}"><p><b>${ENKEL[x.t].kort}</b>${x.uke ? ' · uke ' + x.uke : ''}</p><p>${ENKEL[x.t].tekst}</p><details><summary>Mer om dette</summary><p>${esc(x.melding)}</p><p class="rk-muted">I PRD-en heter dette «${C.TYPER[x.t].navn}».</p></details></div>`).join('');
    h += `<h3>${prod ? 'Foreslått produksjon' : 'Foreslått innkjøp'}</h3>` + (fs.length ? `<ul class="rk-orders">${fs.map(f => `<li><span>Uke ${f.uke}</span><b>${fmt(f.mengde)}</b>${f.forfalt ? `<span class="rk-due">${f.forfalt} skulle vært ${prod ? 'startet' : 'bestilt'} før uke 1</span>` : ''}</li>`).join('')}</ul>` : '<p class="rk-muted">Ingen forslag i planperioden.</p>');
    h += `<p class="rk-muted">Uken er når ${prod ? 'produksjonen bør startes' : 'innkjøpet bør bestilles'}. Det er forslag, ikke bestillinger.</p>`;
    h += `<button type="button" class="rk-btn" data-calc aria-expanded="false" aria-controls="rk-calc">Vis beregningen</button><div id="rk-calc" hidden>${table([p])}</div>`;
    show(`${p.d} (${p.vn})`, h, false);
  }
  function openAll() { show('Hele beregningen – alle deler', `<p class="rk-muted">Alle deler i stykklistens rekkefølge, med de seks radene fra MRP-beregningen. Velg et tall for å se utregningen.</p><div id="rk-calc">${table(C.DELER)}</div>`, true); }

  return { DS, C, F, K, fmt, esc, isProd, ENKEL, xlabel, handling, ICON, typeTekst, frame, openPart, openAll };
})();
