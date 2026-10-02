import { useState } from 'react';
import { FOOD_BY_ID, Food, analyzeIngredients, searchFoods } from '../lib/data';
import { PageHeader, SearchInput, StatusMark, href } from '../components/ui';

export function Check() {
  const [q, setQ] = useState('');
  const [ids, setIds] = useState<string[]>([]);
  const [unknown, setUnknown] = useState<string[]>([]);
  const selected = ids.map((id) => FOOD_BY_ID[id]);
  const suggestions = q.trim() ? searchFoods(q).filter((f) => !ids.includes(f.id)).slice(0, 6) : [];
  const res = analyzeIngredients(selected);

  const add = (f: Food) => { setIds((x) => [...x, f.id]); setQ(''); };
  const addUnknown = () => { const t = q.trim(); if (t && !unknown.includes(t)) setUnknown((u) => [...u, t]); setQ(''); };

  const verdict = unknown.length && res.verdict !== 'NOT_SHARED' ? 'CANNOT_VERIFY' : res.verdict;

  return (
    <div>
      <PageHeader title="Kan vi äta detta?" subtitle="Lägg till ingredienserna i en rätt eller restaurangmaträtt. Alla måste vara tillåtna för båda." />
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Lägg till ingrediens…" label="Lägg till ingrediens" />
      </div>
      {q.trim() && (
        <ul className="suggest" aria-label="Förslag">
          {suggestions.map((f) => (
            <li key={f.id}>
              <button type="button" onClick={() => add(f)}>
                <span>{f.displayName}</span>
                <span className="suggest-marks"><StatusMark status={f.linn.finalStatusDay1To21} who="linn" /><StatusMark status={f.patrik.finalStatusDay1To21} who="patrik" /></span>
                <span className="suggest-add" aria-hidden="true">+</span>
              </button>
            </li>
          ))}
          {suggestions.length === 0 && (
            <li><button type="button" onClick={addUnknown}><span>Lägg till "{q.trim()}" – finns inte i underlaget</span><span className="suggest-add" aria-hidden="true">+</span></button></li>
          )}
        </ul>
      )}

      {(selected.length > 0 || unknown.length > 0) && (
        <ul className="selected" aria-label="Valda ingredienser">
          {selected.map((f) => (
            <li key={f.id} className="sel-chip">
              <span>{f.displayName}</span>
              <button type="button" aria-label={`Ta bort ${f.displayName}`} onClick={() => setIds((x) => x.filter((i) => i !== f.id))}>×</button>
            </li>
          ))}
          {unknown.map((u) => (
            <li key={u} className="sel-chip sel-unknown">
              <span>{u} ?</span>
              <button type="button" aria-label={`Ta bort ${u}`} onClick={() => setUnknown((x) => x.filter((i) => i !== u))}>×</button>
            </li>
          ))}
          <li><button type="button" className="link" onClick={() => { setIds([]); setUnknown([]); }}>Rensa</button></li>
        </ul>
      )}

      {verdict !== 'EMPTY' && (
        <section className={`check-result cr-${verdict === 'BOTH' ? 'green' : verdict === 'NOT_SHARED' ? 'red' : 'grey'}`} aria-live="polite">
          <p className="cr-verdict">
            {verdict === 'BOTH' && <><span aria-hidden="true">✓ </span>KAN ÄTAS AV BÅDA</>}
            {verdict === 'NOT_SHARED' && <><span aria-hidden="true">✕ </span>INTE GEMENSAMT</>}
            {verdict === 'CANNOT_VERIFY' && <><span aria-hidden="true">? </span>Kan inte verifieras fullt ut</>}
          </p>
          {res.problems.length > 0 && (
            <>
              <h3>Problem</h3>
              <ul>{res.problems.map((p) => <li key={p.food.id}><a href={href('livsmedel', p.food.id)}>{p.food.displayName}</a> – {p.text}</li>)}</ul>
            </>
          )}
          {(res.unverified.length > 0 || unknown.length > 0) && (
            <>
              <h3>Kan inte verifieras</h3>
              <ul>
                {res.unverified.map((p) => <li key={p.food.id}><a href={href('livsmedel', p.food.id)}>{p.food.displayName}</a> – {p.text}</li>)}
                {unknown.map((u) => <li key={u}>{u} – ej verifierat i underlaget</li>)}
              </ul>
            </>
          )}
          {verdict === 'BOTH' && <p className="note">Alla {selected.length} ingredienser är verifierat tillåtna för både Linn och Patrik dag 1–21. Tänk på att även tillagning, fett, salt och såser räknas som ingredienser.</p>}
        </section>
      )}
      {verdict === 'EMPTY' && <p className="empty">Inga ingredienser valda än. Prova t.ex. kyckling, ris, tomat.</p>}
    </div>
  );
}
