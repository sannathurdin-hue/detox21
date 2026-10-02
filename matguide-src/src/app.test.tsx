import { describe, expect, it, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  COMPARISON, COMPARISON_ORDER, FOODS, FOOD_BY_ID, analyzeIngredients, byComparison, searchFoods,
} from './lib/data';
import { WEEKDAYS, analyzeDay } from './lib/week';
import { filterTable } from './views/Table';
import { View } from './App';

afterEach(cleanup);

describe('Databasregler', () => {
  it('"Båda kan äta" = exakt de livsmedel där båda har ALLOWED', () => {
    const both = byComparison('BOTH_ALLOWED');
    expect(both.length).toBeGreaterThan(0);
    for (const f of both) {
      expect(f.linn.finalStatusDay1To21).toBe('ALLOWED');
      expect(f.patrik.finalStatusDay1To21).toBe('ALLOWED');
    }
    const expected = FOODS.filter((f) => f.linn.finalStatusDay1To21 === 'ALLOWED' && f.patrik.finalStatusDay1To21 === 'ALLOWED');
    expect(both.map((f) => f.id).sort()).toEqual(expected.map((f) => f.id).sort());
  });

  it('varje livsmedel har exakt en jämförelsestatus', () => {
    const total = COMPARISON_ORDER.reduce((n, s) => n + byComparison(s).length, 0);
    expect(total).toBe(FOODS.length);
  });

  it('kända överstyrningar: bakjäst (Linn) och vindruva (Patrik) är gröna i ALCAT men inte tillåtna', () => {
    expect(FOOD_BY_ID['bakjast'].linn.alcatStatus).toBe('NONE');
    expect(FOOD_BY_ID['bakjast'].linn.finalStatusDay1To21).toBe('AVOID');
    expect(FOOD_BY_ID['vindruva'].patrik.alcatStatus).toBe('NONE');
    expect(FOOD_BY_ID['vindruva'].patrik.finalStatusDay1To21).toBe('AVOID');
  });

  it('manukahonung räknas inte som honung (användarbeslut)', () => {
    expect(FOOD_BY_ID['manukahonung'].comparisonStatus).toBe('BOTH_ALLOWED');
    expect(FOOD_BY_ID['honung'].comparisonStatus).toBe('BOTH_AVOID');
  });

  it('datakonflikter syns aldrig som gemensamt tillåtna', () => {
    expect(FOOD_BY_ID['endiv'].comparisonStatus).toBe('DATA_CONFLICT');
    expect(FOOD_BY_ID['havsabborre'].linn.finalStatusDay1To21).toBe('DATA_CONFLICT');
  });
});

describe('Sökning', () => {
  it('hittar kyckling som båda kan äta', () => {
    const [f] = searchFoods('kyckling');
    expect(f.id).toBe('kyckling');
    expect(f.comparisonStatus).toBe('BOTH_ALLOWED');
  });
  it('avokado: endast Patrik', () => {
    expect(searchFoods('avokado')[0].comparisonStatus).toBe('PATRIK_ONLY');
  });
  it('lax: endast Linn', () => {
    expect(searchFoods('Lax')[0].comparisonStatus).toBe('LINN_ONLY');
  });
  it('okänt livsmedel ger inga träffar (→ Ej verifierat i UI)', () => {
    expect(searchFoods('quorn')).toHaveLength(0);
  });
  it('alias fläskkött hittar griskött', () => {
    expect(searchFoods('fläskkött')[0].id).toBe('griskott');
  });
  it('sökningen ger samma status som jämförelsetabellen', () => {
    for (const f of FOODS) {
      const s = searchFoods(f.displayName)[0];
      expect(s.id).toBe(f.id);
      const t = filterTable(f.displayName, 'ALL', 'Alla')[0];
      expect(t.comparisonStatus).toBe(s.comparisonStatus);
      expect(filterTable('', f.comparisonStatus, 'Alla').some((x) => x.id === f.id)).toBe(true);
    }
  });
});

