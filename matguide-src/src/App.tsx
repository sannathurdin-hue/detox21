import { COMPARISON, ComparisonStatus, FOOD_BY_ID, PersonKey } from './lib/data';
import { FoodDetail } from './components/FoodCard';
import { Empty, PageHeader, Wordmark, href, useRoute } from './components/ui';
import { Home } from './views/Home';
import { ComparisonList, Differences } from './views/Lists';
import { Table } from './views/Table';
import { Person } from './views/Person';
import { Week } from './views/Week';
import { Check } from './views/Check';
import { About } from './views/About';
import { useEffect } from 'react';
import { RestoreCheck, RestoreDayView, RestoreFoodView, RestoreFoods, RestoreHome, RestoreMealView, RestorePlan, RestoreStructure } from './views/Restore';
import { RestoreInternal } from './views/RestoreInternal';

const LIST_ROUTES = Object.fromEntries(
  (Object.keys(COMPARISON) as ComparisonStatus[]).map((s) => [COMPARISON[s].route, s]),
) as Record<string, ComparisonStatus>;

const TABS = [
  { route: '', label: 'Sök' },
  { route: 'bada', label: 'Båda' },
  { route: 'skillnader', label: 'Skillnad' },
  { route: 'veckoschema', label: 'Vecka' },
  { route: 'kan-vi-ata', label: 'Kan vi?' },
  { route: 'restore', label: 'Re:store' },
];

function NotFound() {
  return <div><PageHeader title="Sidan finns inte" /><Empty>Gå tillbaka till <a href="#/">start</a>.</Empty></div>;
}

export function View({ route }: { route: string[] }) {
  const [a, b] = route;
  if (!a) return <Home />;
  if (LIST_ROUTES[a]) return <ComparisonList key={a} status={LIST_ROUTES[a]} />;
  if (a === 'skillnader') return <Differences />;
  if (a === 'tabell') return <Table />;
  if (a === 'veckoschema') return <Week />;
  if (a === 'kan-vi-ata') return <Check />;
  if (a === 'underlag' && !b) return <About />;
  if (a === 'underlag' && b === 'restore') return <RestoreInternal />;
  if (a === 'restore') return <RestoreView route={route.slice(1)} />;
  if (a === 'person' && (b === 'linn' || b === 'patrik')) return <Person key={b} who={b as PersonKey} />;
  if (a === 'livsmedel' && b && FOOD_BY_ID[b]) return <FoodDetail food={FOOD_BY_ID[b]} />;
  return <NotFound />;
}

// PUBLIC: Re:store by Sanna – egen navigation, inga Re:Set-länkar till källprofiler
export function RestoreView({ route }: { route: string[] }) {
  const [b, c] = route;
  if (!b) return <RestoreHome />;
  if (b === 'mat') return <RestoreFoods />;
  if (b === 'plan') return <RestorePlan />;
  if (b === 'struktur') return <RestoreStructure />;
  if (b === 'fungerar') return <RestoreCheck />;
  if (b === 'dag' && c && /^\d+$/.test(c) && +c >= 1 && +c <= 21) return <RestoreDayView key={c} day={+c} />;
  if (b === 'maltid' && c) return <RestoreMealView key={c} id={c} />;
  if (b === 'livsmedel' && c) return <RestoreFoodView key={c} id={c} />;
  return <div><PageHeader title="Sidan finns inte" back={false} /><Empty>Gå till <a href="#/restore">Re:store</a>.</Empty></div>;
}

const RESTORE_TABS = [
  { route: 'restore', label: 'Idag' },
  { route: 'restore/plan', label: 'Plan' },
  { route: 'restore/mat', label: 'Livsmedel' },
  { route: 'restore/fungerar', label: 'Kontroll' },
];

function RestoreShell({ route }: { route: string[] }) {
  const cur = ['restore', route[1]].filter(Boolean).join('/');
  useEffect(() => { document.title = 'Re:store by Sanna'; return () => { document.title = 'Re:Set by Sanna'; }; }, []);
  return (
    <>
      <a className="skip" href="#main">Hoppa till innehåll</a>
      <header className="topbar">
        <a className="brand" href="#/restore" aria-label="Re:store by Sanna – start"><Wordmark product="store" /></a>
        <nav className="topnav" aria-label="Re:store-meny">
          {RESTORE_TABS.map((t) => <a key={t.route} href={`#/${t.route}`} aria-current={cur === t.route ? 'page' : undefined}>{t.label}</a>)}
          <a href="#/restore/struktur" aria-current={cur === 'restore/struktur' ? 'page' : undefined}>Struktur</a>
        </nav>
        <a className="topbar-parent" href="#/">Re:Set</a>
      </header>
      <main id="main" className="container" key={route.join('/')}>
        <RestoreView route={route.slice(1)} />
      </main>
      <nav className="tabbar tabbar-restore" aria-label="Re:store snabbmeny">
        {RESTORE_TABS.map((t) => (
          <a key={t.route} href={`#/${t.route}`} aria-current={cur === t.route ? 'page' : undefined}>
            <span>{t.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}

export default function App() {
  const route = useRoute();
  const current = route[0] ?? '';
  if (current === 'restore') return <RestoreShell route={route} />;
  return (
    <>
      <a className="skip" href="#main">Hoppa till innehåll</a>
      <header className="topbar">
        <a className="brand" href="#/" aria-label="Re:Set by Sanna – start"><Wordmark product="Set" /></a>
        <nav className="topnav" aria-label="Huvudmeny">
          <a href={href('bada')} aria-current={current === 'bada' ? 'page' : undefined}>Båda kan äta</a>
          <a href={href('skillnader')} aria-current={current === 'skillnader' ? 'page' : undefined}>Skillnader</a>
          <a href={href('tabell')} aria-current={current === 'tabell' ? 'page' : undefined}>Alla</a>
          <a href={href('veckoschema')} aria-current={current === 'veckoschema' ? 'page' : undefined}>Veckoschema</a>
          <a href={href('kan-vi-ata')} aria-current={current === 'kan-vi-ata' ? 'page' : undefined}>Kan vi äta detta?</a>
          <a href={href('person', 'linn')} aria-current={route.join('/') === 'person/linn' ? 'page' : undefined}>Linn</a>
          <a href={href('person', 'patrik')} aria-current={route.join('/') === 'person/patrik' ? 'page' : undefined}>Patrik</a>
        </nav>
        <a className="topbar-parent topbar-restore" href={href('restore')}>Re:store</a>
      </header>
      <main id="main" className="container" key={route.join('/')}>
        <View route={route} />
      </main>
      <nav className="tabbar" aria-label="Snabbmeny">
        {TABS.map((t) => (
          <a key={t.route} href={`#/${t.route}`} aria-current={current === t.route ? 'page' : undefined}>
            <span>{t.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
