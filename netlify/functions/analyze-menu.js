exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API-nyckel saknas på servern.' }) };
  }

  let imageBase64, mimeType;
  try {
    ({ imageBase64, mimeType } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Ogiltig förfrågan.' }) };
  }

  const PROMPT = `Du är kostrådgivare för Patrik Rees som följer ett strikt 21-dagars detoxprotokoll.

DETOXREGLER:
- Ingen mejeriprodukter, inkl. smör.
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

Analysera restaurangmenyn på bilden och svara ENBART med ett JSON-objekt i följande format (inga kommentarer, inga markdown-block):
{
  "basta_val": "Beskriv det bästa matvalet från menyn, inkl. hur man beställer det (t.ex. 'utan sås', 'grillat i olivolja').",
  "be_om_andring": ["Konkret ändring 1 att be om", "Konkret ändring 2"],
  "undvik": ["Rätt eller ingrediens att undvika 1", "Rätt 2"],
  "riskniva": "low | medium | high",
  "riskniva_motivering": "Kort förklaring av risknivån.",
  "om_inget_funkar": "Vad Patrik ska göra om inget passar — t.ex. beställa enkla ångade grönsaker och vatten."
}`;

  let openaiRes;
  try {
    openaiRes = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_image',
                image_url: `data:${mimeType};base64,${imageBase64}`,
              },
              {
                type: 'input_text',
                text: PROMPT,
              },
            ],
          },
        ],
        text: { format: { type: 'json_object' } },
      }),
    });
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: 'Kunde inte nå OpenAI.' }) };
  }

  if (!openaiRes.ok) {
    const errText = await openaiRes.text();
    return { statusCode: 502, body: JSON.stringify({ error: `OpenAI-fel: ${openaiRes.status}`, detail: errText }) };
  }

  const data = await openaiRes.json();
  const text = data?.output?.[0]?.content?.[0]?.text ?? '';

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { statusCode: 502, body: JSON.stringify({ error: 'Kunde inte tolka svaret från AI.', raw: text }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  };
};
