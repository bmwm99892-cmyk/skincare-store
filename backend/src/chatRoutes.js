import express from 'express';
import { askOllama, ollamaStatus } from './ollamaService.js';

const router = express.Router();

// ─── GET /api/chat/status – is Ollama reachable? ────────────────────────────
router.get('/status', async (_req, res) => {
  const status = await ollamaStatus();
  res.json(status);
});

// ─── POST /api/chat – ask the skincare assistant ────────────────────────────
router.post('/', async (req, res) => {
  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ message: 'Message is required' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ message: 'Message too long (max 2000 characters)' });
  }

  try {
    const reply = await askOllama(message.trim(), Array.isArray(history) ? history : []);
    res.json({ reply });
  } catch (err) {
    console.error('[chat] Ollama error:', err.message);
    res.status(503).json({
      message: 'AI assistant is offline. Is Ollama running? Start it with `ollama serve` and pull a model with `ollama pull llama3.2`.',
    });
  }
});

export default router;
