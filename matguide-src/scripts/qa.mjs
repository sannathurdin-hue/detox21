// Automatisk QA av masterdatabasen. Avbryter bygget (exit 1) vid fel.
// Skriver QA-RAPPORT.md med resultat, antal och listan över osäkerheter.
//
// Valfritt: ALCAT_TXT_DIR=<katalog med pdftotext -layout av sida 1, linn_p1.txt / pat_p1.txt>
// för att även kontrollera transkriberingen mot originalens text.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALCAT } from '../data/alcat.mjs';
import { PLANS } from '../data/plans.mjs';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const foods = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/foods.json'), 'utf8'));
const PEOPLE = ['linn', 'patrik'];
const FINAL = ['ALLOWED', 'AVOID', 'RESTRICTED', 'UNVERIFIED', 'DATA_CONFLICT'];

const results = [];
let failed = 0;
function check(name, ok, detail = '') {
  results.push({ name, ok, detail });
  if (!ok) failed++;
}

const levelOf = (who, name) => {
  const a = ALCAT[who];
  const lv = [];
  if (a.severe.includes(name)) lv.push('SEVERE');
  if (a.moderate.includes(name)) lv.push('MODERATE');
  if (a.mild.includes(name)) lv.push('MILD');
  if (Object.values(a.none).flat().includes(name)) lv.push('NONE');
  return lv;
};

// 1–2. Varje livsmedel mot respektive originaltranskribering
for (const who of PEOPLE) {
  const bad = [];
  for (const f of foods) {
    if (!f.alcatName) continue;
    const lv = levelOf(who, f.alcatName);
    const st = f[who].alcatStatus;
    const elim = Object.values(ALCAT[who].eliminate).flat().includes(f.alcatName);
    const expected = elim ? 'ELIMINATE' : lv.length === 0 ? 'NOT_TESTED' : lv.length > 1 ? 'CONFLICT' : lv[0];
    if (st !== expected) bad.push(`${f.displayName}: ${st} ≠ ${expected}`);
  }
  // alla ALCAT-poster finns i databasen
  const all = [...ALCAT[who].severe, ...ALCAT[who].moderate, ...ALCAT[who].mild, ...Object.values(ALCAT[who].none).flat()];
  const missing = [...new Set(all)].filter((n) => !foods.some((f) => f.alcatName === n));
  check(`${who}: ALCAT-status för varje livsmedel stämmer mot originaltranskriberingen`, bad.length === 0 && missing.length === 0, [...bad, ...missing.map((m) => `saknas: ${m}`)].join('; '));
}

// Valfri kontroll mot originalens PDF-text
const txtDir = process.env.ALCAT_TXT_DIR;
if (txtDir && fs.existsSync(txtDir)) {
  const HEAD = new Set(['ALLVARLIG', 'MÅTTLIG', 'MILD*', 'ACCEPTABEL/ INGEN REAKTION', 'VEGETABLES / LEGUMES', 'FRUKTER', 'KÖTT', 'MEJERIPRODUKTER/ÄGG', 'SKALDJUR', 'KORN/STÄRKELSER', 'ÖRTER/KRYDDOR', 'NÖTTER/OLJOR/BLANDAT MAT']);
  const FIX = { 'TRÄDGÅRDSCHAMPINJ': 'TRÄDGÅRDSCHAMPINJON', 'BOSTON BIBB-SALLA': 'BOSTON BIBB-SALLAD' };
  for (const [who, file] of [['linn', 'linn_p1.txt'], ['patrik', 'pat_p1.txt']]) {
    const lines = fs.readFileSync(path.join(txtDir, file), 'utf8').split('\n');
    const hdr = lines.find((l) => l.startsWith('ALLVARLIG'));
    const pM = hdr.indexOf('MÅTTLIG'), pY = hdr.indexOf('MILD*'), pG = hdr.indexOf('ACCEPTABEL');
    const s = lines.indexOf(hdr) + 1, e = lines.findIndex((l) => l.includes('CANDIDA ALBICANS'));
    const cols = { severe: [], moderate: [], mild: [], none: [] };
    for (const l of lines.slice(s, e)) for (const m of l.matchAll(/\S+(?: \S+)*/g)) {
      if (HEAD.has(m[0])) continue;
      let t = m[0].replace(/\*$/, ''); t = FIX[t] || t;
      const c = m.index < pM - 2 ? 'severe' : m.index < pY - 2 ? 'moderate' : m.index < pG - 6 ? 'mild' : 'none';
      cols[c].push(t);
    }
    const a = ALCAT[who];
    const same = (x, y) => JSON.stringify([...x].sort()) === JSON.stringify([...y].sort());
    check(`${who}: transkribering identisk med PDF-texten (alla nivåkolumner)`,
      same(cols.severe, a.severe) && same(cols.moderate, a.moderate) && same(cols.mild, a.mild) && same(cols.none, Object.values(a.none).flat()));
  }
}

