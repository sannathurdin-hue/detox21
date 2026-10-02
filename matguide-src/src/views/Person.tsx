import { useState } from 'react';
import { FOODS, FinalStatus, Food, META, PERSON_NAME, PersonKey, groupByCategory, searchFoods } from '../lib/data';
import { WEEKDAYS } from '../lib/week';
import { Chips, Empty, PageHeader, SearchInput, StatusBadge, href, shortReason } from '../components/ui';

type Tab = 'allowed' | 'avoid' | 'alcat' | 'restrictions' | 'rules' | 'other';

function Pills({ foods, tone, who }: { foods: Food[]; tone: string; who?: PersonKey }) {
  return (
    <ul className="pill-list">
      {foods.map((f) => (
        <li key={f.id}>
          <a className={`pill tone-${tone}`} href={href('livsmedel', f.id)} title={who ? shortReason(f, who) : undefined}>{f.displayName}</a>
        </li>
      ))}
    </ul>
  );
}

function Grouped({ foods, tone, who }: { foods: Food[]; tone: string; who: PersonKey }) {
  if (!foods.length) return <Empty>Inga livsmedel.</Empty>;
  return (
    <>
      {groupByCategory(foods).map(([g, list]) => (
        <section key={g} className="group">
          <h3 className="group-title">{g} <span className="count">{list.length}</span></h3>
          <Pills foods={list} tone={tone} who={who} />
        </section>
      ))}
    </>
  );
}

