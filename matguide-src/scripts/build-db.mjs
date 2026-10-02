// Bygger masterdatabasen (src/data/foods.json + src/data/meta.json) från de transkriberade källorna.
// Kör: node scripts/build-db.mjs
//
// Slutstatus dag 1–21 beräknas från HELA underlaget (ALCAT + individuellt kostschema).
// ALCAT grön ≠ automatiskt tillåten. Saknas underlag → UNVERIFIED. Motsägelse → DATA_CONFLICT.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALCAT, ALCAT_LEVELS, DOCS } from '../data/alcat.mjs';
import { PLANS, PLAN_RULES } from '../data/plans.mjs';
import { ALCAT_NAMES, ELIMINATE_NAMES, CATEGORIES } from '../data/catalog.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const rotation = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/rotation.json'), 'utf8'));
const PEOPLE = ['linn', 'patrik'];
const NAME = { linn: 'Linn', patrik: 'Patrik' };

// ---------------------------------------------------------------------------
// Livsmedel som inte är egna ALCAT-poster men som kostschemana uttryckligen nämner.
// components: ALCAT-poster produkten består av / utvinns ur.
// composition: 'whole' = består definitionsmässigt enbart av komponenterna (ägg = äggula + äggvita)
//              'derived' = tillverkas av komponenten; kan skilja sig → kräver uttryckligt stöd i kostschemat
// rules: per person, nycklar i PLAN_RULES (eller inline-regler)
// ---------------------------------------------------------------------------
const EXTRA_ITEMS = [
  { key: 'ÄGG', name: 'Ägg (helt)', category: 'Protein', aliases: ['ägg', 'hela ägg'], components: ['ÄGGULA', 'ÄGGVITA'], composition: 'whole',
    rules: { patrik: ['wednesday'] } },
  { key: 'TAHINI', name: 'Tahini (sesampasta)', category: 'Nötter & frön', aliases: ['sesampasta', 'zeina'], components: ['SESAM'], composition: 'derived',
    rules: { linn: ['breakfast'], patrik: ['breakfast'] } },
  { key: 'VALNÖTSSMÖR', name: 'Valnötssmör', category: 'Nötter & frön', aliases: [], components: ['VALNÖT'], composition: 'derived',
    rules: { linn: ['breakfast'] } },
  // Användarbeslut 2026-10-02: "Manukahonung är ok. det ska inte räknas som honung."
  { key: 'MANUKAHONUNG', name: 'Manukahonung', category: 'Övrigt', aliases: ['manuka', 'honung'], components: [], composition: 'whole',
    rules: { linn: ['userManuka'], patrik: ['breakfast', 'userManuka'] } },
  { key: 'MAJSKAKOR', name: 'Majskakor (som knäckebröd)', category: 'Spannmål & stärkelse', aliases: ['majskaka', 'knäckebröd', 'majsknäcke'], components: ['MAJS'], composition: 'derived',
    rules: { linn: ['crispbread'] } },
  { key: 'KNÄCKEBRÖD', name: 'Knäckebröd (sort ej angiven)', category: 'Spannmål & stärkelse', aliases: ['knäcke', 'knäckebröd'], components: [], composition: 'derived',
    rules: { linn: ['crispbreadOnlyCorn'], patrik: ['crispbreadUnspecified'] } },
  { key: 'LINSPASTA', name: 'Linspasta', category: 'Spannmål & stärkelse', aliases: ['linser pasta', 'pasta'], components: ['LINSER'], composition: 'derived',
    rules: { linn: ['monday'] } },
  { key: 'KOKOSFETT', name: 'Kokosfett', category: 'Fett & oljor', aliases: ['kokosolja'], components: ['KOKOSNÖT'], composition: 'derived',
    rules: { linn: ['fryingFat'] } },
  { key: 'ANKFETT', name: 'Ankfett', category: 'Fett & oljor', aliases: [], components: ['ANKA'], composition: 'derived',
    rules: { patrik: ['fryingFat'] } },
  { key: 'OLIVOLJA', name: 'Olivolja', category: 'Fett & oljor', aliases: ['olja'], components: ['OLIV'], composition: 'derived',
    rules: { linn: ['oil'], patrik: ['oil'] } },
  { key: 'SALT', name: 'Keltiskt salt / havssalt', category: 'Kryddor & örter', aliases: ['salt', 'havssalt', 'celtic salt', 'keltiskt salt'], components: [], composition: 'whole',
    rules: { linn: ['salt'], patrik: ['salt'] } },
  { key: 'SALT_ANNAT', name: 'Annat salt (t.ex. bordssalt)', category: 'Kryddor & örter', aliases: ['salt', 'bordssalt'], components: [], composition: 'whole',
    rules: { linn: ['saltOther'], patrik: ['saltOther'] } },
  { key: 'VATTEN', name: 'Vatten', category: 'Drycker', aliases: [], components: [], composition: 'whole',
    rules: { linn: ['water'], patrik: ['water'] } },
  { key: 'ÖRTTE', name: 'Örtte', category: 'Drycker', aliases: ['herbal tea', 'te'], components: [], composition: 'whole',
    rules: { linn: ['drinks'], patrik: ['drinks'] } },
  { key: 'VIN', name: 'Vin', category: 'Drycker', aliases: ['alkohol'], components: [], composition: 'whole', rules: { linn: ['yeastEtc'], patrik: ['yeastEtc'] } },
  { key: 'ÖL', name: 'Öl', category: 'Drycker', aliases: ['alkohol'], components: [], composition: 'whole', rules: { linn: ['yeastEtc'], patrik: ['yeastEtc'] } },
  { key: 'VINÄGER', name: 'Vinäger', category: 'Övrigt', aliases: ['ättika'], components: [], composition: 'whole', rules: { linn: ['yeastEtc'], patrik: ['yeastEtc'] } },
  { key: 'SOCKER', name: 'Socker', category: 'Övrigt', aliases: [], components: [], composition: 'whole', rules: { linn: ['yeastEtc'], patrik: ['yeastEtc'] } },
  { key: 'FERMENTERAT', name: 'Fermenterade produkter', category: 'Övrigt', aliases: ['surkål', 'kimchi', 'kombucha', 'fermenterat'], components: [], composition: 'whole',
    rules: { linn: ['yeastEtc'], patrik: ['yeastEtc'] } },
  { key: 'MEJERI', name: 'Mejeriprodukter (alla)', category: 'Övrigt', aliases: ['mejeri', 'mjölk', 'ost', 'smör', 'grädde', 'yoghurt', 'fil', 'kvarg', 'crème fraiche'], components: [], composition: 'whole',
    rules: { linn: ['dairy'], patrik: ['dairy'] } },
];

