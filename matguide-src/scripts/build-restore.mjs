// Re:store by Sanna – bygger och validerar 21-dagarsplanen → src/data/restore.json
// Varje ingrediens: Linn ALLOWED + Patrik ALLOWED (TEST A). Varje måltid: dagens gemensamma struktur (TEST B).
// Bygget avbryts om en dag fallerar av något annat skäl än en dokumenterad lucka i källmaterialet.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MEALS, DAYS, DAILY_DRINKS, START_DATE } from '../data/restore-plan.mjs';
import { SLOTS, DAY_RULES, WEEKDAY_LABEL, validateDay, sharedBase, expandIngredients } from '../src/lib/restoreRules.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const foods = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/foods.json'), 'utf8'));
const byId = Object.fromEntries(foods.map((f) => [f.id, f]));
const mealsById = Object.fromEntries(MEALS.map((m) => [m.id, m]));

// Kontroll: lunch/middag-recept används bara på rätt veckodag
const usage = {};
for (const d of DAYS) for (const s of SLOTS) {
  const m = mealsById[d.meals[s.key]];
  if (!m) throw new Error(`Dag ${d.day}: okänd måltid ${d.meals[s.key]}`);
  const expect = s.key === 'lunch' || s.key === 'dinner' ? 'main' : s.key;
  if (m.slot !== expect) throw new Error(`Dag ${d.day}: ${m.id} är en ${m.slot}-måltid, inte ${s.key}`);
  if (m.slot === 'main' && !m.id.startsWith(d.weekday) && !m.id.startsWith('sun')) throw new Error(`Dag ${d.day}: ${m.id} hör inte till ${d.weekday}`);
  (usage[m.id] ||= new Set()).add(d.day);
}

// Variation: samma dag ska inte upprepa mellanmål eller frukt
const variation = [];
for (const d of DAYS) {
  const ids = (k) => mealsById[d.meals[k]].ingredients.map((i) => i.id);
  if (ids('snack1').some((id) => ids('breakfast').includes(id))) variation.push(`Dag ${d.day}: förmiddagsfrukten finns redan i frukosten`);
  if (JSON.stringify(ids('snack2')) === JSON.stringify(ids('snack3'))) variation.push(`Dag ${d.day}: eftermiddags- och kvällsmål är identiska`);
}
if (variation.length) { console.error('Variationsfel:\n' + variation.join('\n')); process.exit(1); }

const hidden = [];
for (const m of MEALS) {
  for (const [re, id] of [[/ankfett/i, 'ankfett'], [/olivolja|olja\b/i, 'olivolja'], [/kokosfett/i, 'kokosfett'], [/smör/i, 'smör'], [/buljong/i, 'buljong']]) {
    if (re.test(m.method) && !m.ingredients.some((i) => i.id === id)) hidden.push(`${m.id}: metoden nämner ${id} som inte är ingrediens`);
  }
}
if (hidden.length) { console.error('Dolda ingredienser:\n' + hidden.join('\n')); process.exit(1); }

// Datum: varje dags datum ska ha samma veckodag som planens veckodag
const WD_UTC = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
for (const d of DAYS) {
  if (WD_UTC[new Date(d.date + 'T00:00:00Z').getUTCDay()] !== d.weekday) { console.error(`Dag ${d.day}: ${d.date} är inte ${d.weekday}`); process.exit(1); }
}
if (MEALS.some((m) => expandIngredients(m).some((i) => i.id === 'kallfrane') || /källfräne/i.test(m.method + m.title))) {
  console.error('Källfräne finns kvar i planen'); process.exit(1);
}

const GAP_PREFIX = 'Ingen gemensam huvudkomponent';
const results = DAYS.map((d) => validateDay(d, mealsById, byId));
const unexpected = [];
for (const r of results) {
  if (r.pass) continue;
  const fails = r.meals.flatMap((m) => [
    ...(m.ingredients || []).filter((i) => !i.ok).map((i) => `ingrediens ${i.id} (${i.reason})`),
    ...(m.structure || []).filter((s) => !s.ok).map((s) => s.text),
  ]).concat(r.checks.filter((c) => !c.ok).map((c) => c.text));
  const onlyGap = fails.every((t) => t.startsWith(GAP_PREFIX) || t.startsWith('Huvudkomponent passar inte'));
  const ingredientFail = r.meals.some((m) => m.ingredients && !m.ingredientsPass);
  r.failReasons = [...new Set(fails)];
  r.blockedBySource = onlyGap && !ingredientFail;
  if (!r.blockedBySource) unexpected.push(`Dag ${r.day}: ${r.failReasons.join('; ')}`);
}
if (unexpected.length) {
  console.error('Oväntade valideringsfel:\n' + unexpected.join('\n'));
  process.exit(1);
}

