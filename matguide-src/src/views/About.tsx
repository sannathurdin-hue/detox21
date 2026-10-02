import { COMPARISON, COMPARISON_ORDER, FOODS, META, byComparison } from '../lib/data';
import { PageHeader, href } from '../components/ui';

export function About() {
  const L = META.people.linn, P = META.people.patrik;
  return (
    <div className="prose">
      <PageHeader title="Om underlaget" subtitle="Hur statusen räknas fram, vilka källor som används och var underlaget är osäkert." />

      <h2>Källor</h2>
      <ul>
        <li><strong>Linn:</strong> {L.alcat.document} (ALCAT, provdatum {L.alcat.provdatum}, Lab ID {L.alcat.labId}) och {L.plan.document} (kostschema / Gröna listan).</li>
        <li><strong>Patrik:</strong> {P.alcat.document} (ALCAT, provdatum {P.alcat.provdatum}, Lab ID {P.alcat.labId}) och {P.plan.document} (kostschema / Gröna listan, trogen transkribering av original-PDF).</li>
        <li>CNA/CMA ingår inte och används inte.</li>
      </ul>

      <h2>Så räknas "Tillåten dag 1–21"</h2>
      <ol>
        <li>ALCAT-resultatet och kostschemat läses var för sig.</li>
        <li>Allvarlig, måttlig eller mild reaktion i ALCAT → <strong>Undvik</strong>. Mild räknas som undvik eftersom kostschemana bygger på "Gröna listan".</li>
        <li>Livsmedel under "Also eliminate these foods" (Candida, gluten, kasein-rutorna) → <strong>Undvik</strong>.</li>
        <li>Kostschemats förbud (mejeri, jäst, vin, öl, vindruvor, socker, fermenterat, vinäger, annat salt) överstyr en grön ALCAT → <strong>Undvik</strong>.</li>
        <li>Grön i ALCAT och ingen begränsning i kostschemat, eller uttryckligen angiven i kostschemat → <strong>Tillåten</strong>.</li>
        <li>Inte testad och inte nämnd → <strong>Ej verifierat</strong>. Motstridiga uppgifter → <strong>Datakonflikt</strong>.</li>
        <li><strong>Båda kan äta</strong> kräver att båda har slutstatus Tillåten. Inga undantag.</li>
      </ol>

      <h2>Översikt</h2>
      <table className="mini-table">
        <tbody>
          <tr><th scope="row">Livsmedel i databasen</th><td>{FOODS.length}</td></tr>
          {COMPARISON_ORDER.map((s) => (
            <tr key={s}><th scope="row"><a href={href(COMPARISON[s].route)}>{COMPARISON[s].label}</a></th><td>{byComparison(s).length}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Osäkerheter och tolkningsbeslut</h2>
      <ul>
        <li><a href={href('livsmedel', 'endiv')}>Endiv</a>: står både som mild och grön i båda rapporterna (två panelposter med samma svenska namn). <strong>Datakonflikt.</strong></li>
        <li><a href={href('livsmedel', 'havsabborre')}>Havsabborre</a>: står både som måttlig och grön i Linns rapport. <strong>Datakonflikt för Linn.</strong></li>
        <li>Koriander och mussla står två gånger med samma nivå – ingen konflikt.</li>
        <li><a href={href('livsmedel', 'manukahonung')}>Manukahonung</a>: räknas inte som honung enligt användarens beslut (2026-10-02). Tillåten för båda.</li>
        <li><a href={href('livsmedel', 'olivolja')}>Olivolja</a>: Linns schema skriver "1 matsked oliv" – ej verifierat för Linn.</li>
        <li>Kaffe och te: kostschemana anger örtte som tillåten dryck – kaffe/te kan inte verifieras.</li>
        <li><a href={href('livsmedel', 'ortte')}>Örtte</a>: tillåtet men villkorat – örten måste själv vara tillåten.</li>
        <li>"NÖT" tolkas som nötkött (står under PROTEIN i rotationsschemat).</li>
        <li>Rapporterna anger "Item Count: 250" men sida 1 visar {L.alcat.printedItems} (Linn) resp. {P.alcat.printedItems} (Patrik) livsmedel plus blå rutor.</li>
        <li>Panelerna skiljer sig: Dragon fruit och Yellow pea finns bara i Linns; Allulose, Habanero pepper, Jackfruit, Poppy seed och Red palm fruit bara i Patriks.</li>
      </ul>

      <p className="footnote">Detta verktyg ersätter inte råd från behandlande klinik. Vid tveksamhet gäller originaldokumenten.</p>
    </div>
  );
}
