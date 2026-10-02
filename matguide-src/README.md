# Matguide – Linn + Patrik, dag 1–21

Svarar på: **Vad kan Linn och Patrik båda äta under de första 21 dagarna?**

Publiceras som statisk sida på `/matguide/` (byggd till `../matguide`, ingen backend, inga externa API:er).

## Arbetsflöde
```
npm install
npm run data   # bygger src/data/foods.json + meta.json från data/*.mjs
npm run qa     # automatiska QA-kontroller → QA-RAPPORT.md (avbryter vid fel)
npm test       # vitest: logik, sök/tabell/personvy-konsistens, alla vyer renderar
npm run build  # data + qa + typecheck + vite build → ../matguide
```
`ALCAT_TXT_DIR=<katalog> npm run qa` kontrollerar även transkriberingen mot `pdftotext -layout`-text av ALCAT-rapporternas sida 1 (`linn_p1.txt`, `pat_p1.txt`). Källdokumenten checkas inte in.

## Data
- `data/alcat.mjs` – ordagrann transkribering av båda ALCAT-rapporterna (sida 1 + förklaringssidan).
- `data/rotation.json` – ALCAT 4-dagarsrotation (sida 3).
- `data/plans.mjs` – kostschemanas regler, ordagranna citat med sidnummer.
- `data/catalog.mjs` – visningsnamn, praktisk kategori, sökalias (endast otvetydiga synonymer).
- `scripts/build-db.mjs` – beräknar slutstatus dag 1–21 per person och jämförelsestatus.

## Regler för slutstatus
1. Allvarlig/måttlig/mild ALCAT-reaktion → Undvik (mild räknas som undvik eftersom kostschemana bygger på "Gröna listan").
2. "Also eliminate these foods" i ALCAT:s blå rutor → Undvik.
3. Kostschemats förbud överstyr grön ALCAT → Undvik.
4. Grön ALCAT utan begränsning, eller uttryckligen i kostschemat → Tillåten.
5. Ej testad och ej nämnd → Ej verifierat. Motsägelse → Datakonflikt.
6. **Båda kan äta** kräver Tillåten för båda – inga undantag.

Användarbeslut (2026-10-02): manukahonung räknas inte som honung och är tillåten.
