// Individuella kostscheman / Gröna listan – citat återgivna ordagrant från källdokumenten.
// Linn: 02_Linn_Grant_kostschema_grona_listan.docx (sida 1 = schema, sida 2 = "OBS"-anteckningar)
// Patrik: 04_Patrik_Rees_kostschema_grona_listan_TRANSKRIBERAD.pdf (sida 1 = schema, sida 2 = "ANTECKNINGAR")

import { DOCS } from './alcat.mjs';

export const PLANS = {
  linn: {
    document: DOCS.linnPlan,
    header: { quote: 'Namn: Linn Regler · Datum: 2026 07 29 · 3 timmarsintervall 2 ½ - 3 ½ · Kodnummer: 230233 · Gröna listan · 10-12 glass vatten dagligen', page: 1 },
    meals: [
      { time: '07:30', name: 'Frukost', text: 'Fruktsallad + 1 tsk tahini (zeina) eller valnötssmör + 1 st knäckebröd', page: 1 },
      { time: '10:00', name: 'Mellanmål', text: 'frukt (från den gröna listan)', page: 1 },
      { time: '13:00', name: 'Lunch', text: 'LUNCH – MIDDAG ÄR SAMMA (se veckodag)', page: 1 },
      { time: '16:00', name: 'Mellanmål', text: 'grönsaker (gröna listan)', page: 1 },
      { time: '19:00', name: 'Middag', text: 'MIDDAG: LUNCH – MIDDAG ÄR SAMMA', page: 1 },
      { time: '22:00', name: 'Mellanmål', text: 'Grönsaker eller frukt', page: 1 },
    ],
    week: {
      mon: { theme: 'Spannmål / Stärkelse', text: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + ris / linser pasta', page: 1 },
      tue: { theme: null, text: 'Grönsakssoppa (laktosfri, potatisfri) + knäckebröd + färsk sallad eller Fisksoppa (laktosfri, potatisfri) + knäckebröd + färsk sallad. Om du inte vill ha soppa kan du upprepa fredagens eller lördagens meny', page: 1 },
      wed: { theme: 'vitt kött', text: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + kalkon / kyckling', page: 1 },
      thu: { theme: 'baljväxter', text: 'Färsk sallad + baljväxter + knäckebröd', page: 1 },
      fri: { theme: 'Vegetarisk', text: 'Grönsaksgryta + knäckebröd + färsk sallad', page: 1 },
      sat: { theme: 'fisk', text: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + fisk', page: 1 },
      sun: { theme: 'rött kött', text: 'Ugnsbakade/kokta/grillade/ångkokta grönsaker + färsk sallad + kalvkött / fläskkött', page: 1 },
    },
    notes: [
      { text: 'Fortsätt äta var tredje timme. Hoppa inte över måltider och ät allt som står skrivet på varje rad!', page: 2 },
      { text: 'Konsumera endast keltiskt salt / havssalt.', page: 2 },
      { text: 'Det är en 180-dagars dietplan utan mejeriprodukter', page: 2 },
      { text: 'Det är en 120 -dagars dietplan utan jäst, vin, öl, vindruvor, socker, fermenterade produkter, vinäger', page: 2 },
      { text: 'Kokosfett för stekning', page: 2 },
      { text: 'Tillåtna drycker och brygder: - Örtte -Majskakor som knäckebröd', page: 2 },
      { text: 'Restaurangportioner. Om det känns otillräckligt bör du äta lite mer men bara under lunch eller middag (aldrig senare!).', page: 2 },
      { text: '1 matsked oliv till sallad och grönsaksportion till lunch och middag.', page: 2 },
      { text: '10-12 glas vatten dagligen. 2,5 liter', page: 2 },
    ],
  },

  patrik: {
    document: DOCS.patrikPlan,
    header: { quote: 'Namn: Patrik Regler · Datum: 2026 03 02 - 3 timmarsintervall 2 ½ - 3 ½ · Kodnummer: 230233 - Gröna listan · 10-12 glas vatten dagligen', page: 1 },
    meals: [
      { time: '06:15', name: 'Frukost', text: 'Fruktsallad + 1 tsk tahini (ljus sesampasta) + 1 tsk manuka honung + 1 st knäckebröd', page: 1 },
      { time: '09:00', name: 'Mellanmål', text: 'frukt (från gröna listan)', page: 1 },
      { time: '12:00', name: 'Lunch', text: 'LUNCHEN - MIDDAGEN ÄR LIKADANA (se veckodag)', page: 1 },
      { time: '15:00', name: 'Mellanmål', text: 'grönsaker (gröna listan)', page: 1 },
      { time: '18:00', name: 'Middag', text: 'MIDDAG: LUNCHEN - MIDDAGEN ÄR LIKADANA', page: 1 },
      { time: '21:00', name: 'Mellanmål', text: 'Grönsaker (ej förbjudna)', page: 2 },
    ],
    week: {
      mon: { theme: 'Korn / Stärkelser', text: 'Bakade/kokta/grillade/ångkokta grönsaker + färsk sallad + hirs / ris / majs / sötpotatis', page: 1 },
      tue: { theme: null, text: 'Grönsakssoppa (utan laktos, utan potatis) + knäckebröd + färsk sallad eller Fisksoppa (utan laktos, utan potatis) + knäckebröd + färsk sallad. Om du vill inte ha soppa kan du repetera fredags eller lördags meny', page: 1 },
      wed: { theme: 'vit kött', text: 'Bakade/kokta/grillade/ångkokta grönsaker + färsk sallad + kyckling / kalkon / ägg', page: 1 },
      thu: { theme: 'baljväxter', text: 'Färsk sallad + baljväxter + knäckebröd', page: 1 },
      fri: { theme: 'Vegetarian', text: 'Grönsaksgryta + knäckebröd + färsk sallad', page: 1 },
      sat: { theme: 'fisk', text: 'Bakade/kokta/grillade/ångkokta grönsaker + färsk sallad + fisk', page: 1 },
      sun: { theme: 'rött kött', text: 'Bakade/kokta/grillade/ångkokta grönsaker + Färsk sallad + anka / hjortkött', page: 1 },
    },
    notes: [
      { text: "Keep eating every 3 hours. Don't skip meals and eat everything that's written on each line!", page: 2 },
      { text: 'Konsumera bara celtic salt / havssalt.', page: 2 },
      { text: 'Det är ett 180-dagars kostschema utan mejeriprodukter.', page: 2 },
      { text: 'Det är ett 180-dagars kostschema utan jäst, vin, öl, vindruvor, socker, fermenterade produkter, vinäger.', page: 2 },
      { text: 'Ankfett som fett att steka mat.', page: 2 },
      { text: 'Tillåtna drycker och brygder: Herbal tea (örtte).', page: 2 },
      { text: 'Restaurangportioner. Om det känns otillräckligt skulle du äta lite mer men bara under lunch eller middagstid (aldrig senare!).', page: 2 },
      { text: '1 msk olivolja till sallad och grönsaksportion till lunch och middag.', page: 2 },
      { text: '10-12 glas vatten dagligen.', page: 2 },
    ],
  },
};

// Strukturerade regler som påverkar enskilda livsmedel.
// effect: FORBID | ALLOW | CONDITIONAL | DRINK_NOT_LISTED
export const PLAN_RULES = {
  linn: {
    dairy: { effect: 'FORBID', duration: '180 dagar', quote: 'Det är en 180-dagars dietplan utan mejeriprodukter', page: 2 },
    yeastEtc: { effect: 'FORBID', duration: '120 dagar', quote: 'Det är en 120 -dagars dietplan utan jäst, vin, öl, vindruvor, socker, fermenterade produkter, vinäger', page: 2 },
    salt: { effect: 'ALLOW', quote: 'Konsumera endast keltiskt salt / havssalt.', page: 2 },
    saltOther: { effect: 'FORBID', duration: 'Hela kostschemat (ingen tidsgräns angiven)', quote: 'Konsumera endast keltiskt salt / havssalt.', page: 2 },
    fryingFat: { effect: 'ALLOW', quote: 'Kokosfett för stekning', page: 2 },
    drinks: { effect: 'CONDITIONAL', quote: 'Tillåtna drycker och brygder: - Örtte', page: 2 },
    crispbread: { effect: 'ALLOW', quote: '-Majskakor som knäckebröd', page: 2 },
    water: { effect: 'ALLOW', quote: '10-12 glas vatten dagligen. 2,5 liter', page: 2 },
    breakfast: { effect: 'ALLOW', quote: 'Fruktsallad + 1 tsk tahini (zeina) eller valnötssmör + 1 st knäckebröd', page: 1 },
    monday: { effect: 'ALLOW', quote: 'MÅNDAG (Spannmål / Stärkelse) … + ris / linser pasta', page: 1 },
    oil: { effect: 'AMBIGUOUS', quote: '1 matsked oliv till sallad och grönsaksportion till lunch och middag.', page: 2 },
  },
  patrik: {
    dairy: { effect: 'FORBID', duration: '180 dagar', quote: 'Det är ett 180-dagars kostschema utan mejeriprodukter.', page: 2 },
    yeastEtc: { effect: 'FORBID', duration: '180 dagar', quote: 'Det är ett 180-dagars kostschema utan jäst, vin, öl, vindruvor, socker, fermenterade produkter, vinäger.', page: 2 },
    salt: { effect: 'ALLOW', quote: 'Konsumera bara celtic salt / havssalt.', page: 2 },
    saltOther: { effect: 'FORBID', duration: 'Hela kostschemat (ingen tidsgräns angiven)', quote: 'Konsumera bara celtic salt / havssalt.', page: 2 },
    fryingFat: { effect: 'ALLOW', quote: 'Ankfett som fett att steka mat.', page: 2 },
    drinks: { effect: 'CONDITIONAL', quote: 'Tillåtna drycker och brygder: Herbal tea (örtte).', page: 2 },
    water: { effect: 'ALLOW', quote: '10-12 glas vatten dagligen.', page: 2 },
    breakfast: { effect: 'ALLOW', quote: 'Fruktsallad + 1 tsk tahini (ljus sesampasta) + 1 tsk manuka honung + 1 st knäckebröd', page: 1 },
    wednesday: { effect: 'ALLOW', quote: 'ONSDAG (vit kött) … + kyckling / kalkon / ägg', page: 1 },
    oil: { effect: 'ALLOW', quote: '1 msk olivolja till sallad och grönsaksportion till lunch och middag.', page: 2 },
  },
};