// 3. ALCAT-status och slutstatus är separata fält
check('ALCAT-status och slutstatus dag 1–21 är separata fält med giltiga värden',
  foods.every((f) => PEOPLE.every((p) => FINAL.includes(f[p].finalStatusDay1To21) && typeof f[p].alcatStatus === 'string' && f[p].alcatStatus !== f[p].finalStatusDay1To21)));
// ALCAT grön får aldrig automatiskt bli tillåten när kostschemat förbjuder
const overrides = foods.filter((f) => PEOPLE.some((p) => f[p].alcatStatus === 'NONE' && f[p].dietPlanStatusDay1To21 === 'FORBIDDEN'));
check('4. Kostschema-förbud överstyr grön ALCAT (t.ex. jäst, vindruva)',
  overrides.length > 0 && overrides.every((f) => PEOPLE.every((p) => !(f[p].alcatStatus === 'NONE' && f[p].dietPlanStatusDay1To21 === 'FORBIDDEN') || f[p].finalStatusDay1To21 === 'AVOID')),
  overrides.map((f) => f.displayName).join(', '));
const bakjast = foods.find((f) => f.alcatName === 'BAKJÄST');
check('4b. Bakjäst: grön i Linns ALCAT men INTE tillåten dag 1–21',
  bakjast.linn.alcatStatus === 'NONE' && bakjast.linn.finalStatusDay1To21 === 'AVOID');
const druva = foods.find((f) => f.alcatName === 'VINDRUVA');
check('4c. Vindruva: grön i Patriks ALCAT men INTE tillåten dag 1–21', druva.patrik.alcatStatus === 'NONE' && druva.patrik.finalStatusDay1To21 === 'AVOID');

// 5. Inga förbjudna livsmedel under "Båda kan äta"
const both = foods.filter((f) => f.comparisonStatus === 'BOTH_ALLOWED');
check('5. "Båda kan äta" innehåller endast livsmedel där båda har slutstatus ALLOWED',
  both.every((f) => f.linn.finalStatusDay1To21 === 'ALLOWED' && f.patrik.finalStatusDay1To21 === 'ALLOWED'));
check('5b. Inget livsmedel med ALCAT-reaktion/eliminering hos någon ligger under "Båda kan äta"',
  both.every((f) => PEOPLE.every((p) => !['SEVERE', 'MODERATE', 'MILD', 'ELIMINATE', 'CONFLICT'].includes(f[p].alcatStatus))));
check('5c. Omvänt: alla med ALLOWED för båda ligger under "Båda kan äta"',
  foods.filter((f) => f.linn.finalStatusDay1To21 === 'ALLOWED' && f.patrik.finalStatusDay1To21 === 'ALLOWED').every((f) => f.comparisonStatus === 'BOTH_ALLOWED'));

// 6. Ej testade livsmedel klassas inte automatiskt som tillåtna
const notTestedAllowed = foods.filter((f) => PEOPLE.some((p) => ['NOT_TESTED', 'DERIVED'].includes(f[p].alcatStatus) && f[p].finalStatusDay1To21 === 'ALLOWED'
  && !f[p].sources.some((s) => s.kind === 'KOSTSCHEMA' || s.kind === 'ANVÄNDARBESLUT')));
check('6. Ej testade/härledda livsmedel är tillåtna endast med uttryckligt stöd i kostschema/användarbeslut', notTestedAllowed.length === 0, notTestedAllowed.map((f) => f.displayName).join(', '));
const notTestedOnlyOneSide = foods.filter((f) => f.alcatName && PEOPLE.some((p) => f[p].alcatStatus === 'NOT_TESTED' && f[p].finalStatusDay1To21 !== 'UNVERIFIED'));
check('6b. ALCAT-poster som bara finns i den ena panelen är "Ej verifierat" för den andra', notTestedOnlyOneSide.every((f) => PEOPLE.every((p) => f[p].alcatStatus !== 'NOT_TESTED' || f[p].dietPlanStatusDay1To21 !== 'NO_RULE')), notTestedOnlyOneSide.map((f) => f.displayName).join(', '));

// 7. Unika id:n och ett livsmedel per normaliserat namn
const ids = foods.map((f) => f.id);
check('7. Unika id:n – inget livsmedel förekommer två gånger', new Set(ids).size === ids.length);
const norm = foods.map((f) => f.normalizedName);
check('7b. Unika normaliserade namn', new Set(norm).size === norm.length);

