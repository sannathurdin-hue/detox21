// Re:store by Sanna – gemensam struktur och validering.
// Delas av byggskriptet (Node) och appen/testerna (Vite), därför ren JS utan beroenden.
//
// Strukturen är härledd ur Linns och Patriks kostscheman (veckodagsregler, måltider, anteckningar).
// Den GEMENSAMMA strukturen = det som båda personernas regel för samma dag och måltid medger.

/** Måltider – båda har sex måltider var tredje timme ("3 timmarsintervall 2 ½ - 3 ½"). */
export const SLOTS = [
  { key: 'breakfast', label: 'Frukost', linn: '07:30', patrik: '06:15',
    linnText: 'Fruktsallad + 1 tsk tahini (zeina) eller valnötssmör + 1 st knäckebröd',
    patrikText: 'Fruktsallad + 1 tsk tahini (ljus sesampasta) + 1 tsk manuka honung + 1 st knäckebröd',
    shared: 'Fruktsallad (frukt verifierad för båda) + 1 tsk tahini' },
  { key: 'snack1', label: 'Mellanmål', linn: '10:00', patrik: '09:00',
    linnText: 'frukt (från den gröna listan)', patrikText: 'frukt (från gröna listan)', shared: 'Frukt verifierad för båda' },
  { key: 'lunch', label: 'Lunch', linn: '13:00', patrik: '12:00',
    linnText: 'LUNCH – MIDDAG ÄR SAMMA', patrikText: 'LUNCHEN - MIDDAGEN ÄR LIKADANA', shared: 'Dagens regel (se veckodag)' },
  { key: 'snack2', label: 'Mellanmål', linn: '16:00', patrik: '15:00',
    linnText: 'grönsaker (gröna listan)', patrikText: 'grönsaker (gröna listan)', shared: 'Grönsaker verifierade för båda' },
  { key: 'dinner', label: 'Middag', linn: '19:00', patrik: '18:00',
    linnText: 'MIDDAG: LUNCH – MIDDAG ÄR SAMMA', patrikText: 'MIDDAG: LUNCHEN - MIDDAGEN ÄR LIKADANA', shared: 'Samma som lunch' },
  { key: 'snack3', label: 'Kvällsmål', linn: '22:00', patrik: '21:00',
    linnText: 'Grönsaker eller frukt', patrikText: 'Grönsaker (ej förbjudna)', shared: 'Grönsaker (Linn: grönsaker eller frukt · Patrik: grönsaker)' },
];

export const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const WEEKDAY_LABEL = { mon: 'Måndag', tue: 'Tisdag', wed: 'Onsdag', thu: 'Torsdag', fri: 'Fredag', sat: 'Lördag', sun: 'Söndag' };

const SEASONING_EXTRA = ['citron', 'keltiskt-salt-havssalt'];
const LIQUID = ['vatten'];

/**
 * Lunch/middag per veckodag.
 * base: tillåtna huvudkomponenter (id-lista eller kategori), minst `baseMin` st.
 * Lista-regler kräver att livsmedlet nämns i BÅDAS regel för dagen.
 */
export const DAY_RULES = {
  mon: {
    theme: 'Spannmål / stärkelse',
    linn: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + ris / linser pasta',
    patrik: 'Bakade/kokta/grillade/ångkokta grönsaker + färsk sallad + hirs / ris / majs / sötpotatis',
    linnBase: ['ris', 'linspasta'], patrikBase: ['hirs', 'ris', 'majs', 'sotpotatis'],
    baseMin: 1, cookedMin: 2, saladMin: 1, liquid: 'optional', soup: false,
  },
  tue: {
    theme: 'Soppa',
    linn: 'Grönsakssoppa (laktosfri, potatisfri) + knäckebröd + färsk sallad eller Fisksoppa (laktosfri, potatisfri) + knäckebröd + färsk sallad',
    patrik: 'Grönsakssoppa (utan laktos, utan potatis) + knäckebröd + färsk sallad eller Fisksoppa (utan laktos, utan potatis) + knäckebröd + färsk sallad',
    baseCategory: 'Fisk & skaldjur', baseMin: 0, baseMax: 1, cookedMin: 2, saladMin: 1, liquid: 'required', soup: true,
    forbidIds: ['vit-potatis'], knackebrod: true,
  },
  wed: {
    theme: 'Vitt kött',
    linn: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + kalkon / kyckling',
    patrik: 'Bakade/kokta/grillade/ångkokta grönsaker + färsk sallad + kyckling / kalkon / ägg',
    linnBase: ['kalkon', 'kyckling'], patrikBase: ['kyckling', 'kalkon', 'agg-helt'],
    baseMin: 1, cookedMin: 2, saladMin: 1, liquid: 'optional',
  },
  thu: {
    theme: 'Baljväxter',
    linn: 'Färsk sallad + baljväxter + knäckebröd',
    patrik: 'Färsk sallad + baljväxter + knäckebröd',
    baseCategory: 'Baljväxter', baseMin: 1, cookedMin: 0, cookedMax: 0, saladMin: 2, liquid: 'optional', knackebrod: true,
  },
  fri: {
    theme: 'Vegetarisk',
    linn: 'Grönsaksgryta + knäckebröd + färsk sallad',
    patrik: 'Grönsaksgryta + knäckebröd + färsk sallad',
    baseMin: 0, baseMax: 0, cookedMin: 3, saladMin: 1, liquid: 'required', knackebrod: true,
  },
  sat: {
    theme: 'Fisk',
    linn: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + fisk',
    patrik: 'Bakade/kokta/grillade/ångkokta grönsaker + färsk sallad + fisk',
    baseCategory: 'Fisk & skaldjur', baseMin: 1, cookedMin: 2, saladMin: 1, liquid: 'optional',
  },
  sun: {
    theme: 'Rött kött',
    linn: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + kalvkött / fläskkött',
    patrik: 'Bakade/kokta/grillade/ångkokta grönsaker + Färsk sallad + anka / hjortkött',
    linnBase: ['kalvkott', 'griskott'], patrikBase: ['anka', 'hjortkott'],
    // Användarbeslut 2026-10-02: "godkänns hjortkött för söndag" (Linns söndagsregel)
    decisions: { linnBase: { add: ['hjortkott'], source: 'Användarens beslut (2026-10-02)', quote: 'godkänns hjortkött för söndag' } },
    baseMin: 1, cookedMin: 2, saladMin: 1, liquid: 'optional',
  },
};