// Extra inline-regler (härledda ur citerade kostschema-rader)
const USER_MANUKA = { effect: 'ALLOW', kind: 'ANVÄNDARBESLUT', document: 'Användarens beslut (2026-10-02)', page: null,
  quote: 'Manukahonung är ok. det ska inte räknas som honung.' };
const INLINE_RULES = {
  linn: {
    userManuka: USER_MANUKA,
    crispbreadOnlyCorn: { effect: 'CONDITIONAL', quote: 'Tillåtna drycker och brygder: … -Majskakor som knäckebröd', page: 2,
      restriction: 'Endast majskakor anges som knäckebröd i Linns kostschema.' },
  },
  patrik: {
    userManuka: USER_MANUKA,
    crispbreadUnspecified: { effect: 'UNSPECIFIED', quote: 'Fruktsallad + … + 1 st knäckebröd', page: 1,
      restriction: 'Knäckebröd ingår i schemat men sorten anges inte. Ingredienserna måste kontrolleras (jäst är inte tillåtet; korn, malt, råg, speltvete och vete ska elimineras enligt ALCAT).' },
  },
};

// Vilka ALCAT-poster berörs av vilken kostschema-regel (ordagrant ur regeltexten)
const RULE_TARGETS = {
  yeastEtc: ['BAKJÄST', 'BRYGGJÄST', 'NÄRINGSJÄST', 'VINDRUVA'],
  dairy: ['FÅRMJÖLK', 'GETMJÖLK', 'KOMJÖLK'],
  drinksNotListed: ['KAFFE', 'GRÖNT TE', 'SVART TE'],
};

