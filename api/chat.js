import OpenAI from 'openai';

// Used by both Vercel and the local Express server.
export default async function chat(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Use POST /api/chat.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
  }
  const { userMessage, conversationHistory = [] } = body ?? {};
  if (typeof userMessage !== 'string' || !userMessage.trim() || userMessage.length > 10000) {
    return res.status(400).json({ error: 'Send a message between 1 and 10000 characters.' });
  }
  if (!Array.isArray(conversationHistory) || conversationHistory.length > 200 ||
      conversationHistory.some(message =>
        !message || !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string' || !message.content.trim() ||
        message.content.length > 10000)) {
    return res.status(400).json({ error: 'Invalid conversation history. Start a new chat if it is too long.' });
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    console.error('OPENAI_API_KEY is missing from the server environment.');
    return res.status(500).json({ error: 'The server API key is not configured.' });
  }

  try {
    const client = new OpenAI({ timeout: 45000, maxRetries: 0 });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions: process.env.OPENAI_INSTRUCTIONS ||
        'You are AniMORE\'s helpful assistant. Answer clearly and concisely.',
      input: [
        ...conversationHistory.map(({ role, content }) => ({ role, content })),
        { role: 'user', content: userMessage.trim() },
      ],
      max_output_tokens: 1200,
      store: false,
    });

    const reply = response.output_text?.trim();
    if (!reply) {
      return res.status(502).json({ error: 'OpenAI returned no text. Please try again.' });
    }
    return res.status(200).json({ reply });
  } catch (error) {
    // Log diagnostic codes only, never credentials or the complete request.
    console.error('OpenAI request failed:', {
      status: error.status,
      code: error.code,
      type: error.name,
    });
    const message = error.status === 401
      ? 'OpenAI rejected the server API key. Check OPENAI_API_KEY and restart the server.'
      : error.status === 429
        ? 'OpenAI could not accept the request. Check API credits and rate limits.'
        : 'The server could not get a reply from OpenAI. Check the backend terminal or Vercel logs.';
    return res.status(error.status === 429 ? 429 : 502).json({ error: message });
  }
}