// Dokumenterade luckor (komponenter i kostschemana som inte kan verifieras för båda)
const gaps = [
];

const decisions = [
  { id: 'olja', title: 'Ingen olja till salladerna',
    text: 'Patrik: "1 msk olivolja till sallad". Linn: "1 matsked oliv till sallad" (olivolja står inte, ej verifierad för Linn). Salladerna får pressad citron + salt som dressing.',
    resolution: 'Användarbeslut 2026-10-02: "nej lägg inte till" – olivolja läggs inte till.' },
  { id: 'fett', title: 'Stekfett: ankfett',
    text: 'Linns kostschema: kokosfett för stekning. Patriks: ankfett. Patrik har måttlig reaktion på kokosnöt; Linn har mild reaktion på anka. Ankfett valdes eftersom reaktionen på basråvaran är lägre.',
    resolution: 'Användarbeslut 2026-10-02: "välj kokosfett eller ankfett som fettkälla" → ankfett.' },
  { id: 'knackebrod', title: 'Knäckebröd utesluts ur Re:store',
    text: 'Båda kostschemana har "+ 1 st knäckebröd", men inget knäckebröd är verifierat för båda (Linn: majskakor; Patrik: sort ej angiven).',
    resolution: 'Användarbeslut 2026-10-02: "skit i knäckbröd".' },
  { id: 'sondag', title: 'Söndag (dag 7, 14, 21): hjortkött godkänt för Linns söndagsregel',
    text: 'Linns kostschema anger kalvkött / fläskkött (mild reaktion hos Patrik). Patriks anger anka / hjortkött (mild reaktion på anka hos Linn). Hjortkött är grönt i båda ALCAT-rapporterna.',
    resolution: 'Användarbeslut 2026-10-02: "godkänns hjortkött för söndag".' },
  { id: 'manuka', title: 'Manukahonung räknas inte som honung',
    text: 'Patriks kostschema har manuka honung i frukosten; ALCAT:s Candida-ruta säger att honung ska elimineras.',
    resolution: 'Användarbeslut 2026-10-02: "Manukahonung är ok. det ska inte räknas som honung."' },
];

const out = {
  startDate: START_DATE,
  slots: SLOTS,
  dayRules: Object.fromEntries(Object.entries(DAY_RULES).map(([k, r]) => [k, { ...r, label: WEEKDAY_LABEL[k], sharedBase: sharedBase(k, byId) }])),
  meals: MEALS.map((m) => ({ ...m, usedOnDays: [...(usage[m.id] || [])].sort((a, b) => a - b) })),
  drinks: DAILY_DRINKS,
  days: DAYS.map((d, i) => ({ ...d, validation: results[i] })),
  gaps,
  decisions,
  summary: {
    pass: results.filter((r) => r.pass).length,
    total: results.length,
    blocked: results.filter((r) => !r.pass).map((r) => r.day),
  },
};
fs.writeFileSync(path.join(ROOT, 'src/data/restore.json'), JSON.stringify(out, null, 1) + '\n');
for (const r of results) console.log(`DAY ${String(r.day).padStart(2)} ${WEEKDAY_LABEL[r.weekday].padEnd(8)} ${r.pass ? 'PASS' : 'FAIL'}${r.pass ? '' : ' – ' + r.failReasons.join('; ')}`);
console.log(`\n21-DAY VALIDATION: ${out.summary.pass}/${out.summary.total} PASS`);

// ---------------------------------------------------------------------------
// PUBLIC PRODUCT DATA – Re:store by Sanna
// Allt som renderas i den publika Re:store-vyn kommer härifrån. Inga källprofiler, namn,
// individuella statusar eller källdokument. Den interna datan ovan är oförändrad.
const PUBLIC_REASON = {
  ALLOWED_FOR_BOTH: 'Verifierad mot Re:store-underlaget och tillåten under dag 1–21.',
  NOT_ALLOWED_FOR_BOTH: 'Ingår inte i Re:store under dag 1–21.',
  UNVERIFIED: 'Underlaget räcker inte för att verifiera livsmedlet. Re:store gissar inte.',
  DATA_CONFLICT: 'Underlaget innehåller motstridiga uppgifter. Livsmedlet används inte förrän det är utrett.',
};
const PUBLIC_DAY = {
  mon: { theme: 'Spannmål / stärkelse', text: 'Ugnsbakade, kokta, grillade eller ångade grönsaker + färsk sallad + ris' },
  tue: { theme: 'Soppa', text: 'Grönsakssoppa eller fisksoppa – utan potatis och mejeriprodukter – med färsk sallad' },
  wed: { theme: 'Vitt kött', text: 'Ugnsbakade, kokta, grillade eller ångade grönsaker + färsk sallad + kyckling eller kalkon' },
  thu: { theme: 'Baljväxter', text: 'Färsk sallad + baljväxter' },
  fri: { theme: 'Vegetariskt', text: 'Grönsaksgryta + färsk sallad' },
  sat: { theme: 'Fisk', text: 'Ugnsbakade, kokta, grillade eller ångade grönsaker + färsk sallad + fisk' },
  sun: { theme: 'Rött kött', text: 'Ugnsbakade, kokta, grillade eller ångade grönsaker + färsk sallad + rött kött' },
};
const PUBLIC_SLOT_TEXT = {
  breakfast: 'Fruktsallad med 1 tsk tahini', snack1: 'Frukt', lunch: 'Dagens rätt enligt veckostrukturen',
  snack2: 'Grönsaker', dinner: 'Samma rätt som till lunch', snack3: 'Grönsaker',
};
const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const window_ = (a, b) => (toMin(a) <= toMin(b) ? `${a}–${b}` : `${b}–${a}`);