const YEAST_WORD = { BAKJÄST: 'jäst', BRYGGJÄST: 'jäst', NÄRINGSJÄST: 'jäst', VINDRUVA: 'vindruvor' };

// ALCAT-livsmedel som kostschemat uttryckligen namnger i veckodagsreglerna (för källspårning)
const PLAN_NAMED = {
  linn: { RIS: 'monday', KALKON: 'wednesday', KYCKLING: 'wednesday', KALVKÖTT: 'sunday', GRISKÖTT: 'sunday' },
  patrik: { HIRS: 'monday', RIS: 'monday', MAJS: 'monday', SÖTPOTATIS: 'monday', KYCKLING: 'wednesday', KALKON: 'wednesday', ANKA: 'sunday', HJORTKÖTT: 'sunday' },
};

// Globala anteckningar per ALCAT-namn
const ITEM_NOTES = {
  KAPRIS: ['Kostschemana förbjuder vinäger och fermenterade produkter. Statusen gäller råvaran kapris – inte inlagd kapris.'],
  OLIV: ['Kostschemana förbjuder vinäger och fermenterade produkter. Statusen gäller råvaran oliv – inte inlagda oliver.'],
};

// ---------------------------------------------------------------------------
function slug(s) {
  return s.toLowerCase()
    .replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/é/g, 'e').replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function normalized(display) {
  return display.toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').trim();
}

// ALCAT-index per person: NAME → [{level, section}]
function alcatIndex(who) {
  const a = ALCAT[who];
  const idx = {};
  const add = (n, level, section) => (idx[n] ||= []).push({ level, section });
  a.severe.forEach((n) => add(n, 'SEVERE', 'ALLVARLIG'));
  a.moderate.forEach((n) => add(n, 'MODERATE', 'MÅTTLIG'));
  a.mild.forEach((n) => add(n, 'MILD', 'MILD*'));
  for (const [sec, list] of Object.entries(a.none)) list.forEach((n) => add(n, 'NONE', `ACCEPTABEL/INGEN REAKTION – ${sec}`));
  const elim = {};
  for (const [box, list] of Object.entries(a.eliminate)) list.forEach((n) => (elim[n] = box));
  return { idx, elim };
}
const IDX = Object.fromEntries(PEOPLE.map((p) => [p, alcatIndex(p)]));

function rotationDay(who, name) {
  const days = [];
  for (const [d, list] of Object.entries(rotation[who])) {
    if (list.some((x) => x.replace(/\*$/, '') === name)) days.push(Number(d));
  }
  return days.length ? days : null;
}

const LEVEL_LABEL = {
  SEVERE: 'Allvarlig reaktion', MODERATE: 'Måttlig reaktion', MILD: 'Mild reaktion',
  NONE: 'Acceptabel / ingen reaktion', NOT_TESTED: 'Ej testad i ALCAT', CONFLICT: 'Motstridig (två olika nivåer)',
  ELIMINATE: 'Ska elimineras (blå ruta)', DERIVED: 'Härledd från ingående råvara',
};

function markerFor(who, box) {
  const m = ALCAT[who].markers;
  if (box.startsWith('CANDIDA')) return `CANDIDA ALBICANS: ${m['CANDIDA ALBICANS']}`;
  if (box.startsWith('GLUTEN')) return `GLUTEN: ${m.GLUTEN}, GLIADIN: ${m.GLIADIN}`;
  return `KASEIN: ${m.KASEIN}, VASSLE: ${m.VASSLE}, LAKTOS: ${m.LAKTOS}`;
}