describe('Kan vi äta detta?', () => {
  it('kyckling + ris + tomat → båda', () => {
    expect(analyzeIngredients(['kyckling', 'ris', 'tomat'].map((i) => FOOD_BY_ID[i])).verdict).toBe('BOTH');
  });
  it('med avokado → inte gemensamt, avokado pekas ut', () => {
    const r = analyzeIngredients(['kyckling', 'ris', 'tomat', 'avokado'].map((i) => FOOD_BY_ID[i]));
    expect(r.verdict).toBe('NOT_SHARED');
    expect(r.problems.map((p) => p.food.id)).toEqual(['avokado']);
    expect(r.problems[0].text).toContain('tillåten för Patrik');
  });
  it('ej verifierad ingrediens → kan inte verifieras', () => {
    const r = analyzeIngredients(['kyckling', 'svart-te'].map((i) => FOOD_BY_ID[i]));
    expect(r.verdict).toBe('CANNOT_VERIFY');
    expect(r.unverified[0].food.id).toBe('svart-te');
  });
});

describe('Veckoschema', () => {
  it('alla dagar kan analyseras och "gemensamt" innehåller bara BOTH_ALLOWED', () => {
    for (const d of WEEKDAYS) {
      const a = analyzeDay(d.key);
      a.categories.forEach((c) => c.shared.forEach((f) => expect(f.comparisonStatus).toBe('BOTH_ALLOWED')));
      a.named?.shared.forEach((f) => expect(f.comparisonStatus).toBe('BOTH_ALLOWED'));
    }
  });
  it('måndag: ris gemensamt; onsdag: kyckling + kalkon; söndag: inget gemensamt i reglerna', () => {
    expect(analyzeDay('mon').named!.shared.map((f) => f.id)).toEqual(['ris']);
    expect(analyzeDay('wed').named!.shared.map((f) => f.id).sort()).toEqual(['kalkon', 'kyckling']);
    expect(analyzeDay('sun').named!.shared).toHaveLength(0);
  });
});

describe('Vyer renderar', () => {
  const routes = [
    [], ['bada'], ['endast-linn'], ['endast-patrik'], ['undvik'], ['villkorat'], ['ej-verifierat'], ['konflikt'],
    ['skillnader'], ['tabell'], ['veckoschema'], ['kan-vi-ata'], ['underlag'], ['person', 'linn'], ['person', 'patrik'],
    ...FOODS.map((f) => ['livsmedel', f.id]),
  ];
  it.each(routes.map((r) => [r.join('/') || 'start', r]))('%s', (_n, r) => {
    render(<View route={r as string[]} />);
    expect(screen.queryByText('Sidan finns inte')).toBeNull();
  });

  it('startsidans antal räknas från databasen', () => {
    render(<View route={[]} />);
    const both = screen.getByText(COMPARISON.BOTH_ALLOWED.label).closest('a')!;
    expect(both.textContent).toContain(String(byComparison('BOTH_ALLOWED').length));
  });

  it('startsidans sökning visar okänt livsmedel som ej verifierat', () => {
    render(<View route={[]} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'quorn' } });
    expect(screen.getByText('? Ej verifierat i underlaget')).toBeTruthy();
  });

  it('personvyn ger samma status som den gemensamma databasen', () => {
    render(<View route={['person', 'linn']} />);
    const allowedTab = screen.getByRole('button', { name: /Tillåtet dag 1–21/ });
    expect(allowedTab.textContent).toContain(String(FOODS.filter((f) => f.linn.finalStatusDay1To21 === 'ALLOWED').length));
    for (const f of FOODS.filter((x) => x.linn.finalStatusDay1To21 === 'ALLOWED')) {
      expect(screen.getAllByText(f.displayName).length).toBeGreaterThan(0);
    }
  });
});

// ---------------------------------------------------------------------------
import { validateMeal, validateDay } from './lib/restoreRules.js';
import { MEAL_BY_ID, RESTORE_DAYS, RESTORE_FOODS, RESTORE_MEALS, RESTORE_SUMMARY, CONFLICTS } from './lib/restore';
import { R_DAYS, R_FOOD, R_FOODS, R_INCLUDED, R_MEALS, rCheck } from './lib/restorePublic';
import PUB from './data/restore-public.json';
import App from './App';

const PRIVATE = /linn|patrik|\bgrant\b|\brees\b|båda|profil|gemensam/i;

