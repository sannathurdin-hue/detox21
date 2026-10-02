// Re:store by Sanna – bygger och validerar 21-dagarsplanen → src/data/restore.json
// Varje ingrediens: Linn ALLOWED + Patrik ALLOWED (TEST A). Varje måltid: dagens gemensamma struktur (TEST B).
// Bygget avbryts om en dag fallerar av något annat skäl än en dokumenterad lucka i källmaterialet.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MEALS, DAYS, DAILY_DRINKS } from '../data/restore-plan.mjs';
import { SLOTS, DAY_RULES, WEEKDAY_LABEL, validateDay, sharedBase } from '../src/lib/restoreRules.js';

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
  {
    id: 'knackebrod', title: 'Knäckebröd utelämnat',
    affects: 'Frukost varje dag samt lunch/middag tisdag, torsdag och fredag',
    text: 'Båda scheman har "+ 1 st knäckebröd". Linn: endast majskakor anges. Patrik: sort anges inte, och majskakor är ej verifierade för honom. Inget gemensamt verifierat knäckebröd finns, så det ingår inte i planen.',
    decision: 'Om ni godkänner majskakor (100 % majs) för Patrik kan de läggas till.',
  },
  {
    id: 'olja', title: 'Olja till sallad och stekfett utelämnat',
    affects: 'Lunch och middag',
    text: 'Patrik: "1 msk olivolja till sallad". Linn: "1 matsked oliv till sallad" (olivolja står inte). Stekfett: Linn kokosfett, Patrik ankfett. Inget av dessa är verifierat för båda. Planen tillagar därför utan fett (ugn, kokt, grillat, ångat) och använder pressad citron + salt som dressing.',
    decision: 'Om ni bekräftar att Linns "oliv" betyder olivolja blir olivolja tillåten för båda.',
  },
  {
    id: 'sondag', title: 'Söndag (dag 7, 14, 21): inget gemensamt rött kött',
    affects: 'Lunch och middag dag 7, 14 och 21',
    text: `Linns söndagsregel: kalvkött / fläskkött (Patrik: mild reaktion på båda). Patriks: anka / hjortkött (Linn: mild reaktion på anka). Hjortkött är tillåtet för båda enligt ALCAT, men står inte i Linns söndagsregel. Söndagen kan därför inte valideras mot båda strukturerna.`,
    decision: 'Godkänn hjortkött som Linns söndagskött, så valideras förslaget för dag 7, 14 och 21.',
  },
];

const out = {
  slots: SLOTS,
  dayRules: Object.fromEntries(Object.entries(DAY_RULES).map(([k, r]) => [k, { ...r, label: WEEKDAY_LABEL[k], sharedBase: sharedBase(k, byId) }])),
  meals: MEALS.map((m) => ({ ...m, usedOnDays: [...(usage[m.id] || [])].sort((a, b) => a - b) })),
  drinks: DAILY_DRINKS,
  days: DAYS.map((d, i) => ({ ...d, validation: results[i] })),
  gaps,
  summary: {
    pass: results.filter((r) => r.pass).length,
    total: results.length,
    blocked: results.filter((r) => !r.pass).map((r) => r.day),
  },
};
fs.writeFileSync(path.join(ROOT, 'src/data/restore.json'), JSON.stringify(out, null, 1) + '\n');
for (const r of results) console.log(`DAY ${String(r.day).padStart(2)} ${WEEKDAY_LABEL[r.weekday].padEnd(8)} ${r.pass ? 'PASS' : 'FAIL'}${r.pass ? '' : ' – ' + r.failReasons.join('; ')}`);
console.log(`\n21-DAY VALIDATION: ${out.summary.pass}/${out.summary.total} PASS`);
