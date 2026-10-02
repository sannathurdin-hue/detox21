import { useState } from 'react';
import { FOOD_BY_ID, Food, PERSON_NAME, PersonKey, RestoreStatus, groupByCategory, searchFoods, sourceLabel } from '../lib/data';
import {
  CONFLICTS, DAY_RULES, MEAL_BY_ID, RESOLVED_CONFLICTS, RESTORE_DAYS, RESTORE_FOODS, RESTORE_GAPS, RESTORE_LABEL,
  RESTORE_SUMMARY, RestoreDay, RestoreMeal, SLOTS, WEEKDAY_LABEL, byRestore, daysForToday,
} from '../lib/restore';
import { Badge, Chips, Empty, SearchInput, StatusBadge, href, shortReason } from '../components/ui';

// ---------------------------------------------------------------------------
export function RestoreBadge({ status, size }: { status: RestoreStatus; size?: 'sm' | 'md' | 'lg' }) {
  const r = RESTORE_LABEL[status];
  return <Badge tone={r.tone} symbol={r.symbol} size={size}>{r.label}</Badge>;
}

function RestoreHeader({ title, lede, back = true }: { title: string; lede?: React.ReactNode; back?: boolean }) {
  return (
    <header className="page-header">
      {back && <a className="back" href="#/restore">‹ Re:store</a>}
      <p className="eyebrow">Re:store by Sanna</p>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}

/** Sökresultat: Linn / Patrik / Re:store */
export function RestoreQuickCard({ food }: { food: Food }) {
  const tone = RESTORE_LABEL[food.restoreStatus].tone;
  return (
    <a className={`quick-card qc-${tone}`} href={href('livsmedel', food.id)}>
      <div className="qc-head"><h3>{food.displayName}</h3><span className="qc-cat">{food.category}</span></div>
      <dl className="qc-people">
        {(['linn', 'patrik'] as PersonKey[]).map((w) => (
          <div key={w} className="qc-person">
            <dt>{PERSON_NAME[w]}</dt>
            <dd><StatusBadge status={food[w].finalStatusDay1To21} size="sm" /><span className="qc-reason">{shortReason(food, w)}</span></dd>
          </div>
        ))}
        <div className="qc-person qc-restore">
          <dt>Re:store</dt>
          <dd><RestoreBadge status={food.restoreStatus} /></dd>
        </div>
      </dl>
    </a>
  );
}

function DayLink({ d }: { d: RestoreDay }) {
  const main = MEAL_BY_ID[d.meals.lunch];
  return (
    <a className={`day-tile ${d.validation.pass ? '' : 'day-tile-fail'}`} href={href('restore', 'dag', String(d.day))}>
      <span className="dt-top">
        <span className="dt-day">Dag {d.day}</span>
        <span className="dt-wd">{WEEKDAY_LABEL[d.weekday]} · {DAY_RULES[d.weekday].theme}</span>
      </span>
      <span className="dt-meal">{main.title}</span>
      {d.validation.pass
        ? <Badge tone="green" symbol="✓" size="sm">Validerad</Badge>
        : <Badge tone="amber" symbol="!" size="sm">Kräver beslut</Badge>}
    </a>
  );
}

// ---------------------------------------------------------------------------
export function RestoreHome() {
  const [q, setQ] = useState('');
  const results = q.trim() ? searchFoods(q).slice(0, 6) : [];
  const today = daysForToday();
  const wd = today[0]?.weekday;
  return (
    <div className="home">
      <header className="hero hero-restore">
        <p className="hero-names">Re:Set by Sanna</p>
        <h1>Re:store <span className="by">by Sanna</span></h1>
        <p className="hero-sub">Linn + Patrik · 21 dagar</p>
      </header>

      <a className="choice tone-green choice-primary restore-count" href={href('restore', 'mat')}>
        <span className="choice-sym" aria-hidden="true">✓</span>
        <span className="choice-label">livsmedel verifierade för båda</span>
        <span className="choice-count">{RESTORE_FOODS.length}</span>
      </a>

      <div className="restore-search">
        <SearchInput value={q} onChange={setQ} large placeholder="Kan båda äta …?" label="Sök livsmedel i Re:store" />
      </div>
      {q.trim() && (
        <section aria-live="polite" className="search-results">
          {results.length === 0 ? (
            <div className="quick-card qc-grey">
              <h3>{q}</h3>
              <p><strong>? Ej verifierat</strong></p>
              <p className="note">Finns inte i Linns eller Patriks underlag. Re:store gissar inte.</p>
            </div>
          ) : results.map((f) => <RestoreQuickCard key={f.id} food={f} />)}
        </section>
      )}

      {!q.trim() && (
        <>
          {wd && (
            <section className="today-card">
              <h2>Idag · {WEEKDAY_LABEL[wd]}</h2>
              <p className="note">{DAY_RULES[wd].theme}. Dag 1 i planen är en måndag.</p>
              <div className="today-days">
                {today.map((d) => (
                  <a key={d.day} href={href('restore', 'dag', String(d.day))} className="today-link">
                    <span>Dag {d.day}</span>
                    <strong>{MEAL_BY_ID[d.meals.lunch].title}</strong>
                  </a>
                ))}
              </div>
            </section>
          )}
          <nav className="secondary" aria-label="Re:store">
            <a href={href('restore', 'plan')}><span aria-hidden="true">▦</span> 21-dagarsplan <span className="count">{RESTORE_SUMMARY.pass}/{RESTORE_SUMMARY.total} validerade</span></a>
            <a href={href('restore', 'mat')}><span aria-hidden="true">✓</span> Gemensam matlista</a>
            <a href={href('restore', 'kan-vi')}><span aria-hidden="true">🍽</span> Kan vi laga detta?</a>
            <a href={href('restore', 'kontroll')}><span aria-hidden="true">⚠</span> Konflikter &amp; QA <span className="count">{CONFLICTS.length + RESTORE_GAPS.length}</span></a>
          </nav>
          <p className="footnote">Re:store innehåller endast livsmedel där både Linns och Patriks slutstatus dag 1–21 är Tillåten. <a href="#/">‹ Tillbaka till Re:Set</a></p>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
const STATUS_FILTERS: { value: RestoreStatus; label: string }[] = [
  { value: 'ALLOWED_FOR_BOTH', label: 'Tillåtet för båda' },
  { value: 'NOT_ALLOWED_FOR_BOTH', label: 'Ingår inte' },
  { value: 'UNVERIFIED', label: 'Ej verifierat' },
  { value: 'DATA_CONFLICT', label: 'Datakonflikt' },
];

export function RestoreFoods() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<RestoreStatus>('ALLOWED_FOR_BOTH');
  const [cat, setCat] = useState('Alla');
  const pool = byRestore(status);
  const groups = groupByCategory(pool);
  const filtered = searchFoods(q, pool).filter((f) => cat === 'Alla' || f.category === cat);
  const tone = RESTORE_LABEL[status].tone;
  return (
    <div>
      <RestoreHeader title="Gemensam matlista" lede={<><strong>{RESTORE_FOODS.length} livsmedel verifierade för båda.</strong> Bara det som både Linn och Patrik får äta under dag 1–21.</>} />
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Sök i matlistan…" />
        <Chips label="Re:store-status" value={status} onChange={(v) => { setStatus(v); setCat('Alla'); }}
          options={STATUS_FILTERS.map((s) => ({ ...s, count: byRestore(s.value).length }))} />
        <Chips label="Kategori" value={cat} onChange={setCat}
          options={[{ value: 'Alla', label: 'Alla', count: pool.length }, ...groups.map(([g, l]) => ({ value: g, label: g, count: l.length }))]} />
      </div>
      {filtered.length === 0 && <Empty>Inga träffar.</Empty>}
      {groupByCategory(filtered).map(([g, list]) => (
        <section key={g} className="group">
          <h2 className="group-title">{g} <span className="count">{list.length}</span></h2>
          <ul className="pill-list">
            {list.map((f) => (
              <li key={f.id}>
                <a className={`pill tone-${tone}`} href={href('livsmedel', f.id)}>
                  <span aria-hidden="true">{RESTORE_LABEL[status].symbol}</span> {f.displayName}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RestorePlan() {
  return (
    <div>
      <RestoreHeader title="21-dagarsplan" lede={<>Linns och Patriks gemensamma veckostruktur, upprepad i tre veckor. Dag 1 = måndag. <strong>{RESTORE_SUMMARY.pass} av {RESTORE_SUMMARY.total} dagar validerade.</strong></>} />
      {RESTORE_SUMMARY.blocked.length > 0 && (
        <p className="diff-flag"><span aria-hidden="true">! </span>Dag {RESTORE_SUMMARY.blocked.join(', ')} kräver ett beslut från er – se <a href={href('restore', 'kontroll')}>Konflikter &amp; QA</a>.</p>
      )}
      {[1, 2, 3].map((w) => (
        <section key={w} className="group">
          <h2 className="group-title">Vecka {w} · dag {(w - 1) * 7 + 1}–{w * 7}</h2>
          <div className="day-grid">
            {RESTORE_DAYS.filter((d) => d.week === w).map((d) => <DayLink key={d.day} d={d} />)}
          </div>
        </section>
      ))}
      <details className="group">
        <summary>Gemensam struktur – så är planen uppbyggd</summary>
        <ul className="meal-list">
          {SLOTS.map((s) => (
            <li key={s.key}><span className="meal-time">{s.label}</span><span>{s.shared}<br /><span className="note">Linn {s.linn}: {s.linnText} · Patrik {s.patrik}: {s.patrikText}</span></span></li>
          ))}
        </ul>
        <ul className="meal-list">
          {Object.entries(DAY_RULES).map(([k, r]) => (
            <li key={k}><span className="meal-time">{r.label}</span><span><strong>{r.theme}</strong>{r.sharedBase.length ? ` · gemensamt: ${r.sharedBase.map((id) => FOOD_BY_ID[id]?.displayName ?? id).join(', ')}` : ''}<br /><span className="note">Linn: {r.linn}<br />Patrik: {r.patrik}</span></span></li>
          ))}
        </ul>
        <p className="note">Restaurangportioner. Ät var tredje timme och hoppa inte över måltider. Endast keltiskt salt / havssalt. 10–12 glas vatten dagligen.</p>
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RestoreDayView({ day }: { day: number }) {
  const d = RESTORE_DAYS.find((x) => x.day === day);
  if (!d) return <Empty>Dagen finns inte.</Empty>;
  const v = d.validation;
  const rule = DAY_RULES[d.weekday];
  return (
    <div>
      <header className="page-header">
        <a className="back" href={href('restore', 'plan')}>‹ 21-dagarsplan</a>
        <p className="eyebrow">Re:store · Vecka {d.week}</p>
        <h1>Dag {d.day}</h1>
        <p className="lede">{WEEKDAY_LABEL[d.weekday]} · {rule.theme}</p>
      </header>
      <div className={`verdict verdict-${v.pass ? 'green' : 'amber'}`}>
        <span className="verdict-label">{v.pass ? 'Alla måltider validerade för Linn och Patrik' : 'Dagen kan inte valideras – kräver beslut'}</span>
        {v.pass ? <Badge tone="green" symbol="✓" size="lg">PASS</Badge> : <Badge tone="amber" symbol="!" size="lg">FAIL</Badge>}
      </div>
      {!v.pass && (
        <div className="note-global note">
          {(v.failReasons ?? []).map((r) => <p key={r}>{r}</p>)}
          <p><a href={href('restore', 'kontroll')}>Läs mer och ta ställning ›</a></p>
        </div>
      )}

      <ol className="schedule">
        {SLOTS.map((s) => {
          const m = MEAL_BY_ID[d.meals[s.key]];
          const mv = v.meals.find((x) => x.slot === s.key)!;
          return (
            <li key={s.key} className="sched-item">
              <div className="sched-time"><span>Linn {s.linn}</span><span>Patrik {s.patrik}</span></div>
              <a className={`sched-meal ${mv.pass ? '' : 'sched-fail'}`} href={href('restore', 'maltid', m.id)}>
                <span className="sched-label">{s.label}{s.key === 'dinner' ? ' · samma som lunch' : ''}</span>
                <strong>{m.title}</strong>
                <span className="sched-ing">{m.ingredients.map((i) => FOOD_BY_ID[i.id].displayName + (i.note && i.note.startsWith('1 ') ? ` (${i.note})` : '')).join(' · ')}</span>
                <span className="sched-status">{mv.pass ? <span className="ok">✓ Verifierad för båda</span> : <span className="warn">! Ej validerad</span>}</span>
              </a>
            </li>
          );
        })}
      </ol>

      <section className="group">
        <h2 className="group-title">Dryck</h2>
        <ul className="pill-list">
          {d.drinks.map((x) => <li key={x.title}><span className="pill tone-green"><span aria-hidden="true">✓</span> {x.title}</span></li>)}
        </ul>
      </section>

      <nav className="day-nav" aria-label="Bläddra dagar">
        {d.day > 1 ? <a href={href('restore', 'dag', String(d.day - 1))}>‹ Dag {d.day - 1}</a> : <span />}
        {d.day < 21 ? <a href={href('restore', 'dag', String(d.day + 1))}>Dag {d.day + 1} ›</a> : <span />}
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RestoreMealView({ id }: { id: string }) {
  const m: RestoreMeal | undefined = MEAL_BY_ID[id];
  if (!m) return <Empty>Måltiden finns inte.</Empty>;
  const day = RESTORE_DAYS.find((d) => Object.values(d.meals).includes(m.id));
  const v = day?.validation.meals.find((x) => x.mealId === m.id);
  const allOk = v ? v.ingredientsPass : false;
  const ROLE: Record<string, string> = {
    base: 'Huvudkomponent', cooked: 'Tillagad grönsak', salad: 'Färsk sallad', seasoning: 'Smaksättning', liquid: 'Vätska',
    fruit: 'Frukt', spread: 'Pålägg', veg: 'Grönsak',
  };
  return (
    <div>
      <header className="page-header">
        <a className="back" href={day ? href('restore', 'dag', String(day.day)) : href('restore', 'plan')} onClick={(e) => { if (history.length > 1) { e.preventDefault(); history.back(); } }}>‹ Tillbaka</a>
        <p className="eyebrow">Re:store · måltid</p>
        <h1>{m.title}</h1>
        {m.usedOnDays.length > 0 && <p className="lede">Dag {m.usedOnDays.join(', ')}</p>}
      </header>

      {m.proposal && (
        <p className="diff-flag"><span aria-hidden="true">! </span>Förslag – inte validerat. Söndagens regel har inget rött kött som står i båda personernas schema. Se <a href={href('restore', 'kontroll')}>Konflikter &amp; QA</a>.</p>
      )}

      <section className="group">
        <h2 className="group-title">Ingredienser <span className="count">{m.ingredients.length}</span></h2>
        <ul className="ing-list">
          {m.ingredients.map((i) => {
            const f = FOOD_BY_ID[i.id];
            const ok = f.linn.finalStatusDay1To21 === 'ALLOWED' && f.patrik.finalStatusDay1To21 === 'ALLOWED';
            return (
              <li key={i.id}>
                <a href={href('livsmedel', f.id)} className="ing-row">
                  <span className={`mark tone-${ok ? 'green' : 'red'}`} aria-hidden="true">{ok ? '✓' : '✕'}</span>
                  <span className="ing-name">{f.displayName}{i.note ? <span className="muted"> · {i.note}</span> : null}</span>
                  <span className="ing-role">{ROLE[i.role] ?? i.role}</span>
                  <span className="sr-only">{ok ? 'Tillåten för båda' : 'Inte tillåten för båda'}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={`check-result cr-${allOk ? 'green' : 'red'}`}>
        <h2 className="group-title">Verifierad för</h2>
        <p className="cr-people">
          {(['linn', 'patrik'] as PersonKey[]).map((w) => {
            const ok = m.ingredients.every((i) => FOOD_BY_ID[i.id][w].finalStatusDay1To21 === 'ALLOWED');
            return <span key={w} className={ok ? 'ok' : 'warn'}><span aria-hidden="true">{ok ? '✓' : '✕'} </span>{PERSON_NAME[w]}</span>;
          })}
        </p>
        <p className="note"><strong>{allOk ? 'Alla ingredienser är verifierade för båda profilerna.' : 'Minst en ingrediens är inte verifierad för båda.'}</strong></p>
        {v && (
          <>
            <h3>Dagens struktur ({day ? `${WEEKDAY_LABEL[day.weekday]}, ${DAY_RULES[day.weekday].theme.toLowerCase()}` : ''})</h3>
            <ul>{v.structure.map((s, k) => <li key={k} className={s.ok ? 'ok' : 'warn'}>{s.ok ? '✓' : '✕'} {s.text}</li>)}</ul>
          </>
        )}
      </section>

      <section className="group">
        <h2 className="group-title">Så gör du</h2>
        <p>{m.method}</p>
        <p className="note">Inga andra ingredienser än de som står ovan. Tillagas utan fett – inget stekfett eller salladsolja är verifierat för båda.</p>
      </section>
    </div>
  );
}

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

export function RestoreIssues() {
  const unverified = byRestore('UNVERIFIED');
  return (
    <div>
      <RestoreHeader title="Konflikter & QA" lede="Allt som hindrar ett livsmedel eller en dag från att ingå i Re:store – och vad som behövs för att lösa det." />

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
