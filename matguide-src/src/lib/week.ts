import { FOOD_BY_ID, FOODS, Food, META, WeekDay } from './data';

export const WEEKDAYS: { key: WeekDay; label: string }[] = [
  { key: 'mon', label: 'Måndag' },
  { key: 'tue', label: 'Tisdag' },
  { key: 'wed', label: 'Onsdag' },
  { key: 'thu', label: 'Torsdag' },
  { key: 'fri', label: 'Fredag' },
  { key: 'sat', label: 'Lördag' },
  { key: 'sun', label: 'Söndag' },
];

// Livsmedel som uttryckligen namnges i respektive dags regel (id:n i databasen).
// Allmänna ord som "grönsaker", "baljväxter" och "fisk" hanteras som kategorier.
const NAMED: Record<WeekDay, { linn: string[]; patrik: string[]; label?: string }> = {
  mon: { linn: ['ris', 'linspasta'], patrik: ['hirs', 'ris', 'majs', 'sotpotatis'], label: 'Stärkelse' },
  tue: { linn: [], patrik: [] },
  wed: { linn: ['kalkon', 'kyckling'], patrik: ['kyckling', 'kalkon', 'agg-helt'], label: 'Vitt kött' },
  thu: { linn: [], patrik: [] },
  fri: { linn: [], patrik: [] },
  sat: { linn: [], patrik: [] },
  sun: { linn: ['kalvkott', 'griskott'], patrik: ['anka', 'hjortkott'], label: 'Rött kött' },
};

// Vilken livsmedelskategori dagens generella ord avser
const CATEGORY_OF_DAY: Record<WeekDay, { category: string; label: string }[]> = {
  mon: [{ category: 'Grönsaker', label: 'Grönsaker & sallad' }],
  tue: [{ category: 'Grönsaker', label: 'Grönsaker till soppa & sallad' }, { category: 'Fisk & skaldjur', label: 'Fisk till fisksoppa' }],
  wed: [{ category: 'Grönsaker', label: 'Grönsaker & sallad' }],
  thu: [{ category: 'Baljväxter', label: 'Baljväxter' }, { category: 'Grönsaker', label: 'Sallad' }],
  fri: [{ category: 'Grönsaker', label: 'Grönsaker till gryta & sallad' }],
  sat: [{ category: 'Fisk & skaldjur', label: 'Fisk' }, { category: 'Grönsaker', label: 'Grönsaker & sallad' }],
  sun: [{ category: 'Grönsaker', label: 'Grönsaker & sallad' }],
};

export interface DayAnalysis {
  named?: {
    label: string;
    linn: Food[];
    patrik: Food[];
    shared: Food[];
    onlyLinn: Food[];
    onlyPatrik: Food[];
    alsoBothAllowed: Food[];
  };
  categories: { label: string; category: string; shared: Food[] }[];
  crispbread: boolean;
}

const get = (id: string): Food => {
  const f = FOOD_BY_ID[id];
  if (!f) throw new Error(`Okänt livsmedel i veckoschemat: ${id}`);
  return f;
};

export function analyzeDay(day: WeekDay): DayAnalysis {
  const n = NAMED[day];
  let named: DayAnalysis['named'];
  if (n.label) {
    const linn = n.linn.map(get);
    const patrik = n.patrik.map(get);
    // Gemensamt = nämns i BÅDAS regel för dagen OCH är verifierat tillåtet för båda
    const shared = linn.filter((f) => n.patrik.includes(f.id) && f.comparisonStatus === 'BOTH_ALLOWED');
    const onlyLinn = linn.filter((f) => !shared.includes(f));
    const onlyPatrik = patrik.filter((f) => !shared.includes(f));
    const cat = linn[0]?.category ?? patrik[0]?.category;
    const alsoBothAllowed = shared.length
      ? []
      : [...linn, ...patrik].filter((f, i, a) => a.indexOf(f) === i && f.comparisonStatus === 'BOTH_ALLOWED');
    // om inget gemensamt: visa vilka i samma kategori som båda faktiskt får äta
    const sameCat = shared.length || !cat ? [] : FOODS.filter((f) => f.category === cat && f.comparisonStatus === 'BOTH_ALLOWED' && f.alcatName);
    named = { label: n.label, linn, patrik, shared, onlyLinn, onlyPatrik, alsoBothAllowed: alsoBothAllowed.length ? alsoBothAllowed : sameCat };
  }
  const categories = CATEGORY_OF_DAY[day].map((c) => ({
    ...c,
    shared: FOODS.filter((f) => f.category === c.category && f.comparisonStatus === 'BOTH_ALLOWED'),
  }));
  const text = META.people.linn.plan.week[day].text + META.people.patrik.plan.week[day].text;
  return { named, categories, crispbread: /knäckebröd/i.test(text) };
}