// Utvärdera ALCAT för ett ALCAT-namn
function alcatEval(who, name) {
  const { idx, elim } = IDX[who];
  const hits = idx[name] || [];
  const doc = ALCAT[who].document;
  if (elim[name]) {
    return {
      status: 'ELIMINATE',
      label: LEVEL_LABEL.ELIMINATE,
      sources: [{ kind: 'ALCAT', document: doc, page: 1, text: `Blå ruta ${elim[name]} (${markerFor(who, elim[name])}) – "Also eliminate these foods: ${ALCAT[who].eliminate[elim[name]].join(', ')}"` }],
      box: elim[name],
    };
  }
  if (!hits.length) return { status: 'NOT_TESTED', label: LEVEL_LABEL.NOT_TESTED, sources: [], hits };
  const levels = [...new Set(hits.map((h) => h.level))];
  const sources = hits.map((h) => ({ kind: 'ALCAT', document: doc, page: 1, text: `Kolumn ${h.section}: "${name}${h.level === 'MILD' ? '*' : ''}"` }));
  if (levels.length > 1) return { status: 'CONFLICT', label: LEVEL_LABEL.CONFLICT, sources, hits };
  return { status: levels[0], label: LEVEL_LABEL[levels[0]], sources, hits };
}

function getRule(who, key) {
  return (PLAN_RULES[who] && PLAN_RULES[who][key]) || (INLINE_RULES[who] && INLINE_RULES[who][key]);
}

function planSource(who, rule) {
  return { kind: rule.kind || 'KOSTSCHEMA', document: rule.document || PLANS[who].document, page: rule.page, text: rule.quote };
}