const usedMeals = out.meals.filter((m) => m.usedOnDays.length);
const usage2 = {};
for (const d of out.days) for (const s of SLOTS) {
  for (const i of expandIngredients(mealsById[d.meals[s.key]])) ((usage2[i.id] ||= {})[s.key] ||= new Set()).add(d.day);
}
const pub = {
  startDate: START_DATE,
  slots: SLOTS.map((s) => ({ key: s.key, label: s.label, time: window_(s.linn, s.patrik), text: PUBLIC_SLOT_TEXT[s.key] })),
  structure: Object.fromEntries(Object.entries(PUBLIC_DAY).map(([k, v]) => [k, { ...v, label: WEEKDAY_LABEL[k] }])),
  rules: [
    'Ät var tredje timme och hoppa inte över måltider.',
    'Lunch och middag är samma rätt.',
    'Restaurangportioner. Behöver du mer – ät lite mer till lunch eller middag, aldrig senare.',
    'Stekfett: ankfett. Maten ugnsbakas, kokas, grillas, steks eller ångas. Pressad citron och salt som dressing.',
    'Endast keltiskt salt eller havssalt.',
    '10–12 glas vatten om dagen. Örtte på färsk grönmynta som dryck.',
    'Inga mejeriprodukter, ingen jäst, inget socker, inga fermenterade produkter, ingen vinäger, inget vin eller öl.',
  ],
  foods: foods.map((f) => ({
    id: f.id, name: f.displayName, normalizedName: f.normalizedName, aliases: f.aliases, category: f.category,
    status: f.restoreStatus, reason: PUBLIC_REASON[f.restoreStatus],
    use: f.restoreStatus === 'ALLOWED_FOR_BOTH' && usage2[f.id]
      ? Object.entries(usage2[f.id]).map(([slot, days]) => ({ slot, days: [...days].sort((a, b) => a - b) }))
      : [],
  })),
  meals: usedMeals.map((m) => ({
    id: m.id, title: m.title.replace(/^FÖRSLAG: /, ''), method: m.method, slot: m.slot, usedOnDays: m.usedOnDays,
    ingredients: m.ingredients.map((i) => ({ id: i.id, role: i.role, note: i.note || null, alt: i.alt || [] })),
    status: m.proposal ? 'UNDER_REVIEW' : 'VALIDATED',
  })),
  days: out.days.map((d) => ({
    day: d.day, week: d.week, weekday: d.weekday, date: d.date, meals: d.meals,
    drinks: d.drinks.map((x) => x.title),
    status: d.validation.pass ? 'VALIDATED' : 'UNDER_REVIEW',
  })),
};
// Meal-status måste spegla den interna valideringen exakt
for (const m of pub.meals) {
  const days = out.days.filter((d) => Object.values(d.meals).includes(m.id));
  const allPass = days.every((d) => d.validation.meals.filter((x) => x.mealId === m.id).every((x) => x.pass));
  if ((m.status === 'VALIDATED') !== allPass) throw new Error(`Publik status för ${m.id} matchar inte valideringen`);
}
const PRIVATE = /linn|patrik|\bgrant\b|\brees\b|båda|profil|gemensam/i;
const pubStr = JSON.stringify(pub);
const leak = pubStr.match(PRIVATE);
if (leak) { console.error(`Privat information i publik Re:store-data: "${leak[0]}" … ${pubStr.slice(Math.max(0, leak.index - 60), leak.index + 60)}`); process.exit(1); }
fs.writeFileSync(path.join(ROOT, 'src/data/restore-public.json'), JSON.stringify(pub, null, 1) + '\n');
console.log(`Publik Re:store-data: ${pub.foods.length} livsmedel, ${pub.meals.length} måltider, ${pub.days.length} dagar – inga privata fält.`);