describe('Re:store by Sanna', () => {
  it('Re:store-listan = exakt de livsmedel båda har ALLOWED', () => {
    const exp = FOODS.filter((f) => f.linn.finalStatusDay1To21 === 'ALLOWED' && f.patrik.finalStatusDay1To21 === 'ALLOWED');
    expect(RESTORE_FOODS.map((f) => f.id).sort()).toEqual(exp.map((f) => f.id).sort());
  });
  it('ALCAT-grönt räcker inte: bakjäst och vindruva ingår inte', () => {
    expect(FOOD_BY_ID['bakjast'].restoreStatus).toBe('NOT_ALLOWED_FOR_BOTH');
    expect(FOOD_BY_ID['vindruva'].restoreStatus).toBe('NOT_ALLOWED_FOR_BOTH');
  });
  it('konflikter och ej verifierat ingår inte', () => {
    expect(FOOD_BY_ID['endiv'].restoreStatus).toBe('DATA_CONFLICT');
    expect(FOOD_BY_ID['olivolja'].restoreStatus).toBe('UNVERIFIED');
    expect(CONFLICTS.every((c) => c.sourceA && c.sourceB)).toBe(true);
  });
  it('validatorn underkänner en otillåten ingrediens (avokado)', () => {
    const meal = { ...MEAL_BY_ID['sat-1'], ingredients: [...MEAL_BY_ID['sat-1'].ingredients, { id: 'avokado', role: 'salad' }] };
    const v = validateMeal(meal, 'lunch', 'sat', FOOD_BY_ID);
    expect(v.ingredientsPass).toBe(false);
    expect(v.pass).toBe(false);
  });
  it('validatorn underkänner fel struktur: kyckling på fiskdagen (lördag)', () => {
    const v = validateMeal(MEAL_BY_ID['wed-1'], 'lunch', 'sat', FOOD_BY_ID);
    expect(v.ingredientsPass).toBe(true);
    expect(v.structurePass).toBe(false);
  });
  it('validatorn underkänner potatis i tisdagssoppan och okänd ingrediens', () => {
    const soup = { ...MEAL_BY_ID['tue-1'], ingredients: [...MEAL_BY_ID['tue-1'].ingredients, { id: 'vit-potatis', role: 'cooked' }] };
    expect(validateMeal(soup, 'lunch', 'tue', FOOD_BY_ID).pass).toBe(false);
    const x = { ...MEAL_BY_ID['mon-1'], ingredients: [...MEAL_BY_ID['mon-1'].ingredients, { id: 'dressing', role: 'seasoning' }] };
    expect(validateMeal(x, 'lunch', 'mon', FOOD_BY_ID).pass).toBe(false);
  });
  it('alla 21 dagar omvalideras i appen med samma resultat som bygget', () => {
    for (const d of RESTORE_DAYS) {
      const v = validateDay(d, MEAL_BY_ID, FOOD_BY_ID);
      expect(v.pass).toBe(d.validation.pass);
    }
    expect(RESTORE_SUMMARY.pass).toBe(RESTORE_DAYS.filter((d) => d.validation.pass).length);
  });
  it('alla ingredienser i planen är tillåtna för båda', () => {
    for (const m of RESTORE_MEALS.filter((x) => x.usedOnDays.length)) {
      for (const i of m.ingredients) expect(FOOD_BY_ID[i.id].restoreStatus).toBe('ALLOWED_FOR_BOTH');
    }
  });
  it('stekfett: ankfett ingår (användarbeslut), kokosfett ingår fortfarande inte', () => {
    expect(FOOD_BY_ID['ankfett'].restoreStatus).toBe('ALLOWED_FOR_BOTH');
    expect(FOOD_BY_ID['ankfett'].linn.sources.some((x) => x.kind === 'ANVÄNDARBESLUT')).toBe(true);
    expect(FOOD_BY_ID['kokosfett'].restoreStatus).not.toBe('ALLOWED_FOR_BOTH');
    expect(FOOD_BY_ID['olivolja'].restoreStatus).toBe('UNVERIFIED');
  });
  it('varje måltid som nämner ankfett har det som ingrediens', () => {
    for (const m of RESTORE_MEALS) expect(/ankfett/.test(m.method)).toBe(m.ingredients.some((i) => i.id === 'ankfett'));
    expect(RESTORE_MEALS.filter((m) => m.ingredients.some((i) => i.id === 'ankfett')).length).toBeGreaterThan(0);
  });
  it('validatorn underkänner kokosfett som stekfett', () => {
    const m = { ...MEAL_BY_ID['sun-1'], ingredients: MEAL_BY_ID['sun-1'].ingredients.map((i) => (i.id === 'ankfett' ? { ...i, id: 'kokosfett' } : i)) };
    expect(validateMeal(m, 'lunch', 'sun', FOOD_BY_ID).pass).toBe(false);
  });
  it('alla 21 dagar passerar (söndag via användarbeslut om hjortkött)', () => {
    for (const d of RESTORE_DAYS) expect(d.validation.pass).toBe(true);
    expect(RESTORE_SUMMARY.pass).toBe(21);
  });
  it('söndag: hjortkött är enda gemensamma kött; kalvkött/anka underkänns fortfarande', () => {
    const sun = MEAL_BY_ID['sun-1'];
    expect(validateMeal(sun, 'lunch', 'sun', FOOD_BY_ID).pass).toBe(true);
    const veal = { ...sun, ingredients: sun.ingredients.map((i) => (i.id === 'hjortkott' ? { ...i, id: 'kalvkott' } : i)) };
    expect(validateMeal(veal, 'lunch', 'sun', FOOD_BY_ID).pass).toBe(false);
    const duck = { ...sun, ingredients: sun.ingredients.map((i) => (i.id === 'hjortkott' ? { ...i, id: 'anka' } : i)) };
    expect(validateMeal(duck, 'lunch', 'sun', FOOD_BY_ID).pass).toBe(false);
  });

  it('publik Re:store-data innehåller inga källprofiler', () => {
    const raw = JSON.stringify(PUB);
    expect(raw).not.toMatch(PRIVATE);
    expect(R_INCLUDED.length).toBe(RESTORE_FOODS.length);
    for (const f of R_FOODS) expect(f.status).toBe(FOOD_BY_ID[f.id].restoreStatus);
    for (const d of R_DAYS) expect(d.status === 'VALIDATED').toBe(RESTORE_DAYS.find((x) => x.day === d.day)!.validation.pass);
  });

  const rroutes = [[], ['mat'], ['plan'], ['struktur'], ['fungerar'],
    ...R_DAYS.map((d) => ['dag', String(d.day)]), ...R_MEALS.map((m) => ['maltid', m.id]), ...R_FOODS.map((f) => ['livsmedel', f.id])];

  it.each(rroutes.map((r) => ['restore/' + r.join('/'), r]))('PRIVACY: %s exponerar inga personnamn', (n, r) => {
    window.location.hash = '#/' + n;
    const { container } = render(<App />);
    expect(screen.queryByText('Sidan finns inte')).toBeNull();
    expect(container.innerHTML).not.toMatch(PRIVATE);
    expect(document.title).toBe('Re:store by Sanna');
  });

  it('PRIVACY: sökning och ingredienskontroll exponerar inga personnamn', () => {
    window.location.hash = '#/restore';
    const { container, unmount } = render(<App />);
    for (const q of ['avokado', 'lax', 'endiv', 'olivolja', 'kyckling', 'quorn', 'kaffe', 'manuka']) {
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: q } });
      expect(container.innerHTML).not.toMatch(PRIVATE);
    }
    unmount();
    window.location.hash = '#/restore/fungerar';
    const c2 = render(<App />);
    for (const q of ['kyckling', 'avokado', 'endiv', 'olivolja', 'quorn']) {
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: q } });
      fireEvent.click(c2.container.querySelector('.suggest button')!);
    }
    expect(c2.container.textContent).toContain('INTE RE:STORE-KOMPATIBEL');
    expect(c2.container.innerHTML).not.toMatch(PRIVATE);
  });

  it('räknaren i Re:store Foods kommer från databasen', () => {
    window.location.hash = '#/restore/mat';
    render(<App />);
    expect(screen.getByText(`${RESTORE_FOODS.length} validerade livsmedel.`)).toBeTruthy();
  });

  it('sök i Re:store: avokado ingår inte, kyckling ingår', () => {
    window.location.hash = '#/restore';
    const { container } = render(<App />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'avokado' } });
    expect(container.textContent).toContain('INGÅR INTE I RE:STORE');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'kyckling' } });
    expect(container.textContent).toContain('INGÅR I RE:STORE');
  });

  it('Re:store-kontrollen: kyckling + ris + tomat är kompatibelt', () => {
    expect(rCheck(['kyckling', 'ris', 'tomat'].map((i) => R_FOOD[i])).verdict).toBe('YES');
    expect(rCheck(['kyckling', 'avokado'].map((i) => R_FOOD[i])).verdict).toBe('NO');
    expect(rCheck(['kyckling', 'olivolja'].map((i) => R_FOOD[i])).verdict).toBe('UNCLEAR');
  });

  it('intern granskning finns kvar på Re:Set-sidan', () => {
    render(<View route={['underlag', 'restore']} />);
    expect(screen.getByText('Re:store – källgranskning & QA')).toBeTruthy();
  });
});