// ---------------------------------------------------------------------------
// Kärnlogik: slutstatus för en person och ett livsmedel
// ---------------------------------------------------------------------------
function decide(who, item) {
  const sources = [];
  const notes = [];
  const reasons = []; // {type: 'avoid'|'allow'|'info', text, duration}
  let alcat;

  // 1. ALCAT
  if (item.alcatName) {
    alcat = alcatEval(who, item.alcatName);
    sources.push(...alcat.sources);
  } else if (item.components && item.components.length) {
    const comps = item.components.map((c) => ({ name: c, ev: alcatEval(who, c) }));
    comps.forEach((c) => sources.push(...c.ev.sources));
    alcat = { status: 'DERIVED', label: LEVEL_LABEL.DERIVED, comps };
  } else {
    alcat = { status: 'NOT_TESTED', label: LEVEL_LABEL.NOT_TESTED };
  }

  // 2. Kostschema-regler
  const ruleKeys = [...((item.rules && item.rules[who]) || [])];
  if (item.alcatName) {
    if (RULE_TARGETS.yeastEtc.includes(item.alcatName)) ruleKeys.push('yeastEtc');
    if (RULE_TARGETS.dairy.includes(item.alcatName)) ruleKeys.push('dairy');
    if (RULE_TARGETS.drinksNotListed.includes(item.alcatName)) ruleKeys.push('drinksNotListed');
    if (PLAN_NAMED[who][item.alcatName]) ruleKeys.push(PLAN_NAMED[who][item.alcatName]);
  }
  const rules = ruleKeys.map((k) => {
    if (k === 'drinksNotListed') {
      const r = getRule(who, 'drinks');
      return { key: k, effect: 'DRINK_NOT_LISTED', quote: r.quote, page: r.page };
    }
    return { key: k, ...getRule(who, k) };
  });
  rules.forEach((r) => sources.push(planSource(who, r)));

  const forbid = rules.filter((r) => r.effect === 'FORBID');
  const allow = rules.filter((r) => r.effect === 'ALLOW');
  const conditional = rules.filter((r) => r.effect === 'CONDITIONAL');
  const drinkNotListed = rules.filter((r) => r.effect === 'DRINK_NOT_LISTED');
  const ambiguous = rules.filter((r) => r.effect === 'AMBIGUOUS');
  const unspecified = rules.filter((r) => r.effect === 'UNSPECIFIED');

  let dietPlanStatus = 'NO_RULE';
  if (forbid.length) dietPlanStatus = 'FORBIDDEN';
  else if (allow.length) dietPlanStatus = 'EXPLICITLY_ALLOWED';
  else if (conditional.length) dietPlanStatus = 'CONDITIONAL';
  else if (drinkNotListed.length) dietPlanStatus = 'NOT_LISTED_AS_ALLOWED_DRINK';
  else if (ambiguous.length) dietPlanStatus = 'AMBIGUOUS';
  else if (unspecified.length) dietPlanStatus = 'UNSPECIFIED';

  const isReaction = (s) => ['SEVERE', 'MODERATE', 'MILD'].includes(s);
  const compReacting = alcat.status === 'DERIVED' ? alcat.comps.filter((c) => isReaction(c.ev.status) || c.ev.status === 'ELIMINATE') : [];
  const compUnknown = alcat.status === 'DERIVED' ? alcat.comps.filter((c) => ['NOT_TESTED', 'CONFLICT'].includes(c.ev.status)) : [];

  // Skäl – ALCAT
  if (isReaction(alcat.status)) {
    const L = ALCAT_LEVELS[alcat.status];
    reasons.push({ type: 'avoid', text: `ALCAT: ${L.label}. ${L.text}`, duration: L.duration });
  }
  if (alcat.status === 'ELIMINATE') {
    reasons.push({ type: 'avoid', text: `ALCAT: listad under "Also eliminate these foods" i rutan ${alcat.box} (${markerFor(who, alcat.box)}).`, duration: 'Ingen tidsgräns angiven i rapporten' });
  }
  for (const c of compReacting) {
    const lvl = c.ev.status === 'ELIMINATE' ? `ska elimineras (${c.ev.box})` : LEVEL_LABEL[c.ev.status].toLowerCase();
    reasons.push({ type: 'avoid', text: `Ingående råvara ${c.name}: ${lvl} i ALCAT.`, duration: c.ev.status === 'ELIMINATE' ? 'Ingen tidsgräns angiven i rapporten' : ALCAT_LEVELS[c.ev.status].duration });
  }
  for (const r of forbid) {
    const what = item.alcatName && YEAST_WORD[item.alcatName] ? ` (gäller ${YEAST_WORD[item.alcatName]})` : '';
    reasons.push({ type: 'avoid', text: `Kostschema: "${r.quote}"${what}`, duration: r.duration });
  }
  if (item.ruleNote && item.ruleNote[who]) notes.push(item.ruleNote[who]);

  // 3. Slutstatus
  let final;
  let restriction = null;
  if (alcat.status === 'CONFLICT') {
    final = 'DATA_CONFLICT';
    notes.push(`"${item.alcatName}" förekommer två gånger i ${NAME[who]}s ALCAT-rapport med olika nivåer (${alcat.hits.map((h) => h.section.split(' – ')[0]).join(' och ')}). Troligen två olika panelposter med samma svenska översättning – det går inte att avgöra vilken som avses.`);
    restriction = 'Datakonflikt – kräver kontroll';
  } else if (allow.length && (isReaction(alcat.status) || alcat.status === 'ELIMINATE' || compReacting.length)) {
    final = 'DATA_CONFLICT';
    notes.push('Kostschemat anger uttryckligen livsmedlet, men ALCAT-rapporten anger att det ska undvikas/elimineras.');
    restriction = 'Datakonflikt – kostschema och ALCAT säger olika';
  } else if (isReaction(alcat.status) || alcat.status === 'ELIMINATE' || forbid.length) {
    final = 'AVOID';
  } else if (compReacting.length && item.composition === 'whole') {
    final = 'AVOID';
  } else if (compReacting.length) {
    final = 'UNVERIFIED';
    notes.push(`${item.name} testas inte separat och nämns inte i ${NAME[who]}s kostschema. Ingående råvara har reaktion i ALCAT (se ovan) – statusen kan inte verifieras.`);
  } else if (conditional.length) {
    final = 'RESTRICTED';
    restriction = conditional.map((r) => r.restriction || 'Tillåten enligt kostschemat, men den ingående örten/råvaran måste själv vara tillåten.').join(' ');
  } else if (unspecified.length) {
    final = 'UNVERIFIED';
    restriction = unspecified.map((r) => r.restriction).join(' ');
  } else if (drinkNotListed.length) {
    final = 'UNVERIFIED';
    notes.push(`ALCAT: ${alcat.label.toLowerCase()}. Men kostschemat anger "${drinkNotListed[0].quote}" – ${item.name.toLowerCase()} nämns inte bland tillåtna drycker. Kan inte verifieras som tillåten dag 1–21.`);
  } else if (ambiguous.length) {
    final = 'UNVERIFIED';
    notes.push(`Kostschemat skriver "${ambiguous[0].quote}" – ordet "olivolja" står inte. Tvetydigt, kräver kontroll.`);
  } else if (allow.length && compUnknown.length === 0) {
    final = 'ALLOWED';
    for (const a of allow) reasons.push({ type: 'allow', text: `${a.kind === 'ANVÄNDARBESLUT' ? 'Användarbeslut' : 'Kostschema'}: "${a.quote}"` });
    if (alcat.status === 'DERIVED') reasons.push({ type: 'allow', text: `ALCAT: ${alcat.comps.map((c) => `${c.name} – ${c.ev.label.toLowerCase()}`).join(', ')}.` });
    if (alcat.status === 'NONE') reasons.push({ type: 'allow', text: 'ALCAT: acceptabel / ingen reaktion.' });
  } else if (alcat.status === 'NONE') {
    final = 'ALLOWED';
    reasons.push({ type: 'allow', text: 'ALCAT: acceptabel / ingen reaktion (grön). Ingen regel i kostschemat begränsar livsmedlet under dag 1–21.' });
  } else if (alcat.status === 'DERIVED') {
    final = 'UNVERIFIED';
    notes.push(`${item.name} testas inte separat och nämns inte i ${NAME[who]}s kostschema.`);
  } else {
    final = 'UNVERIFIED';
    notes.push(`Ej testad i ${NAME[who]}s ALCAT-panel och inte nämnd i kostschemat.`);
  }

  if (final === 'AVOID') {
    restriction = reasons.filter((r) => r.type === 'avoid').map((r) => r.text).join(' ');
  }
  const durations = [...new Set(reasons.filter((r) => r.type === 'avoid' && r.duration).map((r) => r.duration))];

  if (alcat.status === 'MILD') {
    notes.push('Mild (gul) reaktion: kostschemat bygger på "Gröna listan" (frukt/grönsaker "från den gröna listan"), så livsmedlet räknas inte som tillåtet dag 1–21.');
  }
  if (item.alcatName && alcat.hits && alcat.hits.length > 1 && alcat.status !== 'CONFLICT') {
    notes.push(`"${item.alcatName}" förekommer ${alcat.hits.length} gånger i rapporten med samma nivå (troligen olika panelposter med samma svenska översättning).`);
  }
  if (who === 'linn' && item.alcatName === 'VIT POTATIS') {
    notes.push('Linns schema anger soppa "potatisfri" på tisdagar. I övrigt finns ingen regel mot potatis.');
  }
  if (item.alcatName === 'HONUNG') {
    notes.push('Manukahonung räknas inte som honung (användarbeslut) – se posten Manukahonung.');
  }

  const primary = sources[0] || null;
  return {
    alcatStatus: alcat.status,
    alcatLabel: alcat.status === 'DERIVED'
      ? `Härledd: ${alcat.comps.map((c) => `${c.name} – ${c.ev.label.toLowerCase()}`).join(', ')}`
      : alcat.label,
    dietPlanStatusDay1To21: dietPlanStatus,
    protocolStatus: dietPlanStatus,
    finalStatusDay1To21: final,
    restriction,
    restrictionDuration: durations.length ? durations.join(' · ') : null,
    sourceDocument: primary ? primary.document : null,
    sourcePage: primary ? primary.page : null,
    sourceText: primary ? primary.text : null,
    sources,
    reasons,
    notes,
    rotationDays: item.alcatName ? rotationDay(who, item.alcatName) : null,
  };
}

