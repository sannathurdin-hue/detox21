// Re:store by Sanna – 21-dagarsplan för Linn + Patrik.
// Varje ingrediens är ett id i databasen (src/data/foods.json) och valideras i scripts/build-restore.mjs.
// Inga dolda ingredienser: vatten, salt, citron, örter och kryddor står alltid uttryckligen.
// Stekfett: ankfett (användarbeslut 2026-10-02: "välj kokosfett eller ankfett som fettkälla";
// ankfett valt eftersom ALCAT-reaktionen på basråvaran är lägre – anka mild hos Linn, kokosnöt måttlig hos Patrik).
// Salladsolja: ingen (olivolja ej verifierad för Linn) – pressad citron + salt som dressing.
// Knäckebröd: utesluts (användarbeslut 2026-10-02: "skit i knäckbröd").
//
// Dag 1 = måndag. Kostschemana bygger på en återkommande veckocykel (måndag–söndag), som upprepas i tre veckor.

const I = (id, role, note) => ({ id, role, ...(note ? { note } : {}) });

// Startdatum: dag 1 = måndag 5 oktober 2026 (användarens önskemål: "den ska börja på måndag")
export const START_DATE = '2026-10-05';

// ---------------------------------------------------------------------------
// Frukost: fruktsallad + 1 tsk tahini
const breakfast = (id, title, fruits) => ({
  id, slot: 'breakfast', title,
  method: `Skär frukterna i bitar och blanda till en fruktsallad. Toppa med 1 tsk tahini.`,
  ingredients: [...fruits.map((f) => I(f, 'fruit')), I('tahini-sesampasta', 'spread', '1 tsk')],
});
const fruitSnack = (id, title, fruits) => ({ id, slot: 'snack1', title, method: 'Ät som den är, skuren i bitar.', ingredients: fruits.map((f) => I(f, 'fruit')) });
const vegSnack = (id, slot, title, vegs, method = 'Skär i stavar eller bitar och ät råa.') => ({ id, slot, title, method, ingredients: vegs.map((v) => I(v, 'veg')) });

