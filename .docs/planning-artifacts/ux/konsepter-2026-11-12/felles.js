/*
 * Felles data og hjelpefunksjoner for de tre designkonseptene (2026-11-12).
 * KONSEPT – forslag, ikke godkjent design. Ingen beregning skjer her.
 *
 * MRP-tall, eksepsjoner og bestillingsforslag: kopiert fra testdata/testeksempel-01-fasit.xlsx
 *   (arkene Fasittabell, Eksepsjoner og Bestillingsforslag), kontrollert for hånd.
 * Stykkliste, lager, SS, ledetid og planlagte mottak: testdata/testeksempel-01.xlsx.
 * Produksjonskapasitet: testeksempel 01 har ingen kapasitetsfasit. Tallene er beregnet med
 *   referanseberegningen kapasitet() i testdata/lag_testdata.py (kjørt uendret, 2026-11-12)
 *   og er IKKE manuelt kontrollert.
 */
window.COSI = (function () {
  const H = 10;
  const UKER = Array.from({ length: H }, (_, i) => i + 1);

  const META = {
    produkt: 'Kontorstol Basic', varenummer: '100-002', horisont: H,
    fil: 'testeksempel-01.xlsx', kjort: '12.11.2026 kl. 14:05'
  };

  const TYPER = {
    BF: { navn: 'Bestilling forsinket', g: '!', hvorfor: 'Nettobehov > 0, frigivelsen er forfalt (uke t − L < 1) og disponibel beholdning er under 0.' },
    SS: { navn: 'Bruk av sikkerhetslager', g: 'S', hvorfor: 'Nettobehov > 0, frigivelsen er forfalt, og disponibel beholdning ligger mellom 0 og sikkerhetslageret.' },
    MF: { navn: 'Mottak forsinket', g: 'M', hvorfor: 'Det er nettobehov før et planlagt mottak. Mottaket regnes som fremskyndet, og det lages ingen ny bestilling for behovet det dekker.' },
    KM: { navn: 'Kanseller mottak', g: 'K', hvorfor: 'Delen får ikke noe nettobehov fra mottaksuken til siste uke når mottaket tas bort.' },
    LH: { navn: 'Ledetid overskrider horisont', g: '⧗', hvorfor: 'Den største summen av ledetider fra ferdigproduktet ned til delen er minst like lang som horisonten.' }
  };

  const DELER = [
    { vn: '100-002', d: 'Kontorstol Basic', niva: '0', type: 'Ferdigvare', lager: 0, ss: 0, L: 0, antall: null,
      B: [20,25,30,20,35,30,25,40,30,20], PM: [0,0,0,0,0,0,0,0,0,0], FL: [0,0,0,0,0,0,0,0,0,0],
      NB: [20,25,30,20,35,30,25,40,30,20], POM: [20,25,30,20,35,30,25,40,30,20], POF: [20,25,30,20,35,30,25,40,30,20] },
    { vn: '300-001', d: 'Sete', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 200, ss: 20, L: 2, antall: 1,
      B: [20,25,30,20,35,30,25,40,30,20], PM: [0,0,0,0,0,0,0,0,0,0], FL: [180,155,125,105,70,40,20,20,20,20],
      NB: [0,0,0,0,0,0,5,40,30,20], POM: [0,0,0,0,0,0,5,40,30,20], POF: [0,0,0,0,5,40,30,20,0,0] },
    { vn: '300-002', d: 'Rygg', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 60, ss: 10, L: 1, antall: 1,
      B: [20,25,30,20,35,30,25,40,30,20], PM: [0,0,0,0,0,0,0,0,0,0], FL: [40,15,10,10,10,10,10,10,10,10],
      NB: [0,0,25,20,35,30,25,40,30,20], POM: [0,0,25,20,35,30,25,40,30,20], POF: [0,25,20,35,30,25,40,30,20,0] },
    { vn: '300-003', d: 'Hjul', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 80, ss: 30, L: 1, antall: 5,
      B: [100,125,150,100,175,150,125,200,150,100], PM: [0,0,0,0,0,0,0,0,0,0], FL: [30,30,30,30,30,30,30,30,30,30],
      NB: [50,125,150,100,175,150,125,200,150,100], POM: [50,125,150,100,175,150,125,200,150,100], POF: [175,150,100,175,150,125,200,150,100,0] },
    { vn: '300-004', d: 'Armlene', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 50, ss: 20, L: 1, antall: 2,
      B: [40,50,60,40,70,60,50,80,60,40], PM: [0,0,0,0,0,0,0,0,0,0], FL: [20,20,20,20,20,20,20,20,20,20],
      NB: [10,50,60,40,70,60,50,80,60,40], POM: [10,50,60,40,70,60,50,80,60,40], POF: [60,60,40,70,60,50,80,60,40,0] },
    { vn: '300-005', d: 'Gassfjær', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 75, ss: 10, L: 2, antall: 1,
      B: [20,25,30,20,35,30,25,40,30,20], PM: [0,0,0,100,0,0,0,0,0,0], FL: [55,30,0,80,45,15,10,10,10,10],
      NB: [0,0,0,0,0,0,20,40,30,20], POM: [0,0,0,0,0,0,20,40,30,20], POF: [0,0,0,0,20,40,30,20,0,0] },
    { vn: '300-006', d: 'Stolfot', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 400, ss: 20, L: 10, antall: 1,
      B: [20,25,30,20,35,30,25,40,30,20], PM: [0,0,0,0,0,0,0,0,0,0], FL: [380,355,325,305,270,240,215,175,145,125],
      NB: [0,0,0,0,0,0,0,0,0,0], POM: [0,0,0,0,0,0,0,0,0,0], POF: [0,0,0,0,0,0,0,0,0,0] },
    { vn: '300-007', d: 'Skruesett', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 150, ss: 40, L: 2, antall: 4,
      B: [80,100,120,80,140,120,100,160,120,80], PM: [0,120,0,0,0,0,0,0,0,0], FL: [70,90,40,40,40,40,40,40,40,40],
      NB: [0,0,70,80,140,120,100,160,120,80], POM: [0,0,70,80,140,120,100,160,120,80], POF: [70,80,140,120,100,160,120,80,0,0] },
    { vn: '300-008', d: 'Trekk', niva: '.1', type: 'Komponent (Kjøpes inn)', lager: 90, ss: 0, L: 3, antall: 1,
      B: [20,25,30,20,35,30,25,40,30,20], PM: [0,0,0,0,0,0,0,0,0,0], FL: [70,45,15,0,0,0,0,0,0,0],
      NB: [0,0,0,5,35,30,25,40,30,20], POM: [0,0,0,5,35,30,25,40,30,20], POF: [5,35,30,25,40,30,20,0,0,0] }
  ];

  // Planlagte mottak fra arket Planlagte mottak i testeksempel-01.xlsx
  const MOTTAK = [{ vn: '300-005', uke: 4, antall: 100 }, { vn: '300-007', uke: 2, antall: 120 }];

  // Arket Eksepsjoner i fasit 01 (meldingene ordrett, minus som ekte minustegn)
  const EKSEPSJONER = [
    { vn: '300-003', uke: 1, t: 'BF', melding: 'Lager blir −20 i uke 1. Bestillingen på 50 måtte vært frigitt i uke 0, før horisonten. De 50 er forfalt og tatt med i frigivelsen på 175 i uke 1, men kommer tidligst i uke 2. Leveranse til kunde blir forsinket.' },
    { vn: '300-004', uke: 1, t: 'SS', melding: 'Lager blir 10 i uke 1, under sikkerhetslager 20, før ny leveranse kan komme inn. Bestillingen på 10 måtte vært frigitt i uke 0. De 10 er forfalt og tatt med i frigivelsen på 60 i uke 1, men kommer tidligst i uke 2.' },
    { vn: '300-005', uke: 3, t: 'MF', melding: 'Lager blir 0 i uke 3, under sikkerhetslager 10, før mottaket kommer. Det planlagte mottaket på 100 i uke 4 må fremskyndes til uke 3 hos leverandøren. Det lages ingen ny bestilling for behovet mottaket dekker.' },
    { vn: '300-006', uke: null, t: 'LH', melding: 'Ledetiden fra ferdigproduktet (10 uker: Kontorstol Basic 0 + Stolfot 10) er minst like lang som horisonten (10 uker). Behov etter uke 10 som må bestilles nå, vises ikke i planen. Vurder lengre horisont.' }
  ];

  const RADER = [
    { k: 'B', navn: 'Bruttobehov', regel: 'Hvor mange av delen som trengs i uken. For ferdigproduktet er det prognostiserte behov (MPS). For de andre delene er det frigivelsene til delen over, ganget med antall per enhet.' },
    { k: 'PM', navn: 'Planlagte mottak', regel: 'Innkjøp eller produksjonsordrer som allerede er bestilt eller startet, fra arket Planlagte mottak. Står i uken de er lagt inn.' },
    { k: 'FL', navn: 'Forventet lagerbeholdning', regel: 'Lageret ved slutten av uken: disponibel beholdning pluss planlagt ordremottak. Et fremskyndet mottak er ikke med før det kommer.' },
    { k: 'NB', navn: 'Nettobehov', regel: 'Det som mangler for å holde sikkerhetslageret: maks(0, SS − disponibel beholdning). Planlagte mottak i senere uker fremskyndes før det lages ny bestilling.' },
    { k: 'POM', navn: 'Planlagte ordremottak', regel: 'Mengden en ny, foreslått ordre skal levere i uken. Med lot-for-lot er den lik nettobehovet.' },
    { k: 'POF', navn: 'Planlagte ordrefrigivelser', regel: 'Uken ordren må bestilles eller settes i produksjon: uken den skal mottas, minus ledetiden. Det er dette du bestiller etter.' }
  ];

  // Produksjonskapasitet (FR-31–FR-33). Referanseberegning, ikke manuelt kontrollert.
  const KAPASITET = {
    kilde: 'Beregnet med referanseberegningen kapasitet() i testdata/lag_testdata.py. Ikke manuelt kontrollert – testeksempel 01 har ingen kapasitetsfasit.',
    rader: [
      { navn: 'Fra lager', hjelp: 'bare ledig beholdning', verdier: [10,10,10,10,10,10,10,10,10,10],
        begrensende: UKER.map(() => [{ vn: '300-003', arsak: 'lager' }]) },
      { navn: 'Med planlagte mottak', hjelp: 'mottak fra mottaksuken', verdier: [10,10,10,10,10,10,10,10,10,10],
        begrensende: UKER.map(() => [{ vn: '300-003', arsak: 'lager' }]) }
    ]
  };
  const ARSAK = { lager: 'For lite på lager og i planlagte mottak', ledetid: 'Ordren måtte vært frigitt før uke 1' };

  const byVn = Object.fromEntries(DELER.map(p => [p.vn, p]));
  const fmt = n => (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('nb-NO');
  const kort = t => ({ 'Ferdigvare': 'Ferdigvare', 'Komponent (Kjøpes inn)': 'Kjøpes inn', 'Komponent (Produseres selv)': 'Produseres selv' })[t];
  const art = p => p.type === 'Komponent (Kjøpes inn)' ? 'Innkjøp' : 'Produksjonsordre';
  const eksepsjoner = vn => EKSEPSJONER.filter(x => x.vn === vn);
  const kritiske = () => DELER.filter(p => eksepsjoner(p.vn).length);
  const ledig = p => Math.max(0, p.lager - p.ss);
  const mottakFor = (vn, uke) => MOTTAK.filter(m => m.vn === vn && m.uke === uke).reduce((s, m) => s + m.antall, 0);

  // Forfalt mengde = planlagte ordremottak i uker der t − L < 1 (lagt i frigivelsen i uke 1)
  const forfalt = p => p.POM.reduce((s, v, i) => (i + 1 - p.L < 1 ? s + v : s), 0);

  // Bestillingsforslag = planlagte ordrefrigivelser > 0, sortert etter uke og deretter stykklisterekkefølge
  const forslag = () => {
    const ut = [];
    UKER.forEach(w => DELER.forEach(p => {
      const q = p.POF[w - 1];
      if (q > 0) ut.push({ uke: w, del: p, mengde: q, forfalt: w === 1 ? forfalt(p) : 0 });
    }));
    return ut;
  };

  // Forklaring av én celle i fire lag: svar, utregning, regel, eksepsjoner
  function forklarCelle(p, k, w) {
    const i = w - 1, rad = RADER.find(r => r.k === k);
    const forrige = w === 1 ? p.lager : p.FL[i - 1];
    const forrigeNavn = w === 1 ? 'Lagerbeholdning før uke 1' : `Forventet lagerbeholdning uke ${w - 1}`;
    const disp = forrige + p.PM[i] - p.B[i];
    const fremskyndet = EKSEPSJONER.find(x => x.vn === p.vn && x.t === 'MF' && x.uke === w);
    const topp = byVn['100-002'];
    let svar = '', linjer = [], merknad = '';
    if (k === 'B') {
      if (p.niva === '0') { svar = `Kundene trenger ${fmt(p.B[i])} stoler i uke ${w}.`; linjer = [['Prognostiserte behov (MPS)', fmt(p.B[i])], ['Bruttobehov', fmt(p.B[i])]]; }
      else { svar = `${topp.d} frigis med ${fmt(topp.POF[i])} i uke ${w}, og hver trenger ${p.antall} ${p.d.toLowerCase()}.`;
        linjer = [[`Frigivelse ${topp.d} (${topp.vn}) uke ${w}`, fmt(topp.POF[i])], ['× Antall per enhet', '× ' + p.antall], ['Bruttobehov', fmt(p.B[i])]]; }
    } else if (k === 'PM') {
      svar = p.PM[i] ? `Et mottak på ${fmt(p.PM[i])} er lagt inn i uke ${w}.` : `Ingen planlagte mottak i uke ${w}.`;
      linjer = [['Fra arket Planlagte mottak', fmt(p.PM[i])], ['Planlagte mottak', fmt(p.PM[i])]];
      if (p.vn === '300-005' && w === 4) merknad = 'Mottaket står i uke 4, men er regnet med fra uke 3, der det trengs. Tabellen viser det i uke 4, så du ser hva som skjer om det ikke blir fremskyndet.';
    } else if (k === 'NB') {
      svar = p.NB[i] ? `Det mangler ${fmt(p.NB[i])} for å holde sikkerhetslageret på ${p.ss} i uke ${w}.` : `Lageret holder sikkerhetslageret i uke ${w}.`;
      linjer = [[forrigeNavn, fmt(forrige)], ['+ Planlagte mottak', fmt(p.PM[i])], ['− Bruttobehov', fmt(p.B[i])], ['= Disponibel beholdning', fmt(disp)], ['Sikkerhetslager (SS)', fmt(p.ss)], ['Nettobehov = maks(0, SS − disponibel)', fmt(p.NB[i])]];
      if (fremskyndet) { svar = `Uten mottaket ville det manglet ${fmt(p.ss - disp)}. Mottaket på 100 fra uke 4 er regnet med fra uke 3, så nettobehovet blir 0.`; merknad = 'Mottaket på 100 står i uke 4, men er regnet med fra uke 3.'; }
    } else if (k === 'FL') {
      svar = `Lageret er ${fmt(p.FL[i])} ved slutten av uke ${w}.`;
      linjer = [[forrigeNavn, fmt(forrige)], ['+ Planlagte mottak', fmt(p.PM[i])], ['− Bruttobehov', fmt(p.B[i])], ['= Disponibel beholdning', fmt(disp)], ['+ Planlagt ordremottak', fmt(p.POM[i])], ['Forventet lagerbeholdning', fmt(p.FL[i])]];
      if (fremskyndet) merknad = 'Lageret er under sikkerhetslageret fordi det fremskyndede mottaket ikke er regnet med før det kommer i uke 4.';
    } else if (k === 'POM') {
      svar = p.POM[i] ? `En ny ordre må levere ${fmt(p.POM[i])} i uke ${w}.` : `Ingen ny ordre trengs i uke ${w}.`;
      linjer = [[`Nettobehov uke ${w}`, fmt(p.NB[i])], ['Bestillingsregel', 'Lot-for-lot'], ['Planlagt ordremottak', fmt(p.POM[i])]];
      if (p.POM[i] > 0 && w - p.L < 1) merknad = `Ordren måtte vært frigitt i uke ${w - p.L}, før horisonten. Den er forfalt og lagt i frigivelsen i uke 1.`;
    } else if (k === 'POF') {
      const t = w + p.L, ff = w === 1 ? forfalt(p) : 0;
      svar = p.POF[i] ? `Bestill ${fmt(p.POF[i])} i uke ${w}${ff ? `, hvorav ${ff} er forfalt` : ''}.` : `Ingenting skal bestilles i uke ${w}.`;
      if (ff) linjer.push(['Forfalt (skulle vært frigitt før uke 1)', fmt(ff)]);
      linjer.push([t <= H ? `Planlagt ordremottak uke ${t} (uke ${w} + L ${p.L})` : `Mottak i uke ${t} er etter horisonten`, t <= H ? fmt(p.POM[t - 1]) : '0']);
      linjer.push(['Planlagt ordrefrigivelse', fmt(p.POF[i])]);
    }
    return { tittel: `${rad.navn}: ${fmt(p[k][i])}`, under: `${p.vn} ${p.d} · uke ${w}`, svar, linjer, merknad, regel: rad.regel,
      eksepsjoner: EKSEPSJONER.filter(x => x.vn === p.vn && x.uke === w) };
  }
  function forklarRad(p, k) {
    const rad = RADER.find(r => r.k === k);
    return { tittel: rad.navn, under: `${p.vn} ${p.d} · hele raden`, svar: rad.regel, linjer: [['Lagerbeholdning', fmt(p.lager)], ['Sikkerhetslager', fmt(p.ss)], ['Ledetid', p.L + ' uker'], ['Type', kort(p.type)]], merknad: 'Velg et tall i raden for å se utregningen bak det.', regel: '', eksepsjoner: [] };
  }
  function forklarEksepsjon(vn, uke) {
    const p = byVn[vn], xs = EKSEPSJONER.filter(x => x.vn === vn && (uke ? x.uke === uke : !x.uke));
    return { tittel: xs.length > 1 ? `${xs.length} eksepsjoner` : TYPER[xs[0].t].navn, under: `${p.vn} ${p.d} · ${uke ? 'uke ' + uke : 'hele delen'}`, svar: '', linjer: [], merknad: '', regel: '', eksepsjoner: xs };
  }

  // Lukk forklaringen med Esc i alle konseptene
  function escLukker(fn) { document.addEventListener('keydown', e => { if (e.key === 'Escape') fn(); }); }

  return { H, UKER, META, TYPER, DELER, MOTTAK, EKSEPSJONER, RADER, KAPASITET, ARSAK, byVn, fmt, kort, art, eksepsjoner, kritiske, ledig, mottakFor, forfalt, forslag, forklarCelle, forklarRad, forklarEksepsjon, escLukker };
})();