// Re:store by Sanna: ALLOWED_FOR_BOTH endast om båda har ALLOWED. Inga undantag.
function restore(l, p) {
  const s = [l.finalStatusDay1To21, p.finalStatusDay1To21];
  if (s.includes('DATA_CONFLICT')) return 'DATA_CONFLICT';
  if (s[0] === 'ALLOWED' && s[1] === 'ALLOWED') return 'ALLOWED_FOR_BOTH';
  if (s.includes('AVOID')) return 'NOT_ALLOWED_FOR_BOTH';
  if (s.includes('UNVERIFIED')) return 'UNVERIFIED';
  return 'NOT_ALLOWED_FOR_BOTH';
}

function compare(l, p) {
  const L = l.finalStatusDay1To21, Pt = p.finalStatusDay1To21;
  if (L === 'DATA_CONFLICT' || Pt === 'DATA_CONFLICT') return 'DATA_CONFLICT';
  if (L === 'ALLOWED' && Pt === 'ALLOWED') return 'BOTH_ALLOWED';
  if (L === 'ALLOWED' && Pt === 'AVOID') return 'LINN_ONLY';
  if (Pt === 'ALLOWED' && L === 'AVOID') return 'PATRIK_ONLY';
  if (L === 'AVOID' && Pt === 'AVOID') return 'BOTH_AVOID';
  if (L !== 'UNVERIFIED' && Pt !== 'UNVERIFIED') return 'DIFFERENT_RESTRICTION';
  return 'UNVERIFIED';
}

