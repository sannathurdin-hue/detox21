import foodsJson from '../data/foods.json';
import metaJson from '../data/meta.json';

export type PersonKey = 'linn' | 'patrik';
export const PEOPLE: PersonKey[] = ['linn', 'patrik'];

export type FinalStatus = 'ALLOWED' | 'AVOID' | 'RESTRICTED' | 'UNVERIFIED' | 'DATA_CONFLICT';
export type ComparisonStatus =
  | 'BOTH_ALLOWED'
  | 'LINN_ONLY'
  | 'PATRIK_ONLY'
  | 'BOTH_AVOID'
  | 'DIFFERENT_RESTRICTION'
  | 'UNVERIFIED'
  | 'DATA_CONFLICT';

export interface Source {
  kind: 'ALCAT' | 'KOSTSCHEMA' | 'ANVÄNDARBESLUT';
  document: string;
  page: number | null;
  text: string;
}
export interface Reason {
  type: 'avoid' | 'allow' | 'info';
  text: string;
  duration?: string | null;
}
export interface PersonFood {
  alcatStatus: string;
  alcatLabel: string;
  dietPlanStatusDay1To21: string;
  protocolStatus: string;
  finalStatusDay1To21: FinalStatus;
  restriction: string | null;
  restrictionDuration: string | null;
  sourceDocument: string | null;
  sourcePage: number | null;
  sourceText: string | null;
  sources: Source[];
  reasons: Reason[];
  notes: string[];
  rotationDays: number[] | null;
}
export interface Food {
  id: string;
  displayName: string;
  normalizedName: string;
  category: string;
  aliases: string[];
  alcatName: string | null;
  components: string[];
  notes: string[];
  linn: PersonFood;
  patrik: PersonFood;
  comparisonStatus: ComparisonStatus;
  restoreStatus: RestoreStatus;
}
export type RestoreStatus = 'ALLOWED_FOR_BOTH' | 'NOT_ALLOWED_FOR_BOTH' | 'UNVERIFIED' | 'DATA_CONFLICT';

export interface Meal { time: string; name: string; text: string; page: number }
export interface DayRule { theme: string | null; text: string; page: number }
export interface PlanNote { text: string; page: number }
export interface PersonMeta {
  name: string;
  short: string;
  alcat: {
    provdatum: string;
    svarsdatum: string;
    labId: string;
    document: string;
    markers: Record<string, string>;
    eliminate: Record<string, string[]>;
    printedItems: number;
  };
  plan: {
    document: string;
    header: { quote: string; page: number };
    meals: Meal[];
    week: Record<WeekDay, DayRule>;
    notes: PlanNote[];
  };
  rotation: Record<string, string[]>;
}
export type WeekDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export const FOODS = foodsJson as unknown as Food[];
export const META = metaJson as unknown as {
  people: Record<PersonKey, PersonMeta>;
  alcatLevels: Record<string, { label: string; text: string; duration: string | null }>;
  categories: string[];
};
export const CATEGORIES = META.categories;
export const FOOD_BY_ID: Record<string, Food> = Object.fromEntries(FOODS.map((f) => [f.id, f]));

export const PERSON_NAME: Record<PersonKey, string> = { linn: 'Linn', patrik: 'Patrik' };

export function byComparison(status: ComparisonStatus): Food[] {
  return FOODS.filter((f) => f.comparisonStatus === status);
}

export function groupByCategory(foods: Food[]): [string, Food[]][] {
  return CATEGORIES.map((c) => [c, foods.filter((f) => f.category === c)] as [string, Food[]]).filter(([, l]) => l.length);
}

// ---------------------------------------------------------------------------
// Sökning – samma funktion används överallt så att resultaten alltid är konsekventa.
// Å, ä och ö behålls (olika bokstäver på svenska); é/ñ normaliseras.
export function norm(s: string): string {
  return s.toLowerCase().normalize('NFC').replace(/é/g, 'e').replace(/ñ/g, 'n').replace(/\s+/g, ' ').trim();
}

export function searchScore(f: Food, q: string): number {
  const n = norm(q);
  if (!n) return 0;
  const name = norm(f.displayName);
  const base = norm(f.normalizedName);
  const aliases = f.aliases.map(norm);
  if (name === n || base === n) return 100;
  if (aliases.includes(n)) return 90;
  if (name.startsWith(n) || base.startsWith(n)) return 80;
  if (aliases.some((a) => a.startsWith(n))) return 60;
  if (name.split(/[\s/()-]+/).some((w) => w.startsWith(n))) return 50;
  if (name.includes(n)) return 40;
  if (aliases.some((a) => a.includes(n))) return 30;
  return 0;
}

export function searchFoods(q: string, pool: Food[] = FOODS): Food[] {
  if (!norm(q)) return pool;
  return pool
    .map((f) => [f, searchScore(f, q)] as const)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1] || a[0].displayName.localeCompare(b[0].displayName, 'sv'))
    .map(([f]) => f);
}