// 11. Spårbar källa för varje status
const noSource = foods.filter((f) => PEOPLE.some((p) => !f[p].sources.length && f[p].finalStatusDay1To21 !== 'UNVERIFIED'));
check('11. Varje fastställd status (ej "Ej verifierat") har minst en källa', noSource.length === 0, noSource.map((f) => f.displayName).join(', '));
check('11b. Varje källa har dokument och text', foods.every((f) => PEOPLE.every((p) => f[p].sources.every((s) => s.document && s.text))));
check('11c. Tillåtna livsmedel har ett "tillåten"-skäl, undvikna har ett "undvik"-skäl',
  foods.every((f) => PEOPLE.every((p) => (f[p].finalStatusDay1To21 !== 'ALLOWED' || f[p].reasons.some((r) => r.type === 'allow'))
    && (f[p].finalStatusDay1To21 !== 'AVOID' || f[p].reasons.some((r) => r.type === 'avoid')))));

// 12. CNA/CMA används inte
const raw = fs.readFileSync(path.join(ROOT, 'src/data/foods.json'), 'utf8') + fs.readFileSync(path.join(ROOT, 'src/data/meta.json'), 'utf8');
check('12. Ingen CNA/CMA-information används som livsmedelsklassificering', !/\bCNA\b|\bCMA\b/.test(raw));
check('12b. Blå markörer (Candida, gluten, kasein …) är inte egna livsmedel', !foods.some((f) => ['CANDIDA ALBICANS', 'GLUTEN', 'GLIADIN', 'KASEIN', 'VASSLE', 'LAKTOS'].includes(f.alcatName)));

// 13. Tidsbegränsade restriktioner gäller dag 1–21 (alla ≥ 120 dagar)
const durationsOk = foods.every((f) => PEOPLE.every((p) => f[p].finalStatusDay1To21 !== 'AVOID' || f[p].restrictionDuration));
check('13. Varje "Undvik" har en angiven varaktighet (alla källregler ≥ 3 mån/120 dagar > 21 dagar)', durationsOk);

// Konflikter
const conflicts = foods.filter((f) => f.comparisonStatus === 'DATA_CONFLICT');
check('Datakonflikter markeras och hamnar aldrig under "Båda kan äta"', conflicts.every((f) => PEOPLE.some((p) => f[p].finalStatusDay1To21 === 'DATA_CONFLICT')));

// ---------------------------------------------------------------------------
// Re:store by Sanna
const restorePath = path.join(ROOT, 'src/data/restore.json');
const restore = fs.existsSync(restorePath) ? JSON.parse(fs.readFileSync(restorePath, 'utf8')) : null;
const metaJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/meta.json'), 'utf8'));
check('R1. Re:store ALLOWED_FOR_BOTH ⇔ Linn ALLOWED och Patrik ALLOWED (inga undantag)',
  foods.every((f) => (f.restoreStatus === 'ALLOWED_FOR_BOTH') === (f.linn.finalStatusDay1To21 === 'ALLOWED' && f.patrik.finalStatusDay1To21 === 'ALLOWED')));
check('R2. Datakonflikt/ej verifierat hamnar aldrig i Re:store',
  foods.filter((f) => PEOPLE.some((p) => ['DATA_CONFLICT', 'UNVERIFIED', 'RESTRICTED', 'AVOID'].includes(f[p].finalStatusDay1To21))).every((f) => f.restoreStatus !== 'ALLOWED_FOR_BOTH'));
check('R3. Varje öppen datakonflikt har person, källa A och källa B',
  metaJson.conflicts.length === foods.reduce((n, f) => n + PEOPLE.filter((p) => f[p].finalStatusDay1To21 === 'DATA_CONFLICT').length, 0)
  && metaJson.conflicts.every((c) => c.person && c.sourceA && c.sourceB && c.sourceA.says && c.sourceB.says));