// ---------------------------------------------------------------------------
const items = [];
const allAlcatNames = new Set();
for (const who of PEOPLE) {
  const a = ALCAT[who];
  [...a.severe, ...a.moderate, ...a.mild, ...Object.values(a.none).flat()].forEach((n) => allAlcatNames.add(n));
}
for (const n of allAlcatNames) {
  const meta = ALCAT_NAMES[n];
  if (!meta) throw new Error(`Saknar katalogpost för ALCAT-namn: ${n}`);
  items.push({ key: n, alcatName: n, name: meta[0], category: meta[1], aliases: meta[2], note: meta[3] });
}
for (const [n, meta] of Object.entries(ELIMINATE_NAMES)) {
  if (allAlcatNames.has(n)) throw new Error(`Dubbel post: ${n}`);
  items.push({ key: n, alcatName: n, name: meta[0], category: meta[1], aliases: meta[2], note: meta[3] });
}
for (const ex of EXTRA_ITEMS) items.push({ ...ex, alcatName: null });
for (const k of Object.keys(ALCAT_NAMES)) if (!allAlcatNames.has(k)) throw new Error(`Katalogpost utan ALCAT-träff: ${k}`);

const foods = items.map((it) => {
  const linn = decide('linn', it);
  const patrik = decide('patrik', it);
  const globalNotes = [];
  if (it.note) globalNotes.push(it.note);
  if (it.alcatName && ITEM_NOTES[it.alcatName]) globalNotes.push(...ITEM_NOTES[it.alcatName]);
  return {
    id: slug(it.key === 'SALT_ANNAT' ? 'annat-salt' : it.name),
    displayName: it.name,
    normalizedName: normalized(it.name),
    category: it.category,
    aliases: it.aliases || [],
    alcatName: it.alcatName,
    components: it.components || [],
    notes: globalNotes,
    linn,
    patrik,
    comparisonStatus: compare(linn, patrik),
    restoreStatus: restore(linn, patrik),
  };
}).sort((a, b) => a.displayName.localeCompare(b.displayName, 'sv'));

const ids = new Set();
for (const f of foods) {
  if (ids.has(f.id)) throw new Error(`Dubblett-id ${f.id}`);
  ids.add(f.id);
  if (!CATEGORIES.includes(f.category)) throw new Error(`Okänd kategori ${f.category}`);
}

