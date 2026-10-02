// PUBLIC PRODUCT LAYER – Re:store by Sanna
// Läser ENDAST restore-public.json (genereras av scripts/build-restore.mjs).
// Inga källprofiler, namn eller individuella statusar finns här – och ska aldrig importeras hit.
import pub from '../data/restore-public.json';
import type { Tone } from './data';
import { norm } from './data';

export type RestoreStatus = 'ALLOWED_FOR_BOTH' | 'NOT_ALLOWED_FOR_BOTH' | 'UNVERIFIED' | 'DATA_CONFLICT';
export interface PublicFood {
  id: string; name: string; normalizedName: string; aliases: string[]; category: string;
  status: RestoreStatus; reason: string; use: { slot: string; days: number[] }[];
}
export interface PublicMeal {
  id: string; title: string; method: string; slot: string; usedOnDays: number[];
  ingredients: { id: string; role: string; note: string | null }[];
  status: 'VALIDATED' | 'UNDER_REVIEW';
}
export interface PublicDay {
  day: number; week: number; weekday: string; meals: Record<string, string>; drinks: string[];
  status: 'VALIDATED' | 'UNDER_REVIEW';
}
export interface PublicSlot { key: string; label: string; time: string; text: string }

const P = pub as unknown as {
  slots: PublicSlot[];
  structure: Record<string, { theme: string; text: string; label: string }>;
  rules: string[];
  foods: PublicFood[];
  meals: PublicMeal[];
  days: PublicDay[];
};

export const R_SLOTS = P.slots;
export const R_STRUCTURE = P.structure;
export const R_RULES = P.rules;
export const R_FOODS = P.foods;
export const R_FOOD: Record<string, PublicFood> = Object.fromEntries(P.foods.map((f) => [f.id, f]));
export const R_MEALS = P.meals;
export const R_MEAL: Record<string, PublicMeal> = Object.fromEntries(P.meals.map((m) => [m.id, m]));
export const R_DAYS = P.days;
export const R_INCLUDED = P.foods.filter((f) => f.status === 'ALLOWED_FOR_BOTH');

export const R_CATEGORIES = [
  'Grönsaker', 'Baljväxter', 'Frukt', 'Protein', 'Fisk & skaldjur', 'Spannmål & stärkelse',
  'Nötter & frön', 'Kryddor & örter', 'Fett & oljor', 'Drycker', 'Övrigt',
];

export const R_STATUS: Record<RestoreStatus, { label: string; long: string; symbol: string; tone: Tone }> = {
  ALLOWED_FOR_BOTH: { label: 'Ingår i Re:store', long: 'INGÅR I RE:STORE', symbol: '✓', tone: 'green' },
  NOT_ALLOWED_FOR_BOTH: { label: 'Ingår inte', long: 'INGÅR INTE I RE:STORE', symbol: '✕', tone: 'red' },
  UNVERIFIED: { label: 'Ej verifierat', long: 'EJ VERIFIERAT', symbol: '?', tone: 'grey' },
  DATA_CONFLICT: { label: 'Under utredning', long: 'UNDER UTREDNING', symbol: '?', tone: 'grey' },
};

export const WEEKDAY: Record<string, string> = {
  mon: 'Måndag', tue: 'Tisdag', wed: 'Onsdag', thu: 'Torsdag', fri: 'Fredag', sat: 'Lördag', sun: 'Söndag',
};

export function rSearch(q: string, pool: PublicFood[] = R_FOODS): PublicFood[] {
  const n = norm(q);
  if (!n) return pool;
  const score = (f: PublicFood) => {
    const name = norm(f.name), base = norm(f.normalizedName), al = f.aliases.map(norm);
    if (name === n || base === n) return 100;
    if (al.includes(n)) return 90;
    if (name.startsWith(n) || base.startsWith(n)) return 80;
    if (al.some((a) => a.startsWith(n))) return 60;
    if (name.split(/[\s/()-]+/).some((w) => w.startsWith(n))) return 50;
    if (name.includes(n)) return 40;
    if (al.some((a) => a.includes(n))) return 30;
    return 0;
  };
  return pool.map((f) => [f, score(f)] as const).filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || a[0].name.localeCompare(b[0].name, 'sv')).map(([f]) => f);
}

export function rGroup(foods: PublicFood[]): [string, PublicFood[]][] {
  return R_CATEGORIES.map((c) => [c, foods.filter((f) => f.category === c)] as [string, PublicFood[]]).filter(([, l]) => l.length);
}

/** "Fungerar detta i Re:store?" – bygger enbart på Re:store-status */
export function rCheck(foods: PublicFood[], unknown: string[] = []) {
  const notIncluded = foods.filter((f) => f.status === 'NOT_ALLOWED_FOR_BOTH');
  const unclear = foods.filter((f) => f.status === 'UNVERIFIED' || f.status === 'DATA_CONFLICT');
  if (!foods.length && !unknown.length) return { verdict: 'EMPTY' as const, notIncluded, unclear };
  const verdict = notIncluded.length ? 'NO' as const : unclear.length || unknown.length ? 'UNCLEAR' as const : 'YES' as const;
  return { verdict, notIncluded, unclear };
}

export function daysForToday(date = new Date()): PublicDay[] {
  const wd = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
  return R_DAYS.filter((d) => d.weekday === wd);
}

export const SLOT_LABEL: Record<string, string> = Object.fromEntries(R_SLOTS.map((s) => [s.key, s.label]));
export const ROLE_LABEL: Record<string, string> = {
  base: 'Huvudkomponent', cooked: 'Tillagad grönsak', salad: 'Färsk sallad', seasoning: 'Smaksättning', liquid: 'Vätska',
  fruit: 'Frukt', spread: 'Pålägg', veg: 'Grönsak',
};