let dayRows = [];
if (restore) {
  const byId = Object.fromEntries(foods.map((f) => [f.id, f]));
  const usedMeals = restore.meals.filter((m) => m.usedOnDays.length);
  const badIng = usedMeals.flatMap((m) => m.ingredients.filter((i) => byId[i.id]?.restoreStatus !== 'ALLOWED_FOR_BOTH').map((i) => `${m.id}: ${i.id}`));
  check('R4. Varje ingrediens i varje måltid i 21-dagarsplanen är tillåten för båda', badIng.length === 0, badIng.join(', '));
  const drinkBad = restore.days.flatMap((d) => d.drinks.flatMap((x) => x.ingredients)).filter((id) => byId[id]?.restoreStatus !== 'ALLOWED_FOR_BOTH');
  check('R5. Dryck i planen är tillåten för båda', drinkBad.length === 0, drinkBad.join(', '));
  check('R6. Planen har exakt 21 dagar, 6 måltider per dag, lunch = middag',
    restore.days.length === 21 && restore.days.every((d) => Object.keys(d.meals).length === 6 && d.meals.lunch === d.meals.dinner));
  const failed = restore.days.filter((d) => !d.validation.pass);
  check('R7. Dagar som fallerar gör det ENDAST p.g.a. dokumenterad lucka i källmaterialet', failed.every((d) => d.validation.blockedBySource),
    failed.filter((d) => !d.validation.blockedBySource).map((d) => d.day).join(', '));
  dayRows = restore.days.map((d) => `| Dag ${d.day} | ${d.weekday} | ${d.validation.pass ? 'PASS' : 'FAIL'} | ${d.validation.pass ? '' : (d.validation.failReasons || []).join('; ')} |`);
}

const count = (s) => foods.filter((f) => f.comparisonStatus === s).length;
const personCount = (p, s) => foods.filter((f) => f[p].finalStatusDay1To21 === s).length;
const L = ALCAT.linn, P = ALCAT.patrik;
const printed = (a) => [...a.severe, ...a.moderate, ...a.mild, ...Object.values(a.none).flat()].length;

const ambiguous = [
  ['Endiv (båda)', 'ENDIV står både under MILD* och under ACCEPTABEL/INGEN REAKTION i båda rapporterna (och två gånger samma rotationsdag). Troligen två panelposter med samma svenska översättning. → Datakonflikt – kräver kontroll.'],
  ['Havsabborre (Linn)', 'HAVSABBORRE står både under MÅTTLIG och under SKALDJUR/ACCEPTABEL i Linns rapport. → Datakonflikt för Linn. (Patrik: två gånger, båda gröna → tillåten.)'],
  ['Koriander, Mussla', 'Förekommer två gånger med samma nivå (Linn: båda gröna; Patrik: koriander båda måttlig, mussla båda gröna). Ingen konflikt, men det är två panelposter med samma namn.'],
  ['Mild (gul*) reaktion', 'Rapporten säger: undvik 3 månader, alternativt rotation var 4:e dag. Eftersom kostschemana bygger på "Gröna listan" räknas mild som "Undvik" dag 1–21. Kontrollera om det stämmer med behandlande klinik.'],
  ['Olivolja (Linn)', 'Linns schema skriver "1 matsked oliv till sallad…" – ordet olivolja står inte. → Ej verifierat för Linn.'],
  ['Kaffe, grönt te, svart te', 'Kostschemana anger örtte som tillåten dryck/brygd. Kaffe/te nämns inte → Ej verifierat där ALCAT är grönt.'],
  ['Örtte', 'Tillåtet enligt båda kostschemana, men örten måste själv vara tillåten (t.ex. kamomill: Linn måttlig, Patrik mild). → Villkorat.'],
  ['Knäckebröd', 'Linn: endast majskakor anges. Patrik: sort anges inte. → Inte gemensamt verifierat.'],
  ['Manukahonung', 'Användarbeslut 2026-10-02: "Manukahonung är ok. det ska inte räknas som honung." Tillåten för båda på den grunden (Linns kostschema nämner inte manukahonung). ALCAT:s "HONUNG" (Candida-rutan) gäller fortsatt vanlig honung.'],
  ['Nöt', '"NÖT" tolkas som nötkött (står under PROTEIN i rotationsschemat).'],
  ['Vit potatis (Linn)', 'Grön i ALCAT. Schemat säger "potatisfri" endast för tisdagssoppan. Tillåten.'],
  ['Kokosfett, ankfett, valnötssmör, majskakor, linspasta', 'Tillåtna endast för den person vars kostschema uttryckligen nämner dem. För den andra: Ej verifierat.'],
  ['Item Count 250', `Rapporterna anger "Item Count: 250" men sida 1 visar ${printed(L)} (Linn) resp. ${printed(P)} (Patrik) livsmedelsrader plus blå rutor. Övriga panelposter syns inte i underlaget.`],
  ['Panelskillnader', 'Linn är testad för Dragon fruit och Yellow pea; Patrik för Allulose, Habanero pepper, Jackfruit, Poppy seed och Red palm fruit. Ej testat hos den andra → Ej verifierat.'],
];