export function Person({ who }: { who: PersonKey }) {
  const [tab, setTab] = useState<Tab>('allowed');
  const [q, setQ] = useState('');
  const m = META.people[who];
  const other: PersonKey = who === 'linn' ? 'patrik' : 'linn';
  const pool = searchFoods(q);
  const by = (s: FinalStatus) => pool.filter((f) => f[who].finalStatusDay1To21 === s);
  const allowed = by('ALLOWED');
  const avoid = by('AVOID');
  const otherStatuses = pool.filter((f) => ['RESTRICTED', 'UNVERIFIED', 'DATA_CONFLICT'].includes(f[who].finalStatusDay1To21));
  const count = (s: FinalStatus) => FOODS.filter((f) => f[who].finalStatusDay1To21 === s).length;

  const tabs: { value: Tab; label: string; count?: number }[] = [
    { value: 'allowed', label: 'Tillåtet dag 1–21', count: count('ALLOWED') },
    { value: 'avoid', label: 'Undvik', count: count('AVOID') },
    { value: 'alcat', label: 'ALCAT-reaktioner' },
    { value: 'restrictions', label: 'Tidsbegränsade regler' },
    { value: 'rules', label: 'Måltider & rotation' },
    { value: 'other', label: 'Ej verifierat / övrigt', count: count('RESTRICTED') + count('UNVERIFIED') + count('DATA_CONFLICT') },
  ];

  const levels: { key: string; label: string; tone: string }[] = [
    { key: 'SEVERE', label: 'Allvarlig', tone: 'red' },
    { key: 'MODERATE', label: 'Måttlig', tone: 'red' },
    { key: 'MILD', label: 'Mild*', tone: 'amber' },
    { key: 'CONFLICT', label: 'Motstridig i rapporten', tone: 'amber' },
  ];

  return (
    <div>
      <PageHeader title={m.name} subtitle={<>Allt för {PERSON_NAME[who]} under dag 1–21. <a href={href('person', other)}>Visa {PERSON_NAME[other]} ›</a></>} />
      <div className="toolbar">
        <Chips label="Avsnitt" value={tab} onChange={setTab} options={tabs} />
        {['allowed', 'avoid', 'other'].includes(tab) && <SearchInput value={q} onChange={setQ} />}
      </div>

      {tab === 'allowed' && (
        <>
          <p className="lede-sm">Slutstatus <strong>Tillåten</strong> = grön i ALCAT och inte begränsad av kostschemat, eller uttryckligen angiven i kostschemat.</p>
          <Grouped foods={allowed} tone="green" who={who} />
        </>
      )}

      {tab === 'avoid' && (
        <>
          {(['ALCAT-reaktion', 'Ska elimineras enligt ALCAT', 'Förbjudet i kostschemat (trots grön/ej testad i ALCAT)', 'Innehåller råvara med reaktion'] as const).map((title, i) => {
            const list = avoid.filter((f) => {
              const p = f[who];
              if (i === 0) return ['SEVERE', 'MODERATE', 'MILD'].includes(p.alcatStatus);
              if (i === 1) return p.alcatStatus === 'ELIMINATE';
              if (i === 2) return ['NONE', 'NOT_TESTED'].includes(p.alcatStatus) && p.dietPlanStatusDay1To21 === 'FORBIDDEN';
              return p.alcatStatus === 'DERIVED';
            });
            if (!list.length) return null;
            return (
              <section key={title} className="group">
                <h2 className="group-title">{title} <span className="count">{list.length}</span></h2>
                <Pills foods={list} tone="red" who={who} />
              </section>
            );
          })}
        </>
      )}

      {tab === 'alcat' && (
        <>
          <p className="lede-sm">
            Endast ALCAT-rapportens resultat ({m.alcat.document}, provdatum {m.alcat.provdatum}, Lab ID {m.alcat.labId}). Detta är <strong>inte</strong> slutstatus
            dag 1–21 – kostschemat kan förbjuda livsmedel som är gröna här.
          </p>
          {levels.map((l) => {
            const list = FOODS.filter((f) => f[who].alcatStatus === l.key);
            if (!list.length) return null;
            return (
              <section key={l.key} className="group">
                <h2 className="group-title">{l.label} <span className="count">{list.length}</span></h2>
                {META.alcatLevels[l.key] && <p className="note">{META.alcatLevels[l.key].text}</p>}
                <Pills foods={list} tone={l.tone} who={who} />
              </section>
            );
          })}
          <section className="group">
            <h2 className="group-title">Acceptabel / ingen reaktion <span className="count">{FOODS.filter((f) => f[who].alcatStatus === 'NONE').length}</span></h2>
            <Pills foods={FOODS.filter((f) => f[who].alcatStatus === 'NONE')} tone="neutral" who={who} />
          </section>
          <section className="group">
            <h2 className="group-title">Särskilda markörer (blå rutor)</h2>
            <p className="note">Markörer – inte livsmedel. Livsmedlen under "Also eliminate these foods" ska elimineras oavsett.</p>
            <dl className="markers">
              {Object.entries(m.alcat.markers).map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            {Object.entries(m.alcat.eliminate).map(([box, list]) => (
              <p key={box} className="note"><strong>{box} – eliminera:</strong> {list.join(', ')}</p>
            ))}
          </section>
        </>
      )}

      {tab === 'restrictions' && (
        <>
          <p className="lede-sm">Regler ur {PERSON_NAME[who]}s kostschema ({m.plan.document}). Alla perioder är längre än 21 dagar och gäller därför hela dag 1–21.</p>
          <ul className="rule-list">
            {m.plan.notes.map((n, i) => (
              <li key={i}><q>{n.text}</q><span className="src-doc">sida {n.page}</span></li>
            ))}
          </ul>
          <section className="group">
            <h2 className="group-title">Livsmedel som förbjuds av kostschemat</h2>
            <Pills foods={FOODS.filter((f) => f[who].dietPlanStatusDay1To21 === 'FORBIDDEN')} tone="red" who={who} />
          </section>
          <section className="group">
            <h2 className="group-title">ALCAT-baserade undvikandeperioder</h2>
            <ul className="rule-list">
              {['SEVERE', 'MODERATE', 'MILD'].map((k) => (
                <li key={k}><strong>{META.alcatLevels[k].label}:</strong> {META.alcatLevels[k].duration}</li>
              ))}
            </ul>
          </section>
        </>
      )}

      {tab === 'rules' && (
        <>
          <section className="group">
            <h2 className="group-title">Måltider (var tredje timme)</h2>
            <ul className="meal-list">
              {m.plan.meals.map((x, i) => (
                <li key={i}><span className="meal-time">{x.time}</span><span><strong>{x.name}</strong> – {x.text}</span></li>
              ))}
            </ul>
          </section>
          <section className="group">
            <h2 className="group-title">Lunch = middag, per veckodag</h2>
            <ul className="meal-list">
              {WEEKDAYS.map((d) => (
                <li key={d.key}><span className="meal-time">{d.label}</span><span>{m.plan.week[d.key].theme && <strong>({m.plan.week[d.key].theme}) </strong>}{m.plan.week[d.key].text}</span></li>
              ))}
            </ul>
            <p className="note">Hela schemat jämfört med {PERSON_NAME[other]}: <a href={href('veckoschema')}>Veckoschema ›</a></p>
          </section>
          <section className="group">
            <h2 className="group-title">ALCAT 4-dagarsrotation</h2>
            <p className="note">Ur ALCAT-rapporten sida 3 ("Personalized Rotation Diet"). Rotationen innehåller även gula (*) livsmedel – visas här som i rapporten, men slutstatus dag 1–21 gäller.</p>
            <div className="rotation">
              {Object.entries(m.rotation).map(([d, list]) => (
                <div key={d} className="rot-day">
                  <h3>Dag {d}</h3>
                  <p>{list.join(', ')}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === 'other' && (
        <>
          {otherStatuses.length === 0 && <Empty>Inga träffar.</Empty>}
          <ul className="reason-list">
            {otherStatuses.map((f) => (
              <li key={f.id}>
                <a className="reason-item" href={href('livsmedel', f.id)}>
                  <span className="ri-name">{f.displayName}</span>
                  <span className="ri-people"><span className="ri-p"><StatusBadge status={f[who].finalStatusDay1To21} size="sm" /><span className="ri-why">{f[who].restriction ?? f[who].notes[0] ?? shortReason(f, who)}</span></span></span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