// ---------------------------------------------------------------------------
// Konfliktregister: person, livsmedel, källa A + vad den säger, källa B + vad den säger
const LEVEL_SAYS = { SEVERE: 'Allvarlig reaktion', MODERATE: 'Måttlig reaktion', MILD: 'Mild reaktion (gul*)', NONE: 'Acceptabel / ingen reaktion (grön)' };
const conflicts = [];
for (const f of foods) {
  for (const who of PEOPLE) {
    if (f[who].finalStatusDay1To21 !== 'DATA_CONFLICT') continue;
    const hits = IDX[who].idx[f.alcatName] || [];
    const lv = [...new Set(hits.map((h) => h.level))];
    if (lv.length > 1) {
      const a = hits.find((h) => h.level === lv[0]);
      const b = hits.find((h) => h.level === lv[1]);
      conflicts.push({
        status: 'OPEN', foodId: f.id, food: f.displayName, person: who,
        sourceA: { document: ALCAT[who].document, page: 1, text: `Kolumn ${a.section}: "${f.alcatName}${a.level === 'MILD' ? '*' : ''}"`, says: LEVEL_SAYS[a.level] },
        sourceB: { document: ALCAT[who].document, page: 1, text: `Kolumn ${b.section}: "${f.alcatName}${b.level === 'MILD' ? '*' : ''}"`, says: LEVEL_SAYS[b.level] },
        effect: 'Används inte i Re:store förrän konflikten är löst.',
      });
    } else {
      const plan = f[who].sources.find((x) => x.kind === 'KOSTSCHEMA');
      const al = f[who].sources.find((x) => x.kind === 'ALCAT');
      conflicts.push({
        status: 'OPEN', foodId: f.id, food: f.displayName, person: who,
        sourceA: plan ? { ...plan, says: 'Livsmedlet ingår i kostschemat' } : null,
        sourceB: al ? { ...al, says: f[who].alcatLabel } : null,
        effect: 'Används inte i Re:store förrän konflikten är löst.',
      });
    }
  }
}
// Konflikter som användaren har avgjort (visas för spårbarhet)
const resolvedConflicts = [
  {
    status: 'RESOLVED', foodId: 'manukahonung', food: 'Manukahonung', person: 'patrik',
    sourceA: { kind: 'KOSTSCHEMA', document: PLANS.patrik.document, page: 1, text: PLANS.patrik.meals[0].text, says: '1 tsk manuka honung ingår i frukosten' },
    sourceB: { kind: 'ALCAT', document: ALCAT.patrik.document, page: 1, text: `Blå ruta CANDIDA ALBICANS (MÅTTLIG) – "Also eliminate these foods: ${ALCAT.patrik.eliminate['CANDIDA ALBICANS'].join(', ')}"`, says: 'Honung ska elimineras' },
    resolution: 'Användarbeslut 2026-10-02: "Manukahonung är ok. det ska inte räknas som honung."',
    effect: 'Manukahonung räknas som tillåten. Den används ändå inte i Re:store-planen eftersom Linns kostschema inte har den i frukosten.',
  },
];

const meta = {
  generatedFrom: DOCS,
  people: {
    linn: {
      name: 'Linn Grant', short: 'Linn',
      alcat: { ...ALCAT.linn.meta, document: ALCAT.linn.document, markers: ALCAT.linn.markers, eliminate: ALCAT.linn.eliminate, printedItems: [...ALCAT.linn.severe, ...ALCAT.linn.moderate, ...ALCAT.linn.mild, ...Object.values(ALCAT.linn.none).flat()].length },
      plan: PLANS.linn,
      rotation: rotation.linn,
    },
    patrik: {
      name: 'Patrik Rees', short: 'Patrik',
      alcat: { ...ALCAT.patrik.meta, document: ALCAT.patrik.document, markers: ALCAT.patrik.markers, eliminate: ALCAT.patrik.eliminate, printedItems: [...ALCAT.patrik.severe, ...ALCAT.patrik.moderate, ...ALCAT.patrik.mild, ...Object.values(ALCAT.patrik.none).flat()].length },
      plan: PLANS.patrik,
      rotation: rotation.patrik,
    },
  },
  alcatLevels: ALCAT_LEVELS,
  conflicts,
  resolvedConflicts,
  categories: CATEGORIES,
};

const out = path.join(ROOT, 'src/data');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'foods.json'), JSON.stringify(foods, null, 1) + '\n');
fs.writeFileSync(path.join(out, 'meta.json'), JSON.stringify(meta, null, 1) + '\n');

const count = (s) => foods.filter((f) => f.comparisonStatus === s).length;
console.log(`Livsmedel: ${foods.length}`);
for (const s of ['BOTH_ALLOWED', 'LINN_ONLY', 'PATRIK_ONLY', 'BOTH_AVOID', 'DIFFERENT_RESTRICTION', 'UNVERIFIED', 'DATA_CONFLICT']) console.log(`  ${s}: ${count(s)}`);