const md = `# QA-rapport – Matguide Linn + Patrik, dag 1–21

Genererad automatiskt av \`scripts/qa.mjs\` från \`src/data/foods.json\`.

## Källor
- ${L.document} – ALCAT, provdatum ${L.meta.provdatum}, Lab ID ${L.meta.labId}
- ${PLANS.linn.document} – kostschema / Gröna listan
- ${P.document} – ALCAT, provdatum ${P.meta.provdatum}, Lab ID ${P.meta.labId}
- ${PLANS.patrik.document} – kostschema / Gröna listan (transkribering)
- CNA/CMA: ingår inte i underlaget och används inte.

## Antal (beräknat från databasen)
| | Antal |
|---|---|
| A. Unika livsmedel i databasen | ${foods.length} |
| B. Båda kan äta (verifierat) | ${count('BOTH_ALLOWED')} |
| C. Endast Linn | ${count('LINN_ONLY')} |
| D. Endast Patrik | ${count('PATRIK_ONLY')} |
| E. Båda undviker | ${count('BOTH_AVOID')} |
| F. Ej verifierade | ${count('UNVERIFIED')} |
| G. Datakonflikter | ${count('DATA_CONFLICT')} |
| Villkorat (restriktion för båda) | ${count('DIFFERENT_RESTRICTION')} |

Per person (slutstatus dag 1–21):

| | Tillåten | Undvik | Villkorad | Ej verifierad | Datakonflikt |
|---|---|---|---|---|---|
${['linn', 'patrik'].map((p) => `| ${p === 'linn' ? 'Linn' : 'Patrik'} | ${personCount(p, 'ALLOWED')} | ${personCount(p, 'AVOID')} | ${personCount(p, 'RESTRICTED')} | ${personCount(p, 'UNVERIFIED')} | ${personCount(p, 'DATA_CONFLICT')} |`).join('\n')}

## Re:store by Sanna
| | Antal |
|---|---|
| RE:STORE FOODS VERIFIED FOR BOTH | ${foods.filter((f) => f.restoreStatus === 'ALLOWED_FOR_BOTH').length} |
| LINN ONLY | ${count('LINN_ONLY')} |
| PATRIK ONLY | ${count('PATRIK_ONLY')} |
| NOT INCLUDED (ej tillåtet för båda) | ${foods.filter((f) => f.restoreStatus === 'NOT_ALLOWED_FOR_BOTH').length} |
| UNVERIFIED | ${foods.filter((f) => f.restoreStatus === 'UNVERIFIED').length} |
| DATA CONFLICTS (livsmedel) | ${foods.filter((f) => f.restoreStatus === 'DATA_CONFLICT').length} |
| 21-DAY PLAN | ${restore ? `${restore.summary.pass} / ${restore.summary.total} DAYS PASS` : '–'} |

| Dag | Veckodag | Resultat | Orsak |
|---|---|---|---|
${dayRows.join('\n')}

${restore ? restore.gaps.map((g) => `- **${g.title}:** ${g.text} *Beslut som löser det:* ${g.decision}`).join('\n') : ''}

## Automatiska kontroller
${results.map((r) => `- ${r.ok ? '✅' : '❌'} ${r.name}${r.detail ? ` — ${r.detail}` : ''}`).join('\n')}

## Datakonflikter
${metaJson.conflicts.map((c) => `- **${c.food} (${c.person === 'linn' ? 'Linn' : 'Patrik'})** – Källa A: ${c.sourceA.document} s. ${c.sourceA.page}, ${c.sourceA.text} → *${c.sourceA.says}*. Källa B: ${c.sourceB.document} s. ${c.sourceB.page}, ${c.sourceB.text} → *${c.sourceB.says}*.`).join('\n')}
${metaJson.resolvedConflicts.map((c) => `- **${c.food} (${c.person === 'linn' ? 'Linn' : 'Patrik'}) – LÖST:** Källa A: ${c.sourceA.text} → *${c.sourceA.says}*. Källa B: ${c.sourceB.text} → *${c.sourceB.says}*. ${c.resolution}`).join('\n')}

## Tvetydigheter och tolkningsbeslut
${ambiguous.map(([a, b]) => `- **${a}:** ${b}`).join('\n')}
`;

fs.writeFileSync(path.join(ROOT, 'QA-RAPPORT.md'), md);
for (const r of results) console.log(`${r.ok ? 'OK  ' : 'FAIL'} ${r.name}${!r.ok && r.detail ? ` — ${r.detail}` : ''}`);
console.log(failed ? `\n${failed} QA-kontroll(er) misslyckades` : '\nAlla QA-kontroller godkända');
process.exit(failed ? 1 : 0);
