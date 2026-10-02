// INTERN granskning (Re:Set-sidan) – källprofiler, konflikter och 21-dagars-QA.
// Får aldrig länkas från den publika Re:store-vyn.
import { PERSON_NAME, PersonKey, sourceLabel } from '../lib/data';
import { CONFLICTS, RESOLVED_CONFLICTS, RESTORE_DAYS, RESTORE_DECISIONS, RESTORE_GAPS, RESTORE_SUMMARY, byRestore } from '../lib/restore';
import { Badge, StatusBadge, href, shortReason } from '../components/ui';

// ---------------------------------------------------------------------------
function SourceBox({ label, s }: { label: string; s: { document: string; page: number | null; text: string; says: string } | null }) {
  if (!s) return null;
  return (
    <div className="src-box">
      <span className="src-kind">{label}</span>
      <span className="src-doc">{sourceLabel({ kind: 'ALCAT', document: s.document, page: s.page, text: s.text })}</span>
      <q>{s.text}</q>
      <strong>Säger: {s.says}</strong>
    </div>
  );
}

export function RestoreInternal() {
  const unverified = byRestore('UNVERIFIED');
  return (
    <div>
      <header className="page-header">
        <a className="back" href="#/underlag">‹ Om underlaget</a>
        <p className="eyebrow">Re:Set · intern granskning</p>
        <h1>Re:store – källgranskning &amp; QA</h1>
        <p className="lede">Intern vy. Visar källprofilerna bakom Re:store, öppna konflikter, luckor och valideringen av alla 21 dagar. Visas inte i Re:store.</p>
      </header>

      <section className="group">
        <h2 className="group-title">21-dagarsvalidering · {RESTORE_SUMMARY.pass}/{RESTORE_SUMMARY.total} PASS</h2>
        <div className="qa-grid">
          {RESTORE_DAYS.map((d) => (
            <a key={d.day} href={href('restore', 'dag', String(d.day))} className={`qa-cell tone-${d.validation.pass ? 'green' : 'amber'}`}>
              <span>Dag {d.day}</span><strong>{d.validation.pass ? 'PASS' : 'FAIL'}</strong>
            </a>
          ))}
        </div>
        <p className="note">PASS = alla ingredienser tillåtna för Linn och Patrik dag 1–21, inga ej verifierade eller konfliktlivsmedel, och dagens gemensamma struktur följs.</p>
      </section>

      <section className="group">
        <h2 className="group-title">Datakonflikter <span className="count">{CONFLICTS.length}</span></h2>
        {CONFLICTS.map((c, k) => (
          <article key={k} className="conflict">
            <h3><a href={href('livsmedel', c.foodId)}>{c.food}</a> · {PERSON_NAME[c.person]}</h3>
            <div className="two-col">
              <SourceBox label="Källa A" s={c.sourceA} />
              <SourceBox label="Källa B" s={c.sourceB} />
            </div>
            <p className="note">{c.effect}</p>
          </article>
        ))}
        {RESOLVED_CONFLICTS.map((c, k) => (
          <article key={`r${k}`} className="conflict conflict-resolved">
            <h3><a href={href('livsmedel', c.foodId)}>{c.food}</a> · {PERSON_NAME[c.person]} · <span className="ok">Löst</span></h3>
            <div className="two-col">
              <SourceBox label="Källa A" s={c.sourceA} />
              <SourceBox label="Källa B" s={c.sourceB} />
            </div>
            <p className="note"><strong>{c.resolution}</strong> {c.effect}</p>
          </article>
        ))}
      </section>

      <section className="group">
        <h2 className="group-title">Användarbeslut <span className="count">{RESTORE_DECISIONS.length}</span></h2>
        {RESTORE_DECISIONS.map((d) => (
          <article key={d.id} className="conflict conflict-resolved">
            <h3>{d.title} · <span className="ok">Beslutat</span></h3>
            <p>{d.text}</p>
            <p className="note"><strong>{d.resolution}</strong></p>
          </article>
        ))}
      </section>

      <section className="group">
        <h2 className="group-title">Luckor i underlaget som påverkar planen <span className="count">{RESTORE_GAPS.length}</span></h2>
        {RESTORE_GAPS.map((g) => (
          <article key={g.id} className="conflict">
            <h3>{g.title}</h3>
            <p className="note"><strong>Påverkar:</strong> {g.affects}</p>
            <p>{g.text}</p>
            <p className="note"><strong>Beslut som löser det:</strong> {g.decision}</p>
          </article>
        ))}
      </section>

      <section className="group">
        <h2 className="group-title">Ej verifierat – kan inte ingå i Re:store <span className="count">{unverified.length}</span></h2>
        <ul className="reason-list">
          {unverified.map((f) => (
            <li key={f.id}>
              <a className="reason-item" href={href('livsmedel', f.id)}>
                <span className="ri-name">{f.displayName}</span>
                <span className="ri-people">
                  {(['linn', 'patrik'] as PersonKey[]).map((w) => (
                    <span key={w} className="ri-p"><span className="ri-who">{PERSON_NAME[w]}</span><StatusBadge status={f[w].finalStatusDay1To21} size="sm" /><span className="ri-why">{shortReason(f, w)}</span></span>
                  ))}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
