import { useState } from 'react';
import { COMPARISON, ComparisonStatus, FOODS, byComparison, searchFoods } from '../lib/data';
import { FoodQuickCard } from '../components/FoodCard';
import { SearchInput, Wordmark, href } from '../components/ui';

const EXAMPLES = ['kyckling', 'ris', 'tomat', 'avokado', 'lax', 'kaffe'];
const MAIN: ComparisonStatus[] = ['BOTH_ALLOWED', 'LINN_ONLY', 'PATRIK_ONLY', 'BOTH_AVOID'];

export function Home() {
  const [q, setQ] = useState('');
  const results = q.trim() ? searchFoods(q).slice(0, 8) : [];
  const total = searchFoods(q).length;

  return (
    <div className="home">
      <header className="hero">
        <p className="eyebrow">Matguide · dag 1–21</p>
        <h1 className="display">Linn <span className="amp">+</span> Patrik</h1>
        <p className="hero-sub">Två individuella underlag, ett svar per livsmedel.</p>
      </header>

      <SearchInput value={q} onChange={setQ} large />
      {!q && (
        <p className="examples">
          Till exempel:{' '}
          {EXAMPLES.map((e, i) => (
            <span key={e}>
              <button type="button" className="link" onClick={() => setQ(e)}>{e}</button>
              {i < EXAMPLES.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}

      {q.trim() && (
        <section aria-live="polite" className="search-results">
          {results.length === 0 ? (
            <div className="quick-card qc-grey">
              <h3>{q}</h3>
              <p><strong>? Ej verifierat i underlaget</strong></p>
              <p className="note">Livsmedlet finns inte i Linns eller Patriks ALCAT-rapport eller kostschema. Systemet gissar inte – behandla det som ej verifierat.</p>
            </div>
          ) : (
            <>
              {results.map((f) => <FoodQuickCard key={f.id} food={f} />)}
              {total > results.length && (
                <a className="more" href={`${href('tabell')}?q=${encodeURIComponent(q)}`}>Visa alla {total} träffar i tabellen ›</a>
              )}
            </>
          )}
        </section>
      )}

      {!q.trim() && (
        <>
          <nav className="index-list" aria-label="Huvudval">
            {MAIN.map((s) => {
              const c = COMPARISON[s];
              const n = byComparison(s).length;
              return (
                <a key={s} href={href(c.route)} className={`index-row tone-${c.tone} ${s === 'BOTH_ALLOWED' ? 'index-primary' : ''}`}>
                  <span className="ix-count">{n} <span className="sr-only">livsmedel</span></span>
                  <span className="ix-label">{c.label}</span>
                  <span className="ix-sym" aria-hidden="true">{c.symbol}</span>
                  <span className="ix-arrow" aria-hidden="true">→</span>
                </a>
              );
            })}
          </nav>

          <a className="restore-entry" href={href('restore')}>
            <span className="re-kicker">Protokoll</span>
            <Wordmark product="store" size="lg" />
            <span className="re-text">21-dagars kostprotokoll. Plan, måltider, livsmedel.</span>
            <span className="ix-arrow" aria-hidden="true">→</span>
          </a>

          <nav className="link-list" aria-label="Fler verktyg">
            <a href={href('kan-vi-ata')}>Kan vi äta detta?<span aria-hidden="true">→</span></a>
            <a href={href('skillnader')}>Skillnader<span aria-hidden="true">→</span></a>
            <a href={href('veckoschema')}>Veckoschema<span aria-hidden="true">→</span></a>
            <a href={href('tabell')}>Alla livsmedel<span aria-hidden="true">→</span></a>
            <a href={href('person', 'linn')}>Linn<span aria-hidden="true">→</span></a>
            <a href={href('person', 'patrik')}>Patrik<span aria-hidden="true">→</span></a>
          </nav>

          <p className="footnote">
            {FOODS.length} livsmedel från ALCAT + kostscheman ·{' '}
            <a href={href('ej-verifierat')}>{byComparison('UNVERIFIED').length} ej verifierade</a> ·{' '}
            <a href={href('konflikt')}>{byComparison('DATA_CONFLICT').length} datakonflikter</a> ·{' '}
            <a href={href('underlag')}>Om underlaget</a>
          </p>
        </>
      )}
    </div>
  );
}
