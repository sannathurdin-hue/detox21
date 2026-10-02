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
