import { useState } from 'react';
import { COMPARISON, ComparisonStatus, Food, byComparison, groupByCategory, searchFoods } from '../lib/data';
import { FoodRow, PageHeader, SearchInput, StatusBadge, href, shortReason, Empty, Chips } from '../components/ui';

const INTRO: Record<ComparisonStatus, string> = {
  BOTH_ALLOWED: 'Endast livsmedel där underlagen visar att både Linn och Patrik får äta dem under dag 1–21.',
  LINN_ONLY: 'Tillåtet för Linn – men Patrik ska undvika det under dag 1–21.',
  PATRIK_ONLY: 'Tillåtet för Patrik – men Linn ska undvika det under dag 1–21.',
  BOTH_AVOID: 'Ingen av dem ska äta detta under dag 1–21.',
  DIFFERENT_RESTRICTION: 'Tillåtet bara under villkor – se detaljerna för varje livsmedel.',
  UNVERIFIED: 'Underlaget räcker inte för att avgöra statusen för minst en av dem. Systemet gissar inte.',
  DATA_CONFLICT: 'Dokumenten säger emot sig själva. Kräver kontroll med kliniken.',
};

export function ComparisonList({ status }: { status: ComparisonStatus }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Alla');
  const all = byComparison(status);
  const groups = groupByCategory(all);
  const filtered = searchFoods(q, all).filter((f) => cat === 'Alla' || f.category === cat);
  const c = COMPARISON[status];
  const showReasons = status !== 'BOTH_ALLOWED';

  return (
    <div>
      <PageHeader
        title={<><span className={`title-sym tone-${c.tone}`} aria-hidden="true">{c.symbol}</span> {c.label}</>}
        subtitle={<><strong>{c.label}: {all.length} {status === 'BOTH_ALLOWED' ? 'verifierade ' : ''}livsmedel.</strong> {INTRO[status]}</>}
      />
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder={`Sök i "${c.label}"…`} />
        <Chips
          label="Kategori"
          value={cat}
          onChange={setCat}
          options={[{ value: 'Alla', label: 'Alla', count: all.length }, ...groups.map(([g, l]) => ({ value: g, label: g, count: l.length }))]}
        />
      </div>
      {filtered.length === 0 && <Empty>Inga träffar.</Empty>}
      {groupByCategory(filtered).map(([g, list]) => (
        <section key={g} className="group">
          <h2 className="group-title">{g} <span className="count">{list.length}</span></h2>
          {showReasons ? (
            <ul className="reason-list">
              {list.map((f) => <ReasonItem key={f.id} food={f} />)}
            </ul>
          ) : (
            <ul className="pill-list">
              {list.map((f) => (
                <li key={f.id}><a className="pill tone-green" href={href('livsmedel', f.id)}><span aria-hidden="true">✓</span> {f.displayName}</a></li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

export function ReasonItem({ food }: { food: Food }) {
  return (
    <li>
      <a className="reason-item" href={href('livsmedel', food.id)}>
        <span className="ri-name">{food.displayName}</span>
        <span className="ri-people">
          <span className="ri-p"><span className="ri-who">Linn</span><StatusBadge status={food.linn.finalStatusDay1To21} size="sm" /><span className="ri-why">{shortReason(food, 'linn')}</span></span>
          <span className="ri-p"><span className="ri-who">Patrik</span><StatusBadge status={food.patrik.finalStatusDay1To21} size="sm" /><span className="ri-why">{shortReason(food, 'patrik')}</span></span>
        </span>
      </a>
    </li>
  );
}

export function Differences() {
  const [q, setQ] = useState('');
  const linn = searchFoods(q, byComparison('LINN_ONLY'));
  const patrik = searchFoods(q, byComparison('PATRIK_ONLY'));
  return (
    <div>
      <PageHeader title="Skillnader" subtitle="Det som bara den ena får äta under dag 1–21 – med orsaken för var och en." />
      <div className="toolbar"><SearchInput value={q} onChange={setQ} placeholder="Sök bland skillnaderna…" /></div>
      <div className="two-col">
        <section>
          <h2 className="col-title">Linn kan – Patrik kan inte <span className="count">{linn.length}</span></h2>
          <ul className="reason-list">{linn.map((f) => <ReasonItem key={f.id} food={f} />)}</ul>
          {!linn.length && <Empty>Inga träffar.</Empty>}
        </section>
        <section>
          <h2 className="col-title">Patrik kan – Linn kan inte <span className="count">{patrik.length}</span></h2>
          <ul className="reason-list">{patrik.map((f) => <ReasonItem key={f.id} food={f} />)}</ul>
          {!patrik.length && <Empty>Inga träffar.</Empty>}
        </section>
      </div>
      <p className="footnote">
        Livsmedel där en av dem är ej verifierad räknas inte som skillnad – se <a href={href('ej-verifierat')}>Ej verifierat</a>.
      </p>
    </div>
  );
}

export function FoodListRows({ foods }: { foods: Food[] }) {
  return <div className="rows">{foods.map((f) => <FoodRow key={f.id} food={f} />)}</div>;
}
