exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API-nyckel saknas på servern.' }) };
  }

  let image;
  try {
    ({ image } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ogiltig förfrågan.' }) };
  }

  if (!image || !image.startsWith('data:image')) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bilden saknas eller har fel format.' }) };
  }

  const PROMPT = `Du är kostrådgivare för Patrik Rees som följer Green Phase-protokollet (efter Detox 21).

GREEN LIST — TILLÅTNA LIVSMEDEL (ENDA TILLÅTNA LISTAN, baserad på Patriks
riktiga ALCAT-test):
Protein: Kyckling, kalkon, ägg, anka, hjortkött, musslor, ostron, hummer, vongole, kikärtor, canellinibönor, linser, favabönor
Grönsaker: Grönkål, spenat, romansallad, selleri, sommarsquash, aubergine, blomkål, butternutpumpa, tomat
Frukt: Banan, kiwi, ananas, apelsin, mandarin, mango, papaya, persika, vindruvor, granatäpple, melon, vattenmelon, avokado, citron, lime
Stärkelse: Sötpotatis, bovete-knäckebröd (Le Pain des Fleurs), bovete, rött ris
Fetter & Frön: Olivolja extra virgin, ankfett, tahini (ljus), chiafrön, pumpafrön, solrosfrön
Kryddor & Övrigt: Celtic salt, citron, lime, manuka honung, örtte, timjan

STRIKT FÖRBJUDET — nolltolerans:
- ALL fisk (lax, torsk, sill, tonfisk, sardiner, makrill, röding m.fl.)
- Räkor, krabba, pilgrimsmusslor/kammusslor (EJ tillåtna skaldjur — bara musslor, ostron, hummer och vongole är ALCAT grönt)
- Alla mejeriprodukter (mjölk, ost, smör, yoghurt, grädde, kvarg m.fl.)
- Allt gluten (vete, råg, korn, spelt, vanligt bröd, pasta m.fl.)
- Allt socker (inkl. agave, lönnsirap, björksocker, alla sötningsmedel)
- Jäst, fermenterade produkter, ättika/vinäger, pickles, soja, miso
- Alkohol (även matlagningsvin)
- Processade produkter, konserveringsmedel, tillsatser
- Äpple, päron (ALCAT måttlig reaktion)
- Broccoli, sparris, rödbetor, morötter, zucchini, pak choi, quinoa, blåbär, hallon, ingefära, hampafrön (ALCAT mild/måttlig reaktion — INTE på Green List trots att de ofta räknas som hälsosamma; undviks tills tidigast dag 90)

INSTRUKTION:
1. Identifiera EXAKT vad som visas på bilden (produkt, ingrediens, maträtt, förpackning).
2. Om det är en förpackning — läs ingredienslistan om den syns.
3. Kontrollera mot Green List ovan.
4. Välj status:
   - "Tillåtet" ENDAST om produkten/ingrediensen finns explicit på Green List och innehåller INGA förbjudna ingredienser.
   - "Ej tillåtet" om produkten innehåller minst en förbjuden ingrediens.
   - "Osäkert" om du inte kan avgöra med säkerhet (otydlig bild, okänd produkt, sammansatt produkt med oklar innehållsförteckning).
5. Vid minsta tveksamhet: välj "Osäkert" — ALDRIG "Tillåtet" om du är osäker.

Svara ENBART med ett JSON-objekt i exakt detta format (inga kommentarer, inga markdown-block):
{
  "found": "Vad du identifierat på bilden (kort, tydlig beskrivning på svenska)",
  "status": "Tillåtet",
  "motivering": "Kort förklaring på svenska — varför tillåtet/ej tillåtet/osäkert"
}

Värdet på "status" ska vara EXAKT ett av: "Tillåtet", "Ej tillåtet", "Osäkert"`;

  let openaiRes;
  try {
    openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'image_url', image_url: { url: image } },
              { type: 'text', text: PROMPT },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500,
      }),
    });
  } catch (err) {
    console.error('Fetch to OpenAI failed:', err.message);
    return { statusCode: 502, body: JSON.stringify({ error: 'Kunde inte nå analysservern.' }) };
  }

  const rawBody = await openaiRes.text();
  console.log('OpenAI status:', openaiRes.status);

  if (!openaiRes.ok) {
    return { statusCode: 502, body: JSON.stringify({ error: `Analysfel ${openaiRes.status}.` }) };
  }

  let data, text;
  try {
    data = JSON.parse(rawBody);
    text = data?.choices?.[0]?.message?.content ?? '';
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Oväntat svar från analysen.' }) };
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Kunde inte tolka analyssvaret.', raw: text.slice(0, 200) }) };
  }

  // Safety check: never allow "Tillåtet" if motivering mentions fish or forbidden items
  const forbiddenKeywords = [
    'fisk', 'lax', 'torsk', 'sill', 'tonfisk', 'mejeri', 'gluten', 'socker', 'jäst',
    'räka', 'räkor', 'krabba', 'pilgrimsmussla', 'kammussla', 'äpple', 'päron',
    'broccoli', 'sparris', 'rödbeta', 'morot', 'zucchini', 'pak choi', 'quinoa',
    'blåbär', 'hallon', 'ingefära', 'hampafrön',
  ];
  const motivering = (parsed.motivering || '').toLowerCase();
  if (parsed.status === 'Tillåtet' && forbiddenKeywords.some(k => motivering.includes(k))) {
    parsed.status = 'Osäkert';
    parsed.motivering = 'Kontrollmanuellt — misstänkt otillåten ingrediens hittades. ' + parsed.motivering;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  };
};
