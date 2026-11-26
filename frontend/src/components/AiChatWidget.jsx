import { useEffect, useRef, useState } from 'react';
import { API_BASE } from '../lib/api.js';

const SUGGESTIONS = [
  'Meri skin oily hai, routine batao?',
  'Best sunscreen kaunsi hai?',
  'Acne ke liye kya use karun?',
  'Retinol kya hai?',
];

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />
    </svg>
  );
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Assalam-o-Alaikum! I'm the Nudu AI skincare assistant 🌸 Ask me anything about skincare routines, ingredients, or products — in English or Roman Urdu!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(null); // null = unknown
  const scrollRef = useRef(null);

  // Check if Ollama backend is reachable when first opened
  useEffect(() => {
    if (!open || online !== null) return;
    fetch(`${API_BASE}/chat/status`)
      .then((r) => r.json())
      .then((d) => setOnline(Boolean(d.online)))
      .catch(() => setOnline(false));
  }, [open, online]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, open]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    const history = messages.slice(1); // drop greeting from context
    setMessages((m) => [...m, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Assistant is offline');
      setOnline(true);
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setOnline(false);
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            `⚠️ ${err.message}\n\nMake sure Ollama is running:\n1. ollama serve\n2. ollama pull llama3.2`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={`ai-chat-fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI assistant' : 'Open AI skincare assistant'}
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <>
            <SparkleIcon />
            <span className="ai-chat-fab-label">AI Assistant</span>
          </>
        )}
      </button>

      {open && (
        <aside className="ai-chat-panel" aria-label="AI skincare assistant chat">
          <header className="ai-chat-header">
            <div>
              <strong>Nudu AI Assistant</strong>
              <small>
                {online === false ? 'Ollama offline' : online === true ? 'Powered by Ollama · local & private' : 'Connecting…'}
              </small>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="ai-chat-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`ai-chat-bubble is-${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="ai-chat-bubble is-assistant ai-chat-typing" aria-live="polite">
                <span /><span /><span />
              </div>
            )}
            {messages.length <= 1 && (
              <div className="ai-chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => send(s)} disabled={loading}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className="ai-chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Skincare se related kuch bhi poochein…"
              maxLength={2000}
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              Send
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
