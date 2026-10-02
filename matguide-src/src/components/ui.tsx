import { ReactNode, useEffect, useState } from 'react';
import {
  COMPARISON, ComparisonStatus, FinalStatus, Food, PERSON_NAME, PersonKey, STATUS_SYMBOL, STATUS_TEXT, STATUS_TONE, Tone,
} from '../lib/data';

// ---------------------------------------------------------------------------
// Hash-routing (fungerar på all statisk hosting utan serverkonfiguration)
export function useRoute(): string[] {
  const read = () => decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).split('?')[0].split('/').filter(Boolean);
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
export const href = (...parts: string[]) => `#/${parts.map(encodeURIComponent).join('/')}`;

// ---------------------------------------------------------------------------
/** Ordmärke för Re:-familjen: "Re" i sans, kolon i accent, produktnamnet i serif. */
export function Wordmark({ product, size = 'md', by = true }: { product: string; size?: 'sm' | 'md' | 'lg' | 'xl'; by?: boolean }) {
  return (
    <span className={`wm wm-${size}`}>
      <span className="wm-mark"><span className="wm-re">Re</span><span className="wm-colon">:</span><span className="wm-name">{product}</span></span>
      {by && <span className="wm-by">by Sanna</span>}
    </span>
  );
}

// ---------------------------------------------------------------------------
export function Badge({ tone, symbol, children, size = 'md' }: { tone: Tone; symbol: string; children: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span className={`badge tone-${tone} badge-${size}`}>
      <span className="badge-sym" aria-hidden="true">{symbol}</span>
      <span>{children}</span>
    </span>
  );
}

export function StatusBadge({ status, size }: { status: FinalStatus; size?: 'sm' | 'md' | 'lg' }) {
  return <Badge tone={STATUS_TONE[status]} symbol={STATUS_SYMBOL[status]} size={size}>{STATUS_TEXT[status]}</Badge>;
}

export function ComparisonBadge({ status, size }: { status: ComparisonStatus; size?: 'sm' | 'md' | 'lg' }) {
  const c = COMPARISON[status];
  return <Badge tone={c.tone} symbol={c.symbol} size={size}>{c.label}</Badge>;
}

/** Kompakt symbol (används i tabeller) – alltid med skärmläsartext */
export function StatusMark({ status, who }: { status: FinalStatus; who?: PersonKey }) {
  return (
    <span className={`mark tone-${STATUS_TONE[status]}`} title={STATUS_TEXT[status]}>
      <span aria-hidden="true">{STATUS_SYMBOL[status]}</span>
      <span className="sr-only">{who ? `${PERSON_NAME[who]}: ` : ''}{STATUS_TEXT[status]}</span>
    </span>
  );
}

/** Kort förklaring till en persons status – samma text i alla vyer */
export function shortReason(f: Food, who: PersonKey): string {
  const p = f[who];
  switch (p.finalStatusDay1To21) {
    case 'ALLOWED':
      if (p.alcatStatus === 'NONE' && p.dietPlanStatusDay1To21 === 'NO_RULE') return 'Grön i ALCAT';
      if (!p.sources.some((x) => x.kind === 'KOSTSCHEMA') && p.sources.some((x) => x.kind === 'ANVÄNDARBESLUT')) {
        return p.alcatStatus === 'NONE' ? 'Grön i ALCAT' : 'Godkänt genom användarbeslut';
      }
      return p.dietPlanStatusDay1To21 === 'EXPLICITLY_ALLOWED' ? 'Står i kostschemat' : 'Grön i ALCAT';
    case 'AVOID': {
      if (['SEVERE', 'MODERATE', 'MILD'].includes(p.alcatStatus)) {
        const t = { SEVERE: 'Allvarlig reaktion', MODERATE: 'Måttlig reaktion', MILD: 'Mild reaktion' }[p.alcatStatus as 'SEVERE'];
        return p.dietPlanStatusDay1To21 === 'FORBIDDEN' ? `${t} + kostregel` : t;
      }
      if (p.alcatStatus === 'ELIMINATE') return p.dietPlanStatusDay1To21 === 'FORBIDDEN' ? 'Eliminera (ALCAT) + kostregel' : 'Ska elimineras (ALCAT)';
      if (p.dietPlanStatusDay1To21 === 'FORBIDDEN') return p.alcatStatus === 'NONE' ? 'Grön i ALCAT – men förbjuden i kostschemat' : 'Förbjuden i kostschemat';
      if (p.alcatStatus === 'DERIVED') return 'Innehåller råvara med reaktion';
      return 'Undvik';
    }
    case 'RESTRICTED':
      return 'Villkorad – se detaljer';
    case 'DATA_CONFLICT':
      return 'Motstridiga uppgifter';
    case 'UNVERIFIED':
      if (p.alcatStatus === 'NOT_TESTED') return 'Ej testad / ej nämnd';
      if (p.dietPlanStatusDay1To21 === 'NOT_LISTED_AS_ALLOWED_DRINK') return 'Ej bland tillåtna drycker';
      return 'Underlaget räcker inte';
  }
}

export function FoodRow({ food, showComparison = true }: { food: Food; showComparison?: boolean }) {
  return (
    <a className="food-row" href={href('livsmedel', food.id)}>
      <span className="food-row-name">{food.displayName}</span>
      <span className="food-row-people">
        {(['linn', 'patrik'] as PersonKey[]).map((w) => (
          <span key={w} className="food-row-person">
            <span className="who" aria-hidden="true">{PERSON_NAME[w][0]}</span>
            <StatusMark status={food[w].finalStatusDay1To21} who={w} />
          </span>
        ))}
        {showComparison && <span className="sr-only">{COMPARISON[food.comparisonStatus].label}</span>}
      </span>
      <span className="chev" aria-hidden="true">›</span>
    </a>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Sök ett livsmedel…', autoFocus, large, label = 'Sök livsmedel' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean; large?: boolean; label?: string;
}) {
  return (
    <div className={`search ${large ? 'search-lg' : ''}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      <input
        type="search"
        aria-label={label}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="search-clear" aria-label="Rensa sökning" onClick={() => onChange('')}>×</button>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, back = true }: { title: ReactNode; subtitle?: ReactNode; back?: boolean }) {
  return (
    <header className="page-header">
      {back && <a className="back" href="#/">‹ Start</a>}
      <h1>{title}</h1>
      {subtitle && <p className="lede">{subtitle}</p>}
    </header>
  );
}

export function Chips<T extends string>({ options, value, onChange, label }: {
  options: { value: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; label: string;
}) {
  return (
    <div className="chips" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" className={`chip ${value === o.value ? 'chip-on' : ''}`} aria-pressed={value === o.value} onClick={() => onChange(o.value)}>
          {o.label}{o.count !== undefined && <span className="chip-count">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
