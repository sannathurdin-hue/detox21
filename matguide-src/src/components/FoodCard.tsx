import { ALCAT_STATUS_TEXT, COMPARISON, Food, PERSON_NAME, PersonKey, sourceLabel } from '../lib/data';
import { ComparisonBadge, StatusBadge, href, shortReason } from './ui';
import { RestoreBadge } from '../views/Restore';
import { mealsUsing } from '../lib/restore';

const PLAN_TEXT: Record<string, string> = {
  NO_RULE: 'Ingen särskild regel',
  FORBIDDEN: 'Förbjuden under perioden',
  EXPLICITLY_ALLOWED: 'Uttryckligen tillåten',
  CONDITIONAL: 'Tillåten med villkor',
  NOT_LISTED_AS_ALLOWED_DRINK: 'Inte bland tillåtna drycker',
  AMBIGUOUS: 'Tvetydig formulering',
  UNSPECIFIED: 'Nämns, men sort anges inte',
};

/** Snabbt sökresultat: slutsats + båda personerna med kort orsak */
export function FoodQuickCard({ food }: { food: Food }) {
  return (
    <a className={`quick-card qc-${COMPARISON[food.comparisonStatus].tone}`} href={href('livsmedel', food.id)}>
      <div className="qc-head">
        <h3>{food.displayName}</h3>
        <span className="qc-cat">{food.category}</span>
      </div>
      <dl className="qc-people">
        {(['linn', 'patrik'] as PersonKey[]).map((w) => (
          <div key={w} className="qc-person">
            <dt>{PERSON_NAME[w]}</dt>
            <dd>
              <StatusBadge status={food[w].finalStatusDay1To21} size="sm" />
              <span className="qc-reason">{shortReason(food, w)}</span>
            </dd>
          </div>
        ))}
      </dl>
      <div className="qc-verdict"><ComparisonBadge status={food.comparisonStatus} /></div>
    </a>
  );
}

function PersonDetail({ food, who }: { food: Food; who: PersonKey }) {
  const p = food[who];
  return (
    <section className="person-detail" aria-labelledby={`pd-${who}`}>
      <div className="pd-head">
        <h2 id={`pd-${who}`}>{PERSON_NAME[who]}</h2>
        <StatusBadge status={p.finalStatusDay1To21} size="lg" />
      </div>
      <dl className="facts">
        <div><dt>ALCAT</dt><dd>{p.alcatStatus === 'DERIVED' ? p.alcatLabel : ALCAT_STATUS_TEXT[p.alcatStatus] ?? p.alcatLabel}</dd></div>
        <div><dt>Kostschema dag 1–21</dt><dd>{PLAN_TEXT[p.dietPlanStatusDay1To21] ?? p.dietPlanStatusDay1To21}</dd></div>
        <div><dt>Slutstatus dag 1–21</dt><dd><strong>{shortReason(food, who)}</strong></dd></div>
        {p.restrictionDuration && <div><dt>Varaktighet</dt><dd>{p.restrictionDuration}</dd></div>}
        {p.rotationDays && <div><dt>ALCAT-rotation</dt><dd>Dag {p.rotationDays.join(' & ')} i 4-dagarsrotationen</dd></div>}
      </dl>

      {p.reasons.length > 0 && (
        <ul className="reasons">
          {p.reasons.map((r, i) => (
            <li key={i} className={`reason reason-${r.type}`}>
              <span aria-hidden="true">{r.type === 'avoid' ? '✕' : r.type === 'allow' ? '✓' : 'i'}</span>
              <span>{r.text}</span>
            </li>
          ))}
        </ul>
      )}
      {p.restriction && p.finalStatusDay1To21 !== 'AVOID' && <p className="restriction"><span aria-hidden="true">! </span>{p.restriction}</p>}
      {p.notes.map((n, i) => <p key={i} className="note">{n}</p>)}

      <details className="sources" open>
        <summary>Källor ({p.sources.length})</summary>
        {p.sources.length === 0 ? (
          <p className="note">Livsmedlet finns inte i {PERSON_NAME[who]}s underlag. Därför: Ej verifierat.</p>
        ) : (
          <ol>
            {p.sources.map((s, i) => (
              <li key={i}>
                <span className={`src-kind src-${s.kind === 'ALCAT' ? 'alcat' : s.kind === 'KOSTSCHEMA' ? 'plan' : 'user'}`}>{s.kind === 'ALCAT' ? 'ALCAT' : s.kind === 'KOSTSCHEMA' ? 'Kostschema' : 'Användarbeslut'}</span>
                <span className="src-doc">{sourceLabel(s)}</span>
                <q>{s.text}</q>
              </li>
            ))}
          </ol>
        )}
      </details>
    </section>
  );
}

export function FoodDetail({ food }: { food: Food }) {
  const c = COMPARISON[food.comparisonStatus];
  return (
    <article className="detail">
      <header className="page-header">
        <a className="back" href="#/" onClick={(e) => { if (history.length > 1) { e.preventDefault(); history.back(); } }}>‹ Tillbaka</a>
        <p className="eyebrow">{food.category}</p>
        <h1>{food.displayName}</h1>
      </header>
      <div className={`verdict verdict-${c.tone}`}>
        <span className="verdict-label">Slutsats dag 1–21</span>
        <ComparisonBadge status={food.comparisonStatus} size="lg" />
      </div>
      <div className={`verdict verdict-restore verdict-${food.restoreStatus === 'ALLOWED_FOR_BOTH' ? 'green' : food.restoreStatus === 'NOT_ALLOWED_FOR_BOTH' ? 'red' : food.restoreStatus === 'DATA_CONFLICT' ? 'amber' : 'grey'}`}>
        <span className="verdict-label">Re:store by Sanna</span>
        <RestoreBadge status={food.restoreStatus} size="lg" />
      </div>
      {mealsUsing(food.id).length > 0 && (
        <p className="note">Används i 21-dagarsplanen: {mealsUsing(food.id).map((m, i) => (
          <span key={m.id}>{i ? ', ' : ''}<a href={href('restore', 'maltid', m.id)}>{m.title}</a></span>
        ))}</p>
      )}
      {food.notes.map((n, i) => <p key={i} className="note note-global">{n}</p>)}
      <h2 className="why-title">Varför? Linn och Patrik var för sig</h2>
      <div className="detail-grid">
        <PersonDetail food={food} who="linn" />
        <PersonDetail food={food} who="patrik" />
      </div>
    </article>
  );
}
