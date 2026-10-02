import restoreJson from '../data/restore.json';
import { FOODS, FOOD_BY_ID, Food, META, RestoreStatus, Tone, analyzeIngredients } from './data';

export interface RestoreIngredient { id: string; role: string; note?: string; alt?: string[] }
export interface RestoreMeal {
  id: string;
  slot: string;
  title: string;
  method: string;
  ingredients: RestoreIngredient[];
  proposal?: boolean;
  usedOnDays: number[];
}
export interface Slot { key: string; label: string; linn: string; patrik: string; linnText: string; patrikText: string; shared: string }
export interface Check { ok: boolean; text: string }
export interface IngredientCheck { id: string; name: string; ok: boolean; linn: string; patrik: string; reason: string; role: string; note: string | null }
export interface MealValidation { slot: string; mealId: string; pass: boolean; ingredients: IngredientCheck[]; structure: Check[]; ingredientsPass: boolean; structurePass: boolean }
export interface DayValidation { day: number; weekday: string; pass: boolean; meals: MealValidation[]; checks: Check[]; failReasons?: string[]; blockedBySource?: boolean }
export interface RestoreDay {
  day: number; week: number; weekday: string;
  meals: Record<string, string>;
  drinks: { title: string; ingredients: string[] }[];
  validation: DayValidation;
}
export interface DayRule { theme: string; label: string; linn: string; patrik: string; sharedBase: string[] }
export interface Gap { id: string; title: string; affects: string; text: string; decision: string }

const R = restoreJson as unknown as {
  slots: Slot[];
  dayRules: Record<string, DayRule>;
  meals: RestoreMeal[];
  drinks: { title: string; ingredients: string[] }[];
  days: RestoreDay[];
  gaps: Gap[];
  decisions: { id: string; title: string; text: string; resolution: string }[];
  summary: { pass: number; total: number; blocked: number[] };
};

export const SLOTS = R.slots;
export const DAY_RULES = R.dayRules;
export const RESTORE_MEALS = R.meals;
export const MEAL_BY_ID: Record<string, RestoreMeal> = Object.fromEntries(R.meals.map((m) => [m.id, m]));
export const RESTORE_DAYS = R.days;
export const RESTORE_GAPS = R.gaps;
export const RESTORE_DECISIONS = R.decisions;
export const RESTORE_SUMMARY = R.summary;

export interface ConflictSource { document: string; page: number | null; text: string; says: string }
export interface Conflict {
  status: 'OPEN' | 'RESOLVED'; foodId: string; food: string; person: 'linn' | 'patrik';
  sourceA: ConflictSource | null; sourceB: ConflictSource | null; effect: string; resolution?: string;
}
export const CONFLICTS = (META as unknown as { conflicts: Conflict[] }).conflicts;
export const RESOLVED_CONFLICTS = (META as unknown as { resolvedConflicts: Conflict[] }).resolvedConflicts;

export const RESTORE_FOODS = FOODS.filter((f) => f.restoreStatus === 'ALLOWED_FOR_BOTH');
export const byRestore = (s: RestoreStatus): Food[] => FOODS.filter((f) => f.restoreStatus === s);

export const RESTORE_LABEL: Record<RestoreStatus, { label: string; symbol: string; tone: Tone }> = {
  ALLOWED_FOR_BOTH: { label: 'Tillåten för båda', symbol: '✓', tone: 'green' },
  NOT_ALLOWED_FOR_BOTH: { label: 'Ingår inte', symbol: '✕', tone: 'red' },
  UNVERIFIED: { label: 'Ej verifierat', symbol: '?', tone: 'grey' },
  DATA_CONFLICT: { label: 'Datakonflikt', symbol: '⚠', tone: 'amber' },
};

export const WEEKDAY_LABEL: Record<string, string> = {
  mon: 'Måndag', tue: 'Tisdag', wed: 'Onsdag', thu: 'Torsdag', fri: 'Fredag', sat: 'Lördag', sun: 'Söndag',
};

/** Vilka dagar i planen motsvarar dagens veckodag (dag 1 = måndag) */
export function daysForToday(date = new Date()): RestoreDay[] {
  const wd = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
  return RESTORE_DAYS.filter((d) => d.weekday === wd);
}

export function mealFoods(m: RestoreMeal): Food[] {
  return m.ingredients.map((i) => FOOD_BY_ID[i.id]);
}

/** Måltider i planen som använder ett livsmedel */
export function mealsUsing(foodId: string): RestoreMeal[] {
  return RESTORE_MEALS.filter((m) => m.ingredients.some((i) => i.id === foodId || (i.alt || []).includes(foodId)) && m.usedOnDays.length);
}

export { analyzeIngredients };