/** Gemensamt tillåtna huvudkomponenter för en dag (nämnda i båda reglerna OCH tillåtna för båda). */
export function sharedBase(dayKey, foodsById) {
  const r = DAY_RULES[dayKey];
  const ok = (id) => foodsById[id] && foodsById[id].restoreStatus === 'ALLOWED_FOR_BOTH';
  if (r.linnBase) {
    const linn = [...r.linnBase, ...((r.decisions && r.decisions.linnBase && r.decisions.linnBase.add) || [])];
    const patrik = [...r.patrikBase, ...((r.decisions && r.decisions.patrikBase && r.decisions.patrikBase.add) || [])];
    return linn.filter((id) => patrik.includes(id) && ok(id));
  }
  if (r.baseCategory) return Object.values(foodsById).filter((f) => f.category === r.baseCategory && ok(f.id)).map((f) => f.id);
  return [];
}

/** TEST A – varje ingrediens ska vara ALLOWED för både Linn och Patrik dag 1–21. */
export function checkIngredient(id, foodsById) {
  const f = foodsById[id];
  if (!f) return { id, name: id, ok: false, linn: 'UNKNOWN', patrik: 'UNKNOWN', reason: 'Finns inte i databasen' };
  const l = f.linn.finalStatusDay1To21, p = f.patrik.finalStatusDay1To21;
  const ok = l === 'ALLOWED' && p === 'ALLOWED' && f.restoreStatus === 'ALLOWED_FOR_BOTH';
  return { id, name: f.displayName, ok, linn: l, patrik: p, reason: ok ? 'Tillåten för båda' : `Linn: ${l} · Patrik: ${p}` };
}

const roleIds = (meal, role) => meal.ingredients.filter((i) => i.role === role).map((i) => i.id);