export const MEALS = [
  // Frukost (7 varianter, roterar per veckodag med förskjutning per vecka)
  breakfast('fr-mango-kiwi', 'Fruktsallad med mango, kiwi och granatäpple + tahini', ['mango', 'kiwi', 'granatapple']),
  breakfast('fr-papaya-ananas', 'Fruktsallad med papaya och ananas, pressad citron + tahini', ['papaya', 'ananas', 'citron']),
  breakfast('fr-melon-persika', 'Fruktsallad med melon och persika + tahini', ['melon', 'persika']),
  breakfast('fr-mandarin-kiwi', 'Fruktsallad med mandarin, kiwi och persimon + tahini', ['mandarin', 'kiwi', 'persimon']),
  breakfast('fr-vattenmelon-mango', 'Fruktsallad med vattenmelon och mango + tahini', ['vattenmelon', 'mango']),
  breakfast('fr-guava-papaya', 'Fruktsallad med guava, papaya och granatäpple + tahini', ['guava', 'papaya', 'granatapple']),
  breakfast('fr-ananas-mandarin', 'Fruktsallad med ananas, mandarin och kiwi + tahini', ['ananas', 'mandarin', 'kiwi']),

  // Förmiddagsmellanmål: frukt
  fruitSnack('fs-persimon', 'Persimon', ['persimon']),
  fruitSnack('fs-kiwi', 'Två kiwi', ['kiwi']),
  fruitSnack('fs-mango', 'Mango i bitar', ['mango']),
  fruitSnack('fs-mandarin', 'Mandariner', ['mandarin']),
  fruitSnack('fs-melon', 'Melon i skivor', ['melon']),
  fruitSnack('fs-persika', 'Persika', ['persika']),
  fruitSnack('fs-guava', 'Guava', ['guava']),

  // Eftermiddags- och kvällsmellanmål: grönsaker
  vegSnack('vs-tomat-squash', 'snack2', 'Tomat och sommarsquashstavar', ['tomat', 'sommarsquash']),
  vegSnack('vs-strangbona', 'snack2', 'Ångade strängbönor', ['strangbona'], 'Ånga strängbönorna 4–5 minuter. Ät ljumna eller kalla.'),
  vegSnack('vs-champinjon-tomat', 'snack2', 'Champinjoner och tomat', ['tradgardschampinjon', 'tomat']),
  vegSnack('vs-romansallad-tomat', 'snack2', 'Romansalladsblad med tomat', ['romansallad', 'tomat']),
  vegSnack('ks-squash', 'snack3', 'Sommarsquashstavar', ['sommarsquash']),
  vegSnack('ks-tomat-kallfrane', 'snack3', 'Tomat med sallad', ['tomat', 'kallfrane']),
  vegSnack('ks-strangbona', 'snack3', 'Ångade strängbönor', ['strangbona'], 'Ånga strängbönorna 4–5 minuter.'),
  vegSnack('ks-spenat-tomat', 'snack3', 'Babyspenat och tomat', ['spenat', 'tomat']),

  // ---------------------------------------------------------------------------
  // Lunch = middag
  // MÅNDAG – spannmål/stärkelse (gemensamt: ris)
  {
    id: 'mon-1', slot: 'main', title: 'Ris med ugnsbakad aubergine, sommarsquash och tomat',
    method: 'Koka riset i vatten med en nypa salt. Skär aubergine, sommarsquash och tomat i bitar, strö över oregano, timjan och salt och ugnsbaka i 200 °C ca 25 min med 1 msk smält ankfett. Sallad: romansallad och källfräne med pressad citron och en nypa salt.',
    ingredients: [I('ris', 'base'), I('vatten', 'liquid'), I('aubergine', 'cooked'), I('sommarsquash', 'cooked'), I('tomat', 'cooked'),
      I('oregano', 'seasoning'), I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('romansallad', 'salad'), I('kallfrane', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'mon-2', slot: 'main', title: 'Ris med ångad grönkål, champinjoner och schalottenlök',
    method: 'Koka riset i vatten med salt. Ånga grönkål, champinjoner och schalottenlök tills mjuka och smaka av med saffran och salt. Sallad: spenat och tomat med pressad citron.',
    ingredients: [I('ris', 'base'), I('vatten', 'liquid'), I('gronkal', 'cooked'), I('tradgardschampinjon', 'cooked'), I('schalottenlok', 'cooked'),
      I('saffran', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('spenat', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'mon-3', slot: 'main', title: 'Ris med ugnsbakad butternutpumpa, okra och tomat',
    method: 'Koka riset i vatten med salt. Ugnsbaka butternutpumpa, okra och tomat med spiskummin, chilipeppar och salt i 200 °C ca 30 min med 1 msk smält ankfett. Sallad: spenat och källfräne med pressad citron.',
    ingredients: [I('ris', 'base'), I('vatten', 'liquid'), I('butternutpumpa', 'cooked'), I('okra', 'cooked'), I('tomat', 'cooked'),
      I('spiskummin', 'seasoning'), I('chilipeppar', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('spenat', 'salad'), I('kallfrane', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },

  // TISDAG – soppa (grönsaks- eller fisksoppa, potatisfri, laktosfri)
  {
    id: 'tue-1', slot: 'main', title: 'Grönsakssoppa med butternutpumpa, tomat och grönkål',
    method: 'Koka butternutpumpa, schalottenlök och tomat i vatten med spiskummin, timjan och salt ca 20 min. Mixa slätt, rör ner strimlad grönkål och koka 3 min. Sallad: rosé-/grönsallad och spenat med pressad citron och salt.',
    ingredients: [I('butternutpumpa', 'cooked'), I('schalottenlok', 'cooked'), I('tomat', 'cooked'), I('gronkal', 'cooked'), I('vatten', 'liquid'),
      I('spiskummin', 'seasoning'), I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('rose-gronsallad', 'salad'), I('spenat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'tue-2', slot: 'main', title: 'Fisksoppa med snapper, tomat och saffran',
    method: 'Koka schalottenlök, tomat och sommarsquash i vatten med saffran och salt ca 15 min. Lägg i snapper i bitar och sjud 5–6 min tills fisken är genomkokt. Sallad: romansallad med pressad citron.',
    ingredients: [I('snapper', 'base'), I('schalottenlok', 'cooked'), I('tomat', 'cooked'), I('sommarsquash', 'cooked'), I('vatten', 'liquid'),
      I('saffran', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('romansallad', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'tue-3', slot: 'main', title: 'Svampsoppa med champinjoner, portabello och grönkål',
    method: 'Koka champinjoner, portabellosvamp och schalottenlök i vatten med timjan och salt ca 15 min. Mixa hälften, rör ner strimlad grönkål och koka 3 min. Sallad: romansallad och tomat med pressad citron.',
    ingredients: [I('tradgardschampinjon', 'cooked'), I('portabellosvamp', 'cooked'), I('schalottenlok', 'cooked'), I('gronkal', 'cooked'), I('vatten', 'liquid'),
      I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('romansallad', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },

  // ONSDAG – vitt kött (gemensamt: kyckling, kalkon)
  {
    id: 'wed-1', slot: 'main', title: 'Grillad kyckling med dragon, ångade strängbönor och champinjoner',
    method: 'Krydda kycklingen med dragon, timjan och salt och stek i 1 msk ankfett eller ugnsbaka tills genomstekt. Ånga strängbönor och champinjoner. Sallad: romansallad och tomat med pressad citron.',
    ingredients: [I('kyckling', 'base'), I('dragon', 'seasoning'), I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('strangbona', 'cooked'), I('tradgardschampinjon', 'cooked'),
      I('romansallad', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'wed-2', slot: 'main', title: 'Ugnsbakad kalkon med butternutpumpa och strängbönor',
    method: 'Krydda kalkonen med timjan, oregano och salt och ugnsbaka med 1 msk smält ankfett i 175 °C tills genomstekt. Ugnsbaka butternutpumpa i bitar bredvid. Ånga strängbönorna. Sallad: källfräne och tomat med pressad citron.',
    ingredients: [I('kalkon', 'base'), I('timjan', 'seasoning'), I('oregano', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('butternutpumpa', 'cooked'), I('strangbona', 'cooked'),
      I('kallfrane', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'wed-3', slot: 'main', title: 'Grillad kyckling med oregano, ugnsbakad aubergine och sommarsquash',
    method: 'Krydda kycklingen med oregano, chilipeppar och salt och stek eller grilla i 1 msk ankfett. Ugnsbaka aubergine och sommarsquash i 200 °C ca 25 min. Sallad: rosé-/grönsallad och tomat med pressad citron.',
    ingredients: [I('kyckling', 'base'), I('oregano', 'seasoning'), I('chilipeppar', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('aubergine', 'cooked'), I('sommarsquash', 'cooked'),
      I('rose-gronsallad', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },

  // TORSDAG – baljväxter + färsk sallad
  {
    id: 'thu-1', slot: 'main', title: 'Kikärtssallad med tomat och grönmynta',
    method: 'Blötlägg och koka kikärtorna i vatten med salt tills mjuka. Blanda med romansallad, tomat och källfräne. Smaka av med spiskummin, hackad grönmynta, pressad citron och salt.',
    ingredients: [I('kikarta', 'base'), I('vatten', 'liquid'), I('romansallad', 'salad'), I('tomat', 'salad'), I('kallfrane', 'salad'),
      I('spiskummin', 'seasoning'), I('gronmynta', 'seasoning'), I('citron', 'seasoning', 'pressad, som dressing'), I('keltiskt-salt-havssalt', 'seasoning')],
  },
  {
    id: 'thu-2', slot: 'main', title: 'Linssallad med spenat, tomat och schalottenlök',
    method: 'Koka linserna i vatten med salt ca 20 min, låt svalna. Blanda med spenat, tomat och finhackad schalottenlök. Smaka av med spiskummin, pressad citron och salt.',
    ingredients: [I('linser', 'base'), I('vatten', 'liquid'), I('spenat', 'salad'), I('tomat', 'salad'), I('schalottenlok', 'salad'),
      I('spiskummin', 'seasoning'), I('citron', 'seasoning', 'pressad, som dressing'), I('keltiskt-salt-havssalt', 'seasoning')],
  },
  {
    id: 'thu-3', slot: 'main', title: 'Bönsallad med kidneybönor, pintobönor och jalapeño',
    method: 'Koka kidney- och pintobönorna i vatten med salt tills mjuka. Blanda med romansallad, tomat och tunt skivad jalapeñopeppar. Smaka av med spiskummin, pressad citron och salt.',
    ingredients: [I('kidneybona', 'base'), I('pintobona', 'base'), I('vatten', 'liquid'), I('romansallad', 'salad'), I('tomat', 'salad'), I('jalapenopeppar', 'salad'),
      I('spiskummin', 'seasoning'), I('citron', 'seasoning', 'pressad, som dressing'), I('keltiskt-salt-havssalt', 'seasoning')],
  },

  // FREDAG – vegetarisk grönsaksgryta + färsk sallad
  {
    id: 'fri-1', slot: 'main', title: 'Grönsaksgryta med aubergine, okra och tomat',
    method: 'Fräs schalottenlöken mjuk i 1 msk ankfett. Lägg i aubergine, sommarsquash, okra och tomat i bitar och låt puttra i lite vatten med oregano, chilipeppar och salt ca 25 min tills mjukt. Sallad: rosé-/grönsallad med pressad citron.',
    ingredients: [I('aubergine', 'cooked'), I('sommarsquash', 'cooked'), I('okra', 'cooked'), I('tomat', 'cooked'), I('schalottenlok', 'cooked'), I('vatten', 'liquid'),
      I('oregano', 'seasoning'), I('chilipeppar', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('rose-gronsallad', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'fri-2', slot: 'main', title: 'Grönsaksgryta med kronärtskocka, strängbönor och tomat',
    method: 'Fräs schalottenlöken mjuk i 1 msk ankfett. Lägg i kronärtskockshjärtan, strängbönor och tomat och låt puttra i vatten med dragon och salt ca 20 min. Sallad: rosé-/grönsallad och källfräne med pressad citron.',
    ingredients: [I('kronartskocka', 'cooked'), I('strangbona', 'cooked'), I('tomat', 'cooked'), I('schalottenlok', 'cooked'), I('vatten', 'liquid'),
      I('dragon', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('rose-gronsallad', 'salad'), I('kallfrane', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'fri-3', slot: 'main', title: 'Pumpagryta med spenat och spiskummin',
    method: 'Fräs schalottenlöken mjuk i 1 msk ankfett. Lägg i butternutpumpa och tomat och låt puttra i vatten med spiskummin, saffran och salt ca 20 min. Rör ner spenat sista minuten. Sallad: källfräne och romansallad med pressad citron.',
    ingredients: [I('butternutpumpa', 'cooked'), I('tomat', 'cooked'), I('schalottenlok', 'cooked'), I('spenat', 'cooked'), I('vatten', 'liquid'),
      I('spiskummin', 'seasoning'), I('saffran', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('kallfrane', 'salad'), I('romansallad', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },

  // LÖRDAG – fisk
  {
    id: 'sat-1', slot: 'main', title: 'Ugnsbakad öring med citron och timjan, strängbönor och butternutpumpa',
    method: 'Lägg öringen i en form, strö över timjan och salt och pressa över citron. Ugnsbaka i 200 °C ca 15 min med 1 msk smält ankfett. Ugnsbaka butternutpumpa i bitar och ånga strängbönorna. Sallad: spenat och tomat.',
    ingredients: [I('oring', 'base'), I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'), I('citron', 'seasoning'),
      I('strangbona', 'cooked'), I('butternutpumpa', 'cooked'),
      I('spenat', 'salad'), I('tomat', 'salad')],
  },
  {
    id: 'sat-2', slot: 'main', title: 'Grillad makrill med ugnsbakad tomat och ångad senapskål',
    method: 'Krydda makrillen med timjan och salt och stek eller grilla i 1 msk ankfett. Ugnsbaka tomathalvor med oregano. Ånga senapskålen. Sallad: romansallad med pressad citron.',
    ingredients: [I('makrill', 'base'), I('timjan', 'seasoning'), I('oregano', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('tomat', 'cooked'), I('senapskal', 'cooked'),
      I('romansallad', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'sat-3', slot: 'main', title: 'Ångad tilapia med dragon, strängbönor och grönkål',
    method: 'Krydda tilapian med dragon och salt och ånga ca 8 min. Ånga strängbönor och grönkål. Pressa citron över fisken. Sallad: spenat och tomat.',
    ingredients: [I('tilapia', 'base'), I('dragon', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'), I('citron', 'seasoning'),
      I('strangbona', 'cooked'), I('gronkal', 'cooked'),
      I('spenat', 'salad'), I('tomat', 'salad')],
  },

  // SÖNDAG – rött kött. Gemensamt: hjortkött (Patriks regel + användarbeslut 2026-10-02 för Linns regel)
  {
    id: 'sun-1', slot: 'main', title: 'Ugnsbakat hjortkött med portabello, butternutpumpa och grönkål',
    method: 'Krydda hjortköttet med timjan och salt och ugnsbaka med 1 msk smält ankfett. Ugnsbaka portabellosvamp och butternutpumpa, ånga grönkålen. Sallad: romansallad och tomat med pressad citron.',
    ingredients: [I('hjortkott', 'base'), I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('portabellosvamp', 'cooked'), I('butternutpumpa', 'cooked'), I('gronkal', 'cooked'),
      I('romansallad', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'sun-2', slot: 'main', title: 'Grillat hjortkött med oregano, ugnsbakad aubergine och strängbönor',
    method: 'Krydda hjortköttet med oregano, chilipeppar och salt och stek eller grilla i 1 msk ankfett. Ugnsbaka aubergine i 200 °C ca 25 min och ånga strängbönorna. Sallad: källfräne och tomat med pressad citron.',
    ingredients: [I('hjortkott', 'base'), I('oregano', 'seasoning'), I('chilipeppar', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('aubergine', 'cooked'), I('strangbona', 'cooked'),
      I('kallfrane', 'salad'), I('tomat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
  {
    id: 'sun-3', slot: 'main', title: 'Hjortkött i ugn med dragon, champinjoner och senapskål',
    method: 'Krydda hjortköttet med dragon, timjan och salt och ugnsbaka med 1 msk smält ankfett. Ugnsbaka champinjoner och schalottenlök, ånga senapskålen. Sallad: rosé-/grönsallad och spenat med pressad citron.',
    ingredients: [I('hjortkott', 'base'), I('dragon', 'seasoning'), I('timjan', 'seasoning'), I('keltiskt-salt-havssalt', 'seasoning'),
      I('tradgardschampinjon', 'cooked'), I('schalottenlok', 'cooked'), I('senapskal', 'cooked'),
      I('rose-gronsallad', 'salad'), I('spenat', 'salad'), I('citron', 'seasoning', 'pressad, som dressing')],
  },
];

// Källfräne ersätts (användarbeslut 2026-10-02): "skriv då spenat, romansallad eller rosé-/grönsallad".
// Alternativ som redan finns i rätten tas bort så att samma sallad inte står två gånger. Varje alternativ valideras.
const GREENS = ['spenat', 'romansallad', 'rose-gronsallad'];
const GREEN_NAME = { spenat: 'spenat', romansallad: 'romansallad', 'rose-gronsallad': 'rosé-/grönsallad' };
const orList = (ids) => (ids.length === 1 ? GREEN_NAME[ids[0]] : `${ids.slice(0, -1).map((x) => GREEN_NAME[x]).join(', ')} eller ${GREEN_NAME[ids[ids.length - 1]]}`);
for (const m of MEALS) {
  const k = m.ingredients.findIndex((i) => i.id === 'kallfrane');
  if (k < 0) continue;
  const opts = GREENS.filter((g) => !m.ingredients.some((i) => i.id === g));
  m.ingredients[k] = { ...m.ingredients[k], id: opts[0], alt: opts.slice(1) };
  m.method = m.method.replace(/källfräne/g, orList(opts));
  if (m.slot === 'snack3' || m.slot === 'snack2') m.method = `Skär tomaten i bitar och servera med ${orList(opts)}.`;
}

// Stekfettet står i metoden → det ska också stå som ingrediens (inga dolda ingredienser)
for (const m of MEALS) {
  if (/ankfett/.test(m.method) && !m.ingredients.some((i) => i.id === 'ankfett')) m.ingredients.push(I('ankfett', 'fat', '1 msk'));
}

// Dryck varje dag (kostschemana: 10–12 glas vatten; örtte är tillåten dryck)
export const DAILY_DRINKS = [
  { title: 'Vatten, 10–12 glas', ingredients: ['vatten'] },
  { title: 'Örtte på färsk grönmynta', ingredients: ['gronmynta', 'vatten'] },
];

const MAIN = {
  mon: ['mon-1', 'mon-2', 'mon-3'],
  tue: ['tue-1', 'tue-2', 'tue-3'],
  wed: ['wed-1', 'wed-2', 'wed-3'],
  thu: ['thu-1', 'thu-2', 'thu-3'],
  fri: ['fri-1', 'fri-2', 'fri-3'],
  sat: ['sat-1', 'sat-2', 'sat-3'],
  sun: ['sun-1', 'sun-2', 'sun-3'],
};
const BREAKFASTS = ['fr-mango-kiwi', 'fr-papaya-ananas', 'fr-melon-persika', 'fr-mandarin-kiwi', 'fr-vattenmelon-mango', 'fr-guava-papaya', 'fr-ananas-mandarin'];
const FRUIT = ['fs-persimon', 'fs-kiwi', 'fs-mango', 'fs-mandarin', 'fs-melon', 'fs-persika', 'fs-guava'];
const VEG_PM = ['vs-tomat-squash', 'vs-strangbona', 'vs-champinjon-tomat', 'vs-romansallad-tomat'];
const VEG_EVE = ['ks-strangbona', 'ks-spenat-tomat', 'ks-squash', 'ks-tomat-kallfrane'];
const WD = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const fruitsOf = (id) => MEALS.find((m) => m.id === id).ingredients.map((x) => x.id);
// Förmiddagsfrukt: nästa frukt i turordningen som inte redan finns i dagens frukost
const pickFruit = (i, breakfastId) => {
  for (let k = 0; k < FRUIT.length; k++) {
    const id = FRUIT[(i + k) % FRUIT.length];
    if (!fruitsOf(id).some((f) => fruitsOf(breakfastId).includes(f))) return id;
  }
  throw new Error('Ingen frukt utan överlapp');
};

export const DAYS = Array.from({ length: 21 }, (_, i) => {
  const day = i + 1;
  const week = Math.floor(i / 7);
  const weekday = WD[i % 7];
  const main = MAIN[weekday][week];
  const [y, mo, dd] = START_DATE.split('-').map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, dd + i));
  return {
    day, week: week + 1, weekday, date: dt.toISOString().slice(0, 10),
    meals: {
      breakfast: BREAKFASTS[(i + week * 2) % 7],
      snack1: pickFruit(i + week * 3, BREAKFASTS[(i + week * 2) % 7]),
      lunch: main,
      snack2: VEG_PM[(i + week) % 4],
      dinner: main,
      snack3: VEG_EVE[(i + week) % 4],
    },
    drinks: DAILY_DRINKS,
  };
});
