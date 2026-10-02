# QA-rapport – Matguide Linn + Patrik, dag 1–21

Genererad automatiskt av `scripts/qa.mjs` från `src/data/foods.json`.

## Källor
- 01_Linn_Grant_ALCAT_svenska.pdf – ALCAT, provdatum 07/06/2026, Lab ID 621943
- 02_Linn_Grant_kostschema_grona_listan.docx – kostschema / Gröna listan
- 03_Patrik_Rees_ALCAT_svenska.pdf – ALCAT, provdatum 02/12/2026, Lab ID 607518
- 04_Patrik_Rees_kostschema_grona_listan_TRANSKRIBERAD.pdf – kostschema / Gröna listan (transkribering)
- CNA/CMA: ingår inte i underlaget och används inte.

## Antal (beräknat från databasen)
| | Antal |
|---|---|
| A. Unika livsmedel i databasen | 256 |
| B. Båda kan äta (verifierat) | 78 |
| C. Endast Linn | 50 |
| D. Endast Patrik | 46 |
| E. Båda undviker | 63 |
| F. Ej verifierade | 16 |
| G. Datakonflikter | 2 |
| Villkorat (restriktion för båda) | 1 |

Per person (slutstatus dag 1–21):

| | Tillåten | Undvik | Villkorad | Ej verifierad | Datakonflikt |
|---|---|---|---|---|---|
| Linn | 132 | 112 | 2 | 8 | 2 |
| Patrik | 126 | 119 | 1 | 9 | 1 |

## Re:store by Sanna
| | Antal |
|---|---|
| RE:STORE FOODS VERIFIED FOR BOTH | 78 |
| LINN ONLY | 50 |
| PATRIK ONLY | 46 |
| NOT INCLUDED (ej tillåtet för båda) | 169 |
| UNVERIFIED | 7 |
| DATA CONFLICTS (livsmedel) | 2 |
| 21-DAY PLAN | 21 / 21 DAYS PASS |

| Dag | Veckodag | Resultat | Orsak |
|---|---|---|---|
| Dag 1 | mon | PASS |  |
| Dag 2 | tue | PASS |  |
| Dag 3 | wed | PASS |  |
| Dag 4 | thu | PASS |  |
| Dag 5 | fri | PASS |  |
| Dag 6 | sat | PASS |  |
| Dag 7 | sun | PASS |  |
| Dag 8 | mon | PASS |  |
| Dag 9 | tue | PASS |  |
| Dag 10 | wed | PASS |  |
| Dag 11 | thu | PASS |  |
| Dag 12 | fri | PASS |  |
| Dag 13 | sat | PASS |  |
| Dag 14 | sun | PASS |  |
| Dag 15 | mon | PASS |  |
| Dag 16 | tue | PASS |  |
| Dag 17 | wed | PASS |  |
| Dag 18 | thu | PASS |  |
| Dag 19 | fri | PASS |  |
| Dag 20 | sat | PASS |  |
| Dag 21 | sun | PASS |  |



## Automatiska kontroller
- ✅ linn: ALCAT-status för varje livsmedel stämmer mot originaltranskriberingen
- ✅ patrik: ALCAT-status för varje livsmedel stämmer mot originaltranskriberingen
- ✅ linn: transkribering identisk med PDF-texten (alla nivåkolumner)
- ✅ patrik: transkribering identisk med PDF-texten (alla nivåkolumner)
- ✅ ALCAT-status och slutstatus dag 1–21 är separata fält med giltiga värden
- ✅ 4. Kostschema-förbud överstyr grön ALCAT (t.ex. jäst, vindruva) — Bakjäst, Bryggjäst, Näringsjäst, Vindruva
- ✅ 4b. Bakjäst: grön i Linns ALCAT men INTE tillåten dag 1–21
- ✅ 4c. Vindruva: grön i Patriks ALCAT men INTE tillåten dag 1–21
- ✅ 5. "Båda kan äta" innehåller endast livsmedel där båda har slutstatus ALLOWED
- ✅ 5b. Inget livsmedel med ALCAT-reaktion/eliminering hos någon ligger under "Båda kan äta"
- ✅ 5c. Omvänt: alla med ALLOWED för båda ligger under "Båda kan äta"
- ✅ 6. Ej testade/härledda livsmedel är tillåtna endast med uttryckligt stöd i kostschema/användarbeslut
- ✅ 6b. ALCAT-poster som bara finns i den ena panelen är "Ej verifierat" för den andra
- ✅ 7. Unika id:n – inget livsmedel förekommer två gånger
- ✅ 7b. Unika normaliserade namn
- ✅ 11. Varje fastställd status (ej "Ej verifierat") har minst en källa
- ✅ 11b. Varje källa har dokument och text
- ✅ 11c. Tillåtna livsmedel har ett "tillåten"-skäl, undvikna har ett "undvik"-skäl
- ✅ 12. Ingen CNA/CMA-information används som livsmedelsklassificering
- ✅ 12b. Blå markörer (Candida, gluten, kasein …) är inte egna livsmedel
- ✅ 13. Varje "Undvik" har en angiven varaktighet (alla källregler ≥ 3 mån/120 dagar > 21 dagar)
- ✅ Datakonflikter markeras och hamnar aldrig under "Båda kan äta"
- ✅ R1. Re:store ALLOWED_FOR_BOTH ⇔ Linn ALLOWED och Patrik ALLOWED (inga undantag)
- ✅ R2. Datakonflikt/ej verifierat hamnar aldrig i Re:store
- ✅ R3. Varje öppen datakonflikt har person, källa A och källa B
- ✅ R4. Varje ingrediens i varje måltid i 21-dagarsplanen är tillåten för båda
- ✅ R5. Dryck i planen är tillåten för båda
- ✅ R6. Planen har exakt 21 dagar, 6 måltider per dag, lunch = middag
- ✅ R7. Dagar som fallerar gör det ENDAST p.g.a. dokumenterad lucka i källmaterialet

