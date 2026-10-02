import { useState } from 'react';
import { FOOD_BY_ID, Food, META } from '../lib/data';
import { WEEKDAYS, analyzeDay } from '../lib/week';
import { Chips, PageHeader, StatusMark, href } from '../components/ui';

const todayKey = () => WEEKDAYS[(new Date().getDay() + 6) % 7].key;

function NamedFoods({ foods, who }: { foods: Food[]; who: 'linn' | 'patrik' }) {
  return (
    <ul className="inline-foods">
      {foods.map((f) => (
        <li key={f.id}><a href={href('livsmedel', f.id)}>{f.displayName}</a> <StatusMark status={f[who].finalStatusDay1To21} who={who} /></li>
      ))}
    </ul>
  );
}

function Pills({ foods }: { foods: Food[] }) {
  return (
    <ul className="pill-list">
      {foods.map((f) => <li key={f.id}><a className="pill tone-green" href={href('livsmedel', f.id)}><span aria-hidden="true">✓</span> {f.displayName}</a></li>)}
    </ul>
  );
}

export function Week() {
  const [day, setDay] = useState(todayKey);
  const L = META.people.linn.plan, P = META.people.patrik.plan;
  const a = analyzeDay(day);
  const label = WEEKDAYS.find((d) => d.key === day)!.label;
  const same = L.week[day].text.replace(/\W/g, '').toLowerCase() === P.week[day].text.replace(/\W/g, '').toLowerCase();
  const majskakor = FOOD_BY_ID['majskakor-som-knackebrod'];

  return (
    <div>
      <PageHeader title="Veckoschema" subtitle="Lunch = middag. Varje persons regel ordagrant ur kostschemat – och vad som faktiskt går att äta tillsammans." />
      <div className="toolbar">
        <Chips label="Veckodag" value={day} onChange={setDay} options={WEEKDAYS.map((d) => ({ value: d.key, label: d.label.slice(0, 3) }))} />
      </div>

      <h2 className="day-title">{label}</h2>
      <div className="two-col">
        {(['linn', 'patrik'] as const).map((w) => {
          const r = (w === 'linn' ? L : P).week[day];
          return (
            <section key={w} className="day-card">
              <h3>{w === 'linn' ? 'Linn' : 'Patrik'}{r.theme ? ` · ${r.theme}` : ''}</h3>
              <q>{r.text}</q>
              <p className="src-doc">{(w === 'linn' ? L : P).document}, sida {r.page}</p>
              {a.named && <NamedFoods foods={w === 'linn' ? a.named.linn : a.named.patrik} who={w} />}
            </section>
          );
        })}
      </div>
      {!same && <p className="diff-flag"><span aria-hidden="true">! </span>Reglerna skiljer sig åt den här dagen.</p>}

      <section className="shared-card">
        <h3><span aria-hidden="true">✓ </span>Gemensamt {label.toLowerCase()}</h3>
        {a.named && (
          a.named.shared.length ? (
            <div className="group">
              <h4>{a.named.label} – står i båda personernas regel och är tillåtet för båda</h4>
              <Pills foods={a.named.shared} />
              {(a.named.onlyLinn.length > 0 || a.named.onlyPatrik.length > 0) && (
                <p className="note">
                  Endast i en persons regel: {[...a.named.onlyLinn.map((f) => `${f.displayName} (Linn)`), ...a.named.onlyPatrik.map((f) => `${f.displayName} (Patrik)`)].join(', ')}.
                </p>
              )}
            </div>
          ) : (
            <div className="group">
              <h4 className="warn"><span aria-hidden="true">! </span>{a.named.label}: inget gemensamt alternativ i dagens regler</h4>
              <p className="note">
                Linns regel: {a.named.linn.map((f) => f.displayName).join(' / ')}. Patriks regel: {a.named.patrik.map((f) => f.displayName).join(' / ')}. Inget av dessa är tillåtet för båda.
              </p>
              {a.named.alsoBothAllowed.length > 0 && (
                <>
                  <p className="note">Tillåtet för båda i samma kategori (men nämns inte i båda personernas regel för dagen):</p>
                  <Pills foods={a.named.alsoBothAllowed} />
                </>
              )}
            </div>
          )
        )}
        {a.categories.map((c) => (
          <div key={c.label} className="group">
            <h4>{c.label} – tillåtet för båda <span className="count">{c.shared.length}</span></h4>
            <Pills foods={c.shared} />
          </div>
        ))}
        {a.crispbread && (
          <p className="note">
            <strong>Knäckebröd:</strong> Linns schema anger <a href={href('livsmedel', majskakor.id)}>majskakor som knäckebröd</a>. Patriks anger inte sort – därför inte verifierat som gemensamt. <a href={href('livsmedel', 'knackebrod-sort-ej-angiven')}>Detaljer ›</a>
          </p>
        )}
        <p className="note">Alla ingredienser i rätten måste vara tillåtna för båda. Kontrollera en hel rätt med <a href={href('kan-vi-ata')}>Kan vi äta detta?</a></p>
      </section>

      <details className="group">
        <summary>Gemensamma regler varje dag</summary>
        <ul className="rule-list">
          <li>Ät var tredje timme. Linn: 07:30, 10:00, 13:00, 16:00, 19:00, 22:00. Patrik: 06:15, 09:00, 12:00, 15:00, 18:00, 21:00.</li>
          <li>Frukost: fruktsallad + 1 tsk tahini + 1 knäckebröd (båda). Linn alternativt valnötssmör; Patrik även 1 tsk manukahonung.</li>
          <li>Stekfett: Linn kokosfett, Patrik ankfett – inget gemensamt verifierat stekfett.</li>
          <li>Olja till sallad: Patrik "1 msk olivolja"; Linn "1 matsked oliv" (tvetydigt).</li>
          <li>Endast keltiskt salt / havssalt. 10–12 glas vatten. Örtte som dryck.</li>
        </ul>
      </details>
    </div>
  );
}
