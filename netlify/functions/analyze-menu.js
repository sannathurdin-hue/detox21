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

  console.log('Image prefix:', image.slice(0, 60));

  const PROMPT = `Du är kostrådgivare för Patrik Rees som följer Green Phase-protokollet (efter Detox 21, 90 dagar).

PROTOKOLLREGLER — nolltolerans:
- Ingen fisk (lax, torsk, sill, tonfisk, sardiner, makrill m.fl.) — Patrik äter INTE fisk. Skaldjur (räkor, pilgrimsmusslor, hummer, krabba, musslor) är OK.
- Inga mejeriprodukter (mjölk, ost, smör, grädde, yoghurt m.fl.).
- Inget gluten (vete, råg, korn, pasta, vanligt bröd m.fl.).
- Inget socker, agave, lönnsirap eller sötningsmedel.
- Ingen jäst, ingen ättika/vinäger, inga fermenterade produkter.
- Inget alkohol eller matlagningsvin.
- Tillagningsfett: ankfett i första hand — annars be om grillat/ångat eller olivolja.
- Dryck: bara vatten eller örtte.

DITT UPPDRAG — MYCKET VIKTIGT:
Du ska ALLTID hitta det bästa möjliga alternativet på menyn, även om det kräver modifieringar. Det finns nästan alltid något som går att anpassa. Säg ALDRIG att det inte finns något lämpligt utan att ha försökt hitta det bästa alternativet med anpassningar.

Välj i prioritetsordning:
1. Kycklingrätt, kalkonrätt, ankrätt, hjortköttrsätt eller skaldjursrätt som kan göras utan mejeri/gluten/socker.
2. Grönsakssallad eller grönsaksrätt som kan anpassas (utan ost, utan dressing med vinäger — be om olivolja och citron istället).
3. Kött- eller proteinrätt som kan tillagas utan förbjudna ingredienser.
4. Om inget ens kan anpassas: beskriv ändå det minst dåliga valet och vad Patrik bör undvika på tallriken.

Analysera menyn på bilden och svara ENBART med ett JSON-objekt i exakt detta format (inga kommentarer, inga markdown-block):
{
  "basta_val": "Namn på rätten + konkret beställningsinstruktion, t.ex. 'Grillad kyckling — beställ utan smörsås, be om olivolja och citron på sidan.'",
  "be_om_andring": ["Konkret ändring 1 att be servitören om", "Konkret ändring 2"],
  "undvik": ["Rätt eller ingrediens att undvika 1", "Rätt 2"],
  "riskniva": "low",
  "riskniva_motivering": "Kort förklaring av risknivån och eventuella dolda risker.",
  "om_inget_funkar": "Konkret råd om Patrik ändå inte kan äta något — t.ex. beställ bara grönsaker, drick vatten, ät innan/efter."
}
Värdet på riskniva ska vara exakt ett av: low, medium, high.`;

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
              {
                type: 'image_url',
                image_url: { url: image },
              },
              {
                type: 'text',
                text: PROMPT,
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
      }),
    });
  } catch (err) {
    console.error('Fetch to OpenAI failed:', err.message);
    return { statusCode: 502, body: JSON.stringify({ error: 'Kunde inte nå OpenAI.' }) };
  }

  const rawBody = await openaiRes.text();
  console.log('OpenAI status:', openaiRes.status);
  console.log('OpenAI response:', rawBody.slice(0, 600));

  if (!openaiRes.ok) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: `OpenAI-fel ${openaiRes.status}.`, detail: rawBody.slice(0, 400) }),
    };
  }

  let data;
  try {
    data = JSON.parse(rawBody);
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Oväntat svar från OpenAI.' }) };
  }

  const text = data?.choices?.[0]?.message?.content ?? '';

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Kunde inte tolka AI-svaret.', raw: text.slice(0, 400) }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  };
};
