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

  const PROMPT = `Du är kostrådgivare för Patrik Rees som följer ett strikt detoxprotokoll (Detox 21 / Green Phase).

PROTOKOLLREGLER — nolltolerans:
- Ingen fisk (lax, torsk, sill, tonfisk, sardiner, makrill m.fl.) — Patrik äter inte fisk. Skaldjur (räkor, pilgrimsmusslor) är OK.
- Inga mejeriprodukter, inkl. smör.
- Inget gluten.
- Inget socker, agave, lönnsirap, sötningsmedel.
- Ingen jäst.
- Inget ättika/vinäger.
- Inget vin, öl eller fermenterade produkter.
- Tillagningsfett ska helst vara ankfett — annars be om rent grillat/ångat eller bara olivolja.
- Sallad: olivolja och Celtic/havssalt är OK.
- Dryck: bara vatten eller örtte.
- Efter 18:00: enbart grönsaker — ingen stärkelse eller protein.
- Lunch och middag ska följa dagens detox-tema om möjligt.
- Om menyn är oklar: markera risk som medium eller high och ange exakta följdfrågor att ställa till servitören.

Analysera restaurangmenyn på bilden och svara ENBART med ett JSON-objekt i exakt detta format (inga kommentarer, inga markdown-block):
{
  "basta_val": "Beskriv det bästa matvalet från menyn, inkl. hur man beställer det.",
  "be_om_andring": ["Konkret ändring 1 att be om", "Konkret ändring 2"],
  "undvik": ["Rätt eller ingrediens att undvika 1", "Rätt 2"],
  "riskniva": "low",
  "riskniva_motivering": "Kort förklaring av risknivån.",
  "om_inget_funkar": "Vad Patrik ska göra om inget passar."
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
