// PUBLIC PRODUCT – Re:store by Sanna
// Renderar endast data från lib/restorePublic (restore-public.json). Inga källprofiler visas här.
import { ReactNode, useState } from 'react';
import {
  PublicDay, PublicFood, R_DAYS, R_FOOD, R_FOODS, R_INCLUDED, R_MEAL, R_RULES, R_SLOTS, R_STATUS, R_STRUCTURE,
  ROLE_LABEL, RestoreStatus, SLOT_LABEL, WEEKDAY, daysForToday, rCheck, rGroup, rSearch,
} from '../lib/restorePublic';
import { Badge, Chips, Empty, SearchInput, href } from '../components/ui';

const rHref = (...p: string[]) => href('restore', ...p);
const foodHref = (id: string) => rHref('livsmedel', id);

export function RestoreBadge({ status, size, long }: { status: RestoreStatus; size?: 'sm' | 'md' | 'lg'; long?: boolean }) {
  const r = R_STATUS[status];
  return <Badge tone={r.tone} symbol={r.symbol} size={size}>{long ? r.long : r.label}</Badge>;
}

function RestoreHeader({ title, lede, back = rHref(), backLabel = 'Re:store' }: { title: string; lede?: ReactNode; back?: string; backLabel?: string }) {
  return (
    <header className="page-header">
      <a className="back" href={back}>‹ {backLabel}</a>
      <p className="eyebrow">Re:store by Sanna</p>
      <h1>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
    </header>
  );
}

/** Sökresultat – endast Re:store-status */
function RestoreResult({ food }: { food: PublicFood }) {
  const s = R_STATUS[food.status];
  return (
    <a className={`quick-card qc-${s.tone}`} href={foodHref(food.id)}>
      <div className="qc-head"><h3>{food.name}</h3><span className="qc-cat">{food.category}</span></div>
      <p className="qc-verdict-line"><RestoreBadge status={food.status} long /></p>
      <p className="qc-reason">{food.reason}</p>
    </a>
  );
}

function NotFound({ q }: { q: string }) {
  return (
    <div className="quick-card qc-grey">
      <h3>{q}</h3>
      <p className="qc-verdict-line"><Badge tone="grey" symbol="?">EJ VERIFIERAT</Badge></p>
      <p className="qc-reason">Livsmedlet finns inte i Re:store-underlaget. Re:store gissar inte.</p>
    </div>
  );
}

const mainOf = (d: PublicDay) => R_MEAL[d.meals.lunch];

function DayTile({ d }: { d: PublicDay }) {
  return (
    <a className={`day-tile ${d.status === 'VALIDATED' ? '' : 'day-tile-fail'}`} href={rHref('dag', String(d.day))}>
      <span className="dt-top">
        <span className="dt-day">Dag {d.day}</span>
        <span className="dt-wd">{WEEKDAY[d.weekday]} · {R_STRUCTURE[d.weekday].theme}</span>
      </span>
      <span className="dt-meal">{mainOf(d).title}</span>
      {d.status !== 'VALIDATED' && <span className="dt-review">Under granskning</span>}
    </a>
  );
}

