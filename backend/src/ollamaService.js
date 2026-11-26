// ─── Ollama chat helper (runs fully local, no API key needed) ──────────────
// Make sure Ollama is running:  ollama serve   (default: http://localhost:11434)
// And pull a model once:        ollama pull llama3.2

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const SYSTEM_PROMPT = `You are "Nudu Assistant", the friendly virtual skincare advisor for NUDU Beauty & Fragrance, an online skincare store in Pakistan (prices shown in PKR).

Rules:
- Keep answers short (max ~120 words), warm and easy to understand.
- Give general skincare advice: routines (AM/PM), ingredients (niacinamide, retinol, salicylic acid, hyaluronic acid, vitamin C, etc.), skin types (oily, dry, combination, sensitive, acne-prone), and product recommendations by category (Cleansers, Toners, Serums, Moisturizers, Sunscreen, Masks, Body Care, Fragrance).
- If asked about prices, mention typical Pakistani price ranges in PKR but say exact prices are shown on the Shop page.
- Never diagnose medical conditions; for persistent problems suggest seeing a dermatologist.
- You may answer simple everyday questions politely, then gently steer back to skincare.`;

/**
 * Ask Ollama a question with conversation history.
 * @param {string} message    latest user message
 * @param {Array}  history    [{ role: 'user'|'assistant', content: string }]
 * @returns {Promise<string>} assistant reply
 */
export async function askOllama(message, history = []) {
  // Trim history to last 8 turns so the prompt stays small
  const recentHistory = history.slice(-8).map(({ role, content }) => ({
    role: role === 'assistant' ? 'assistant' : 'user',
    content: String(content).slice(0, 1000),
  }));

  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...recentHistory,
        { role: 'user', content: message },
      ],
      stream: false,
      options: { temperature: 0.6 },
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Ollama responded ${response.status}: ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  return (data.message?.content || '').trim() || 'Sorry, I could not generate a reply. Please try again.';
}

/** Quick health check so the frontend can show offline status nicely. */
export async function ollamaStatus() {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { online: false };
    const data = await res.json();
    const models = (data.models || []).map((m) => m.name);
    return { online: true, model: OLLAMA_MODEL, hasModel: models.some((m) => m.startsWith(OLLAMA_MODEL)), models };
  } catch {
    return { online: false };
  }
}
