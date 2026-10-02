import { COMPARISON, ComparisonStatus, FOOD_BY_ID, PersonKey } from './lib/data';
import { FoodDetail } from './components/FoodCard';
import { Empty, PageHeader, href, useRoute } from './components/ui';
import { Home } from './views/Home';
import { ComparisonList, Differences } from './views/Lists';
import { Table } from './views/Table';
import { Person } from './views/Person';
import { Week } from './views/Week';
import { Check } from './views/Check';
import { About } from './views/About';

const LIST_ROUTES = Object.fromEntries(
  (Object.keys(COMPARISON) as ComparisonStatus[]).map((s) => [COMPARISON[s].route, s]),
) as Record<string, ComparisonStatus>;

const TABS = [
  { route: '', label: 'Sök', icon: '⌕' },
  { route: 'bada', label: 'Båda', icon: '✓' },
  { route: 'skillnader', label: 'Skillnader', icon: '⇄' },
  { route: 'veckoschema', label: 'Vecka', icon: '▦' },
  { route: 'kan-vi-ata', label: 'Kan vi?', icon: '🍽' },
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
  if (a === 'underlag') return <About />;
  if (a === 'person' && (b === 'linn' || b === 'patrik')) return <Person key={b} who={b as PersonKey} />;
  if (a === 'livsmedel' && b && FOOD_BY_ID[b]) return <FoodDetail food={FOOD_BY_ID[b]} />;
  return <NotFound />;
}

export default function App() {
  const route = useRoute();
  const current = route[0] ?? '';
  return (
    <>
      <a className="skip" href="#main">Hoppa till innehåll</a>
      <header className="topbar">
        <a className="brand" href="#/">RE-SET <span>by Sanna</span></a>
        <nav className="topnav" aria-label="Huvudmeny">
          <a href={href('bada')} aria-current={current === 'bada' ? 'page' : undefined}>Båda kan äta</a>
          <a href={href('skillnader')} aria-current={current === 'skillnader' ? 'page' : undefined}>Skillnader</a>
          <a href={href('tabell')} aria-current={current === 'tabell' ? 'page' : undefined}>Alla</a>
          <a href={href('veckoschema')} aria-current={current === 'veckoschema' ? 'page' : undefined}>Veckoschema</a>
          <a href={href('kan-vi-ata')} aria-current={current === 'kan-vi-ata' ? 'page' : undefined}>Kan vi äta detta?</a>
          <a href={href('person', 'linn')} aria-current={route.join('/') === 'person/linn' ? 'page' : undefined}>Linn</a>
          <a href={href('person', 'patrik')} aria-current={route.join('/') === 'person/patrik' ? 'page' : undefined}>Patrik</a>
        </nav>
      </header>
      <main id="main" className="container">
        <View route={route} />
      </main>
      <nav className="tabbar" aria-label="Snabbmeny">
        {TABS.map((t) => (
          <a key={t.route} href={`#/${t.route}`} aria-current={current === t.route ? 'page' : undefined}>
            <span aria-hidden="true" className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