## Datakonflikter
- **Endiv (Linn)** – Källa A: 01_Linn_Grant_ALCAT_svenska.pdf s. 1, Kolumn MILD*: "ENDIV*" → *Mild reaktion (gul*)*. Källa B: 01_Linn_Grant_ALCAT_svenska.pdf s. 1, Kolumn ACCEPTABEL/INGEN REAKTION – VEGETABLES / LEGUMES: "ENDIV" → *Acceptabel / ingen reaktion (grön)*.
- **Endiv (Patrik)** – Källa A: 03_Patrik_Rees_ALCAT_svenska.pdf s. 1, Kolumn MILD*: "ENDIV*" → *Mild reaktion (gul*)*. Källa B: 03_Patrik_Rees_ALCAT_svenska.pdf s. 1, Kolumn ACCEPTABEL/INGEN REAKTION – VEGETABLES / LEGUMES: "ENDIV" → *Acceptabel / ingen reaktion (grön)*.
- **Havsabborre (Linn)** – Källa A: 01_Linn_Grant_ALCAT_svenska.pdf s. 1, Kolumn MÅTTLIG: "HAVSABBORRE" → *Måttlig reaktion*. Källa B: 01_Linn_Grant_ALCAT_svenska.pdf s. 1, Kolumn ACCEPTABEL/INGEN REAKTION – SKALDJUR: "HAVSABBORRE" → *Acceptabel / ingen reaktion (grön)*.
- **Manukahonung (Patrik) – LÖST:** Källa A: Fruktsallad + 1 tsk tahini (ljus sesampasta) + 1 tsk manuka honung + 1 st knäckebröd → *1 tsk manuka honung ingår i frukosten*. Källa B: Blå ruta CANDIDA ALBICANS (MÅTTLIG) – "Also eliminate these foods: AGAVE, HONUNG, LÖNNSOCKER, MELASS, RÖRSOCKER" → *Honung ska elimineras*. Användarbeslut 2026-10-02: "Manukahonung är ok. det ska inte räknas som honung."

## Tvetydigheter och tolkningsbeslut
- **Endiv (båda):** ENDIV står både under MILD* och under ACCEPTABEL/INGEN REAKTION i båda rapporterna (och två gånger samma rotationsdag). Troligen två panelposter med samma svenska översättning. → Datakonflikt – kräver kontroll.
- **Havsabborre (Linn):** HAVSABBORRE står både under MÅTTLIG och under SKALDJUR/ACCEPTABEL i Linns rapport. → Datakonflikt för Linn. (Patrik: två gånger, båda gröna → tillåten.)
- **Koriander, Mussla:** Förekommer två gånger med samma nivå (Linn: båda gröna; Patrik: koriander båda måttlig, mussla båda gröna). Ingen konflikt, men det är två panelposter med samma namn.
- **Mild (gul*) reaktion:** Rapporten säger: undvik 3 månader, alternativt rotation var 4:e dag. Eftersom kostschemana bygger på "Gröna listan" räknas mild som "Undvik" dag 1–21. Kontrollera om det stämmer med behandlande klinik.
- **Olivolja (Linn):** Linns schema skriver "1 matsked oliv till sallad…" – ordet olivolja står inte. → Ej verifierat för Linn.
- **Kaffe, grönt te, svart te:** Kostschemana anger örtte som tillåten dryck/brygd. Kaffe/te nämns inte → Ej verifierat där ALCAT är grönt.
- **Örtte:** Tillåtet enligt båda kostschemana, men örten måste själv vara tillåten (t.ex. kamomill: Linn måttlig, Patrik mild). → Villkorat.
- **Knäckebröd:** Linn: endast majskakor anges. Patrik: sort anges inte. → Inte gemensamt verifierat.
- **Manukahonung:** Användarbeslut 2026-10-02: "Manukahonung är ok. det ska inte räknas som honung." Tillåten för båda på den grunden (Linns kostschema nämner inte manukahonung). ALCAT:s "HONUNG" (Candida-rutan) gäller fortsatt vanlig honung.
- **Nöt:** "NÖT" tolkas som nötkött (står under PROTEIN i rotationsschemat).
- **Vit potatis (Linn):** Grön i ALCAT. Schemat säger "potatisfri" endast för tisdagssoppan. Tillåten.
- **Kokosfett, ankfett, valnötssmör, majskakor, linspasta:** Tillåtna endast för den person vars kostschema uttryckligen nämner dem. För den andra: Ej verifierat.
- **Item Count 250:** Rapporterna anger "Item Count: 250" men sida 1 visar 222 (Linn) resp. 225 (Patrik) livsmedelsrader plus blå rutor. Övriga panelposter syns inte i underlaget.
- **Panelskillnader:** Linn är testad för Dragon fruit och Yellow pea; Patrik för Allulose, Habanero pepper, Jackfruit, Poppy seed och Red palm fruit. Ej testat hos den andra → Ej verifierat.