/** TEST B – måltiden följer den gemensamma strukturen för måltid + veckodag. */
export function checkStructure(meal, slot, dayKey, foodsById) {
  const out = [];
  const add = (ok, text) => out.push({ ok, text });
  const cat = (id) => foodsById[id] && foodsById[id].category;
  const roles = new Set(meal.ingredients.map((i) => i.role));
  const allowedRoles = {
    breakfast: ['fruit', 'spread'],
    snack1: ['fruit'],
    snack2: ['veg'],
    snack3: ['veg'],
    lunch: ['base', 'cooked', 'salad', 'seasoning', 'liquid', 'fat'],
    dinner: ['base', 'cooked', 'salad', 'seasoning', 'liquid', 'fat'],
  }[slot];
  const extra = [...roles].filter((r) => !allowedRoles.includes(r));
  add(extra.length === 0, extra.length ? `Otillåten komponent för ${slot}: ${extra.join(', ')}` : 'Endast komponenter som måltiden tillåter');

  // Rollernas kategorier
  for (const i of meal.ingredients) {
    const c = cat(i.id);
    if (i.role === 'fruit' && c !== 'Frukt') add(false, `${i.id} är inte frukt`);
    if (['veg', 'cooked', 'salad'].includes(i.role) && c !== 'Grönsaker') add(false, `${i.id} är inte en grönsak`);
    if (i.role === 'seasoning' && c !== 'Kryddor & örter' && !SEASONING_EXTRA.includes(i.id)) add(false, `${i.id} är inte krydda/ört/citron/salt`);
    if (i.role === 'liquid' && !LIQUID.includes(i.id)) add(false, `${i.id} är inte vatten`);
    if (i.role === 'fat' && c !== 'Fett & oljor') add(false, `${i.id} är inte ett fett`);
    if (i.role === 'spread' && i.id !== 'tahini-sesampasta') add(false, `${i.id}: frukostens pålägg ska vara tahini (finns i båda scheman)`);
  }

  if (slot === 'breakfast') {
    add(roleIds(meal, 'fruit').length >= 2, 'Fruktsallad: minst två frukter');
    add(roleIds(meal, 'spread').includes('tahini-sesampasta'), '1 tsk tahini');
  }
  if (slot === 'snack1') add(roleIds(meal, 'fruit').length >= 1, 'Frukt');
  if (slot === 'snack2' || slot === 'snack3') add(roleIds(meal, 'veg').length >= 1, 'Grönsaker');

  if (slot === 'lunch' || slot === 'dinner') {
    const r = DAY_RULES[dayKey];
    const base = roleIds(meal, 'base');
    const allowedBase = sharedBase(dayKey, foodsById);
    const badBase = base.filter((id) => !allowedBase.includes(id));
    if (r.linnBase && allowedBase.length === 0) {
      const nm = (ids) => ids.map((id) => (foodsById[id] ? foodsById[id].displayName.toLowerCase() : id)).join(' / ');
      add(false, `Ingen gemensam huvudkomponent: Linns regel anger ${nm(r.linnBase)}, Patriks ${nm(r.patrikBase)} – inget av dem står i båda reglerna och är tillåtet för båda`);
    }
    add(badBase.length === 0, badBase.length ? `Huvudkomponent passar inte dagens gemensamma regel: ${badBase.map((id) => (foodsById[id] ? foodsById[id].displayName.toLowerCase() : id)).join(', ')}` : `Huvudkomponent enligt dagens regel (${r.theme})`);
    if (r.baseMin > 0) add(base.length >= r.baseMin, `Minst ${r.baseMin} huvudkomponent (${r.theme})`);
    if (r.baseMax !== undefined) add(base.length <= r.baseMax, `Högst ${r.baseMax} huvudkomponent(er)`);
    add(roleIds(meal, 'cooked').length >= r.cookedMin, `Minst ${r.cookedMin} tillagade grönsaker`);
    if (r.cookedMax !== undefined) add(roleIds(meal, 'cooked').length <= r.cookedMax, 'Inga tillagade grönsaker (färsk sallad + baljväxter)');
    add(roleIds(meal, 'salad').length >= r.saladMin, 'Färsk sallad');
    if (r.liquid === 'required') add(roleIds(meal, 'liquid').length >= 1, r.soup ? 'Soppa: vatten som bas' : 'Gryta: vatten som bas');
    for (const id of r.forbidIds || []) add(!meal.ingredients.some((i) => i.id === id), `Utan ${(foodsById[id] && foodsById[id].displayName.toLowerCase()) || id} (dagens regel: potatisfri)`);
  }
  return out;
}

export function validateMeal(meal, slot, dayKey, foodsById) {
  const ingredients = meal.ingredients.map((i) => ({ ...checkIngredient(i.id, foodsById), role: i.role, note: i.note || null }));
  const structure = checkStructure(meal, slot, dayKey, foodsById);
  const dup = meal.ingredients.map((i) => i.id).filter((id, k, a) => a.indexOf(id) !== k);
  if (dup.length) structure.push({ ok: false, text: `Dubbel ingrediens: ${dup.join(', ')}` });
  return {
    ingredients,
    structure,
    ingredientsPass: ingredients.every((i) => i.ok),
    structurePass: structure.every((s) => s.ok),
    pass: ingredients.every((i) => i.ok) && structure.every((s) => s.ok),
  };
}

/** Validera en hel dag: alla måltider + lunch = middag + dryck. */
export function validateDay(day, mealsById, foodsById) {
  const meals = SLOTS.map((s) => {
    const meal = mealsById[day.meals[s.key]];
    if (!meal) return { slot: s.key, mealId: day.meals[s.key], pass: false, missing: true };
    return { slot: s.key, mealId: meal.id, ...validateMeal(meal, s.key, day.weekday, foodsById) };
  });
  const checks = [];
  checks.push({ ok: day.meals.lunch === day.meals.dinner, text: 'Lunch = middag (båda scheman)' });
  const drinks = day.drinks.map((d) => ({ ...d, items: d.ingredients.map((id) => checkIngredient(id, foodsById)) }));
  checks.push({ ok: drinks.every((d) => d.items.every((i) => i.ok)), text: 'Dryck: alla ingredienser tillåtna för båda' });
  const pass = meals.every((m) => m.pass) && checks.every((c) => c.ok);
  return { day: day.day, weekday: day.weekday, pass, meals, checks, drinks };
}
