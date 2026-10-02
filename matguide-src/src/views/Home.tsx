import { useState } from 'react';
import { COMPARISON, ComparisonStatus, FOODS, byComparison, searchFoods } from '../lib/data';
import { FoodQuickCard } from '../components/FoodCard';
import { SearchInput, href } from '../components/ui';

const EXAMPLES = ['kyckling', 'ris', 'tomat', 'avokado', 'lax', 'kaffe'];
const MAIN: ComparisonStatus[] = ['BOTH_ALLOWED', 'LINN_ONLY', 'PATRIK_ONLY', 'BOTH_AVOID'];

export function Home() {
  const [q, setQ] = useState('');
  const results = q.trim() ? searchFoods(q).slice(0, 8) : [];
  const total = searchFoods(q).length;

  return (
    <div className="home">
      <header className="hero">
        <p className="hero-names">Re:Set by Sanna</p>
        <h1>Linn + Patrik</h1>
        <p className="hero-sub">Matguide · dag 1–21</p>
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
          <nav className="main-choices" aria-label="Huvudval">
            {MAIN.map((s) => {
              const c = COMPARISON[s];
              const n = byComparison(s).length;
              return (
                <a key={s} href={href(c.route)} className={`choice tone-${c.tone} ${s === 'BOTH_ALLOWED' ? 'choice-primary' : ''}`}>
                  <span className="choice-sym" aria-hidden="true">{c.symbol}</span>
                  <span className="choice-label">{c.label}</span>
                  <span className="choice-count">{n} <span className="sr-only">livsmedel</span></span>
                </a>
              );
            })}
          </nav>

          <a className="restore-entry" href={href('restore')}>
            <span className="re-name">Re:store <span>by Sanna</span></span>
            <span className="re-text">21-dagars kostprotokoll med matlista och färdiga måltider</span>
            <span className="chev" aria-hidden="true">›</span>
          </a>

          <nav className="secondary" aria-label="Fler verktyg">
            <a href={href('kan-vi-ata')}><span aria-hidden="true">🍽</span> Kan vi äta detta?</a>
            <a href={href('skillnader')}><span aria-hidden="true">⇄</span> Skillnader</a>
            <a href={href('veckoschema')}><span aria-hidden="true">▦</span> Veckoschema</a>
            <a href={href('tabell')}><span aria-hidden="true">≡</span> Alla livsmedel</a>
            <a href={href('person', 'linn')}>Linn</a>
            <a href={href('person', 'patrik')}>Patrik</a>
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