// ---------------------------------------------------------------------------
// "Kan vi äta detta?" – analys av flera ingredienser
export type CheckVerdict = 'BOTH' | 'NOT_SHARED' | 'CANNOT_VERIFY' | 'EMPTY';
export interface CheckResult {
  verdict: CheckVerdict;
  problems: { food: Food; text: string }[];
  unverified: { food: Food; text: string }[];
}

export function analyzeIngredients(foods: Food[]): CheckResult {
  if (!foods.length) return { verdict: 'EMPTY', problems: [], unverified: [] };
  const problems: CheckResult['problems'] = [];
  const unverified: CheckResult['unverified'] = [];
  const label = (s: FinalStatus) => STATUS_TEXT[s].toLowerCase();
  for (const f of foods) {
    const l = f.linn.finalStatusDay1To21;
    const p = f.patrik.finalStatusDay1To21;
    if (l === 'ALLOWED' && p === 'ALLOWED') continue;
    const blocking = (['AVOID', 'RESTRICTED'] as FinalStatus[]);
    if (blocking.includes(l) || blocking.includes(p)) {
      const who: string[] = [];
      if (l === 'ALLOWED') who.push('tillåten för Linn');
      if (p === 'ALLOWED') who.push('tillåten för Patrik');
      if (blocking.includes(l)) who.push(`Linn: ${label(l)}`);
      if (blocking.includes(p)) who.push(`Patrik: ${label(p)}`);
      problems.push({ food: f, text: who.join(' · ') });
    }
    if (['UNVERIFIED', 'DATA_CONFLICT'].includes(l) || ['UNVERIFIED', 'DATA_CONFLICT'].includes(p)) {
      const who: string[] = [];
      if (['UNVERIFIED', 'DATA_CONFLICT'].includes(l)) who.push(`Linn: ${label(l)}`);
      if (['UNVERIFIED', 'DATA_CONFLICT'].includes(p)) who.push(`Patrik: ${label(p)}`);
      unverified.push({ food: f, text: who.join(' · ') });
    }
  }
  const verdict: CheckVerdict = problems.length ? 'NOT_SHARED' : unverified.length ? 'CANNOT_VERIFY' : 'BOTH';
  return { verdict, problems, unverified };
}

// ---------------------------------------------------------------------------
export const STATUS_TEXT: Record<FinalStatus, string> = {
  ALLOWED: 'Tillåten',
  AVOID: 'Undvik',
  RESTRICTED: 'Villkorad',
  UNVERIFIED: 'Ej verifierat',
  DATA_CONFLICT: 'Datakonflikt',
};
export const STATUS_SYMBOL: Record<FinalStatus, string> = {
  ALLOWED: '✓',
  AVOID: '✕',
  RESTRICTED: '!',
  UNVERIFIED: '?',
  DATA_CONFLICT: '!',
};
export const STATUS_TONE: Record<FinalStatus, Tone> = {
  ALLOWED: 'green',
  AVOID: 'red',
  RESTRICTED: 'amber',
  UNVERIFIED: 'grey',
  DATA_CONFLICT: 'amber',
};
export type Tone = 'green' | 'red' | 'amber' | 'grey';

export const COMPARISON: Record<ComparisonStatus, { label: string; short: string; symbol: string; tone: Tone; route: string }> = {
  BOTH_ALLOWED: { label: 'Båda kan äta', short: 'Båda', symbol: '✓', tone: 'green', route: 'bada' },
  LINN_ONLY: { label: 'Endast Linn', short: 'Linn', symbol: '!', tone: 'amber', route: 'endast-linn' },
  PATRIK_ONLY: { label: 'Endast Patrik', short: 'Patrik', symbol: '!', tone: 'amber', route: 'endast-patrik' },
  BOTH_AVOID: { label: 'Båda ska undvika', short: 'Ingen', symbol: '✕', tone: 'red', route: 'undvik' },
  DIFFERENT_RESTRICTION: { label: 'Villkorat', short: 'Villkor', symbol: '!', tone: 'amber', route: 'villkorat' },
  UNVERIFIED: { label: 'Ej verifierat', short: '?', symbol: '?', tone: 'grey', route: 'ej-verifierat' },
  DATA_CONFLICT: { label: 'Datakonflikt', short: 'Konflikt', symbol: '!', tone: 'amber', route: 'konflikt' },
};
export const COMPARISON_ORDER: ComparisonStatus[] = [
  'BOTH_ALLOWED', 'LINN_ONLY', 'PATRIK_ONLY', 'BOTH_AVOID', 'DIFFERENT_RESTRICTION', 'UNVERIFIED', 'DATA_CONFLICT',
];

export const ALCAT_STATUS_TEXT: Record<string, string> = {
  SEVERE: 'Allvarlig reaktion',
  MODERATE: 'Måttlig reaktion',
  MILD: 'Mild reaktion',
  NONE: 'Acceptabel / ingen reaktion',
  NOT_TESTED: 'Ej testad',
  CONFLICT: 'Motstridig i rapporten',
  ELIMINATE: 'Ska elimineras (blå ruta)',
  DERIVED: 'Härledd',
};

export function sourceLabel(s: Source): string {
  return s.page ? `${s.document}, sida ${s.page}` : s.document;
}