// ---------------------------------------------------------------------------
export function RestoreHome() {
  const [q, setQ] = useState('');
  const results = q.trim() ? rSearch(q).slice(0, 6) : [];
  const today = daysForToday();
  const wd = today[0]?.weekday;
  return (
    <div className="home">
      <header className="hero hero-restore">
        <p className="hero-names">Re:Set by Sanna</p>
        <h1>Re:store <span className="by">by Sanna</span></h1>
        <p className="hero-sub">21-dagars kostprotokoll</p>
      </header>

      <div className="restore-search">
        <SearchInput value={q} onChange={setQ} large placeholder="Ingår … i Re:store?" label="Sök livsmedel i Re:store" />
      </div>
      {q.trim() && (
        <section aria-live="polite" className="search-results">
          {results.length === 0 ? <NotFound q={q} /> : results.map((f) => <RestoreResult key={f.id} food={f} />)}
        </section>
      )}

      {!q.trim() && (
        <>
          {wd && (
            <section className="today-card">
              <h2>Idag · {WEEKDAY[wd]}</h2>
              <p className="note">{R_STRUCTURE[wd].theme}</p>
              <div className="today-days">
                {today.map((d) => (
                  <a key={d.day} href={rHref('dag', String(d.day))} className="today-link">
                    <span>Dag {d.day}</span>
                    <strong>{mainOf(d).title}</strong>
                  </a>
                ))}
              </div>
            </section>
          )}
          <nav className="secondary" aria-label="Re:store">
            <a href={rHref('plan')}><span aria-hidden="true">▦</span> 21-dagarsplan</a>
            <a href={rHref('mat')}><span aria-hidden="true">✓</span> Re:store Foods <span className="count">{R_INCLUDED.length}</span></a>
            <a href={rHref('fungerar')}><span aria-hidden="true">🍽</span> Fungerar detta i Re:store?</a>
            <a href={rHref('struktur')}><span aria-hidden="true">◎</span> Så är Re:store uppbyggt</a>
          </nav>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
const STATUS_FILTERS: { value: RestoreStatus; label: string }[] = [
  { value: 'ALLOWED_FOR_BOTH', label: 'Ingår i Re:store' },
  { value: 'NOT_ALLOWED_FOR_BOTH', label: 'Ingår inte' },
  { value: 'UNVERIFIED', label: 'Ej verifierat' },
];
const statusPool = (s: RestoreStatus) =>
  R_FOODS.filter((f) => (s === 'UNVERIFIED' ? f.status === 'UNVERIFIED' || f.status === 'DATA_CONFLICT' : f.status === s));

export function RestoreFoods() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<RestoreStatus>('ALLOWED_FOR_BOTH');
  const [cat, setCat] = useState('Alla');
  const pool = statusPool(status);
  const filtered = rSearch(q, pool).filter((f) => cat === 'Alla' || f.category === cat);
  const tone = R_STATUS[status].tone;
  return (
    <div>
      <RestoreHeader title="Re:store Foods" lede={<><strong>{R_INCLUDED.length} validerade livsmedel.</strong> Allt som ingår i 21-dagarsprotokollet, sorterat efter kategori.</>} />
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Sök livsmedel i Re:store…" label="Sök livsmedel i Re:store" />
        <Chips label="Status" value={status} onChange={(v) => { setStatus(v); setCat('Alla'); }}
          options={STATUS_FILTERS.map((s) => ({ ...s, count: statusPool(s.value).length }))} />
        <Chips label="Kategori" value={cat} onChange={setCat}
          options={[{ value: 'Alla', label: 'Alla', count: pool.length }, ...rGroup(pool).map(([g, l]) => ({ value: g, label: g, count: l.length }))]} />
      </div>
      {filtered.length === 0 && <Empty>Inga träffar.</Empty>}
      {rGroup(filtered).map(([g, list]) => (
        <section key={g} className="group">
          <h2 className="group-title">{g} <span className="count">{list.length}</span></h2>
          <ul className="pill-list">
            {list.map((f) => (
              <li key={f.id}>
                <a className={`pill tone-${tone}`} href={foodHref(f.id)}><span aria-hidden="true">{R_STATUS[status].symbol}</span> {f.name}</a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
function Structure() {
  return (
    <>
      <section className="group">
        <h2 className="group-title">Veckorytmen</h2>
        <ul className="meal-list">
          {Object.entries(R_STRUCTURE).map(([k, r]) => (
            <li key={k}><span className="meal-time">{r.label}</span><span><strong>{r.theme}</strong><br /><span className="note">{r.text}</span></span></li>
          ))}
        </ul>
        <p className="note">Veckan upprepas tre gånger. Dag 1 är en måndag.</p>
      </section>
      <section className="group">
        <h2 className="group-title">Måltidsrytmen</h2>
        <ul className="meal-list">
          {R_SLOTS.map((s) => <li key={s.key}><span className="meal-time">{s.time}</span><span><strong>{s.label}</strong> · {s.text}</span></li>)}
        </ul>
      </section>
      <section className="group">
        <h2 className="group-title">Protokollets regler</h2>
        <ul className="rule-list">{R_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>
    </>
  );
}

export function RestoreStructure() {
  return (
    <div>
      <RestoreHeader title="Så är Re:store uppbyggt" lede="Re:store följer en fast veckorytm med sex måltider om dagen. Varje måltid består enbart av validerade livsmedel." />
      <Structure />
    </div>
  );
}

export function RestorePlan() {
  return (
    <div>
      <RestoreHeader title="21-dagarsplan" lede="Ett strukturerat 21-dagars kostupplägg med noggrant utvalda livsmedel, tydlig veckorytm och färdiga måltider för varje dag." />
      <p className="note">Dag 1 är en måndag.</p>
      {[1, 2, 3].map((w) => (
        <section key={w} className="group">
          <h2 className="group-title">Vecka {w} · dag {(w - 1) * 7 + 1}–{w * 7}</h2>
          <div className="day-grid">{R_DAYS.filter((d) => d.week === w).map((d) => <DayTile key={d.day} d={d} />)}</div>
        </section>
      ))}
      <details className="group">
        <summary>Så är Re:store uppbyggt</summary>
        <Structure />
      </details>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RestoreDayView({ day }: { day: number }) {
  const d = R_DAYS.find((x) => x.day === day);
  if (!d) return <Empty>Dagen finns inte.</Empty>;
  const ok = d.status === 'VALIDATED';
  return (
    <div>
      <header className="page-header">
        <a className="back" href={rHref('plan')}>‹ 21-dagarsplan</a>
        <p className="eyebrow">Re:store · Vecka {d.week}</p>
        <h1>Dag {d.day}</h1>
        <p className="lede">{WEEKDAY[d.weekday]} · {R_STRUCTURE[d.weekday].theme}</p>
      </header>
      {!ok && (
        <p className="diff-flag"><span aria-hidden="true">! </span>Dagens huvudrätt är under granskning och ännu inte validerad. Frukost och mellanmål är validerade.</p>
      )}

      <ol className="schedule">
        {R_SLOTS.map((s) => {
          const m = R_MEAL[d.meals[s.key]];
          const mOk = m.status === 'VALIDATED';
          return (
            <li key={s.key} className="sched-item">
              <div className="sched-time"><span>{s.time}</span></div>
              <a className={`sched-meal ${mOk ? '' : 'sched-fail'}`} href={rHref('maltid', m.id)}>
                <span className="sched-label">{s.label}{s.key === 'dinner' ? ' · samma som lunch' : ''}</span>
                <strong>{m.title}</strong>
                <span className="sched-ing">{m.ingredients.map((i) => R_FOOD[i.id].name + (i.note && i.note.startsWith('1 ') ? ` (${i.note})` : '')).join(' · ')}</span>
                <span className="sched-status">{mOk ? <span className="ok">✓ Re:store-validerad</span> : <span className="warn">Under granskning</span>}</span>
              </a>
            </li>
          );
        })}
      </ol>

      <section className="group">
        <h2 className="group-title">Dryck</h2>
        <ul className="pill-list">{d.drinks.map((x) => <li key={x}><span className="pill tone-green"><span aria-hidden="true">✓</span> {x}</span></li>)}</ul>
      </section>

      <nav className="day-nav" aria-label="Bläddra dagar">
        {d.day > 1 ? <a href={rHref('dag', String(d.day - 1))}>‹ Dag {d.day - 1}</a> : <span />}
        {d.day < 21 ? <a href={rHref('dag', String(d.day + 1))}>Dag {d.day + 1} ›</a> : <span />}
      </nav>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RestoreMealView({ id }: { id: string }) {
  const m = R_MEAL[id];
  if (!m) return <Empty>Måltiden finns inte.</Empty>;
  const ok = m.status === 'VALIDATED';
  const firstDay = R_DAYS.find((d) => Object.values(d.meals).includes(m.id));
  return (
    <div>
      <header className="page-header">
        <a className="back" href={firstDay ? rHref('dag', String(firstDay.day)) : rHref('plan')} onClick={(e) => { if (history.length > 1) { e.preventDefault(); history.back(); } }}>‹ Tillbaka</a>
        <p className="eyebrow">Re:store · måltid</p>
        <h1>{m.title}</h1>
        <p className="lede">Dag {m.usedOnDays.join(', ')}</p>
      </header>

      <div className={`verdict verdict-${ok ? 'green' : 'amber'}`}>
        <span className="verdict-label">{ok ? 'Samtliga ingredienser är verifierade för Re:store-protokollet.' : 'Rätten är under granskning och ännu inte validerad.'}</span>
        {ok ? <Badge tone="green" symbol="✓" size="lg">Re:store-validerad</Badge> : <Badge tone="amber" symbol="!" size="lg">Under granskning</Badge>}
      </div>

      <section className="group">
        <h2 className="group-title">Ingredienser <span className="count">{m.ingredients.length}</span></h2>
        <ul className="ing-list">
          {m.ingredients.map((i) => {
            const f = R_FOOD[i.id];
            const inc = f.status === 'ALLOWED_FOR_BOTH';
            return (
              <li key={i.id}>
                <a href={foodHref(f.id)} className="ing-row">
                  <span className={`mark tone-${inc ? 'green' : 'red'}`} aria-hidden="true">{inc ? '✓' : '✕'}</span>
                  <span className="ing-name">{f.name}{i.note ? <span className="muted"> · {i.note}</span> : null}</span>
                  <span className="ing-role">{ROLE_LABEL[i.role] ?? i.role}</span>
                  <span className="sr-only">{R_STATUS[f.status].label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="group">
        <h2 className="group-title">Så gör du</h2>
        <p>{m.method}</p>
        <p className="note">Inga andra ingredienser än de som står ovan.</p>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
export function RestoreFoodView({ id }: { id: string }) {
  const f = R_FOOD[id];
  if (!f) return <Empty>Livsmedlet finns inte.</Empty>;
  const inc = f.status === 'ALLOWED_FOR_BOTH';
  const s = R_STATUS[f.status];
  const mealsWith = Object.values(R_MEAL).filter((m) => m.ingredients.some((i) => i.id === f.id));
  return (
    <article className="detail">
      <header className="page-header">
        <a className="back" href={rHref('mat')} onClick={(e) => { if (history.length > 1) { e.preventDefault(); history.back(); } }}>‹ Tillbaka</a>
        <p className="eyebrow">{f.category}</p>
        <h1>{f.name}</h1>
      </header>
      <div className={`verdict verdict-${s.tone}`}>
        <span className="verdict-label">Re:store-status</span>
        <RestoreBadge status={f.status} size="lg" long />
      </div>
      <dl className="facts facts-card">
        <div><dt>Period</dt><dd>{inc ? '✓ Tillåtet under dag 1–21' : f.status === 'NOT_ALLOWED_FOR_BOTH' ? '✕ Ingår inte under dag 1–21' : '? Kan inte verifieras för dag 1–21'}</dd></div>
        <div><dt>Kategori</dt><dd>{f.category}</dd></div>
        <div><dt>Underlag</dt><dd>{f.reason}</dd></div>
        {inc && (
          <div><dt>Används i protokollet</dt><dd>{f.use.length
            ? f.use.map((u) => `${SLOT_LABEL[u.slot]}: dag ${u.days.join(', ')}`).join(' · ')
            : 'Ingår i Re:store men används inte i 21-dagarsplanens måltider. Kan användas fritt inom dagens struktur.'}</dd></div>
        )}
      </dl>
      {mealsWith.length > 0 && (
        <section className="group">
          <h2 className="group-title">Måltider med {f.name.toLowerCase()}</h2>
          <ul className="reason-list">
            {mealsWith.map((m) => (
              <li key={m.id}><a className="reason-item" href={rHref('maltid', m.id)}><span>{m.title}</span><span className="note">Dag {m.usedOnDays.join(', ')}</span></a></li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
export function RestoreCheck() {
  const [q, setQ] = useState('');
  const [ids, setIds] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);
  const selected = ids.map((id) => R_FOOD[id]);
  const suggestions = q.trim() ? rSearch(q).filter((f) => !ids.includes(f.id)).slice(0, 6) : [];
  const res = rCheck(selected, unknown);
  const add = (f: PublicFood) => { setIds((x) => [...x, f.id]); setQ(''); };
  const addUnknown = () => { const t = q.trim(); if (t && !unknown.includes(t)) setUnknown((u) => [...u, t]); setQ(''); };

  return (
    <div>
      <RestoreHeader title="Fungerar detta i Re:store?" lede="Lägg till varje ingrediens i rätten – även olja, salt, kryddor, sås och dryck." />
      <div className="toolbar"><SearchInput value={q} onChange={setQ} placeholder="Lägg till ingrediens…" label="Lägg till ingrediens" /></div>
      {q.trim() && (
        <ul className="suggest" aria-label="Förslag">
          {suggestions.map((f) => (
            <li key={f.id}>
              <button type="button" onClick={() => add(f)}>
                <span>{f.name}</span>
                <span className={`mark tone-${R_STATUS[f.status].tone}`} title={R_STATUS[f.status].label}><span aria-hidden="true">{R_STATUS[f.status].symbol}</span><span className="sr-only">{R_STATUS[f.status].label}</span></span>
                <span className="suggest-add" aria-hidden="true">+</span>
              </button>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li><button type="button" onClick={addUnknown}><span>Lägg till "{q.trim()}" – finns inte i underlaget</span><span /><span className="suggest-add" aria-hidden="true">+</span></button></li>
          )}
        </ul>
      )}
      {(selected.length > 0 || unknown.length > 0) && (
        <ul className="selected" aria-label="Valda ingredienser">
          {selected.map((f) => (
            <li key={f.id} className="sel-chip"><span>{f.name}</span><button type="button" aria-label={`Ta bort ${f.name}`} onClick={() => setIds((x) => x.filter((i) => i !== f.id))}>×</button></li>
          ))}
          {unknown.map((u) => (
            <li key={u} className="sel-chip sel-unknown"><span>{u} ?</span><button type="button" aria-label={`Ta bort ${u}`} onClick={() => setUnknown((x) => x.filter((i) => i !== u))}>×</button></li>
          ))}
          <li><button type="button" className="link" onClick={() => { setIds([]); setUnknown([]); }}>Rensa</button></li>
        </ul>
      )}
      {res.verdict !== 'EMPTY' ? (
        <section className={`check-result cr-${res.verdict === 'YES' ? 'green' : res.verdict === 'NO' ? 'red' : 'grey'}`} aria-live="polite">
          <p className="cr-verdict">
            {res.verdict === 'YES' && <><span aria-hidden="true">✓ </span>RE:STORE-KOMPATIBEL</>}
            {res.verdict === 'NO' && <><span aria-hidden="true">✕ </span>INTE RE:STORE-KOMPATIBEL</>}
            {res.verdict === 'UNCLEAR' && <><span aria-hidden="true">? </span>KAN INTE VERIFIERAS FULLT UT</>}
          </p>
          {res.verdict === 'YES' && <p className="note"><strong>Samtliga ingredienser ingår i Re:store.</strong></p>}
          {res.notIncluded.length > 0 && (
            <><h3>Ingår inte i Re:store</h3><ul>{res.notIncluded.map((f) => <li key={f.id}><a href={foodHref(f.id)}>{f.name}</a></li>)}</ul></>
          )}
          {(res.unclear.length > 0 || unknown.length > 0) && (
            <><h3>Kan inte verifieras</h3><ul>
              {res.unclear.map((f) => <li key={f.id}><a href={foodHref(f.id)}>{f.name}</a> – {R_STATUS[f.status].label.toLowerCase()}</li>)}
              {unknown.map((u) => <li key={u}>{u} – finns inte i underlaget</li>)}
            </ul></>
          )}
        </section>
      ) : <p className="empty">Inga ingredienser valda än. Prova till exempel kyckling, ris och tomat.</p>}
    </div>
  );
}
