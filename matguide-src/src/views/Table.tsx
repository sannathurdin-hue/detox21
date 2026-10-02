import { useMemo, useState } from 'react';
import { CATEGORIES, COMPARISON, COMPARISON_ORDER, ComparisonStatus, FOODS, FinalStatus, Food, searchFoods } from '../lib/data';
import { Chips, ComparisonBadge, Empty, PageHeader, SearchInput, StatusMark, href } from '../components/ui';

type SortKey = 'name' | 'linn' | 'patrik' | 'shared' | 'category';
const RANK: Record<FinalStatus, number> = { ALLOWED: 0, RESTRICTED: 1, DATA_CONFLICT: 2, UNVERIFIED: 3, AVOID: 4 };

export function initialQuery(): string {
  const m = window.location.hash.match(/\?q=([^&]*)/);
  return m ? decodeURIComponent(m[1]) : '';
}

export function filterTable(q: string, status: 'ALL' | ComparisonStatus, cat: string): Food[] {
  return searchFoods(q).filter((f) => (status === 'ALL' || f.comparisonStatus === status) && (cat === 'Alla' || f.category === cat));
}

export function Table() {
  const [q, setQ] = useState(initialQuery);
  const [status, setStatus] = useState<'ALL' | ComparisonStatus>('ALL');
  const [cat, setCat] = useState('Alla');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'name', dir: 1 });

  const rows = useMemo(() => {
    const list = filterTable(q, status, cat);
    if (!q.trim() || sort.key !== 'name') {
      const cmp = (a: Food, b: Food): number => {
        switch (sort.key) {
          case 'linn': return RANK[a.linn.finalStatusDay1To21] - RANK[b.linn.finalStatusDay1To21];
          case 'patrik': return RANK[a.patrik.finalStatusDay1To21] - RANK[b.patrik.finalStatusDay1To21];
          case 'shared': return COMPARISON_ORDER.indexOf(a.comparisonStatus) - COMPARISON_ORDER.indexOf(b.comparisonStatus);
          case 'category': return CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category);
          default: return 0;
        }
      };
      list.sort((a, b) => sort.dir * (cmp(a, b) || a.displayName.localeCompare(b.displayName, 'sv')));
    }
    return list;
  }, [q, status, cat, sort]);

  const statusOptions = [
    { value: 'ALL' as const, label: 'Alla', count: FOODS.length },
    ...COMPARISON_ORDER.map((s) => ({ value: s, label: COMPARISON[s].label, count: FOODS.filter((f) => f.comparisonStatus === s).length })),
  ];

  const Th = ({ k, children }: { k: SortKey; children: string }) => (
    <th scope="col" aria-sort={sort.key === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="th-btn" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1 }))}>
        {children}<span aria-hidden="true">{sort.key === k ? (sort.dir === 1 ? ' ↑' : ' ↓') : ''}</span>
      </button>
    </th>
  );

  return (
    <div>
      <PageHeader title="Alla livsmedel" subtitle="Fullständig jämförelse. Sök, filtrera och sortera. Klicka på en rad för källor." />
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} />
        <Chips label="Status" value={status} onChange={setStatus} options={statusOptions} />
        <label className="select">
          <span>Kategori</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option>Alla</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      </div>
      <p className="result-count" aria-live="polite">{rows.length} livsmedel</p>
      {rows.length === 0 ? <Empty>Inga träffar. Saknas livsmedlet helt är det ej verifierat i underlaget.</Empty> : (
        <div className="table-wrap">
          <table className="cmp-table">
            <thead>
              <tr>
                <Th k="name">Livsmedel</Th>
                <Th k="linn">Linn</Th>
                <Th k="patrik">Patrik</Th>
                <Th k="shared">Gemensamt?</Th>
                <Th k="category">Kategori</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id} onClick={() => { window.location.hash = href('livsmedel', f.id).slice(1); }}>
                  <th scope="row"><a href={href('livsmedel', f.id)}>{f.displayName}</a></th>
                  <td><StatusMark status={f.linn.finalStatusDay1To21} who="linn" /></td>
                  <td><StatusMark status={f.patrik.finalStatusDay1To21} who="patrik" /></td>
                  <td><ComparisonBadge status={f.comparisonStatus} size="sm" /></td>
                  <td className="muted">{f.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
