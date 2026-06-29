// CzarWidget — compact, functional. Posts to the existing /api/chat (corpus-grounded).
// Frames the Czar as answering ONLY what the register can prove, and carries the disclaimer.
import { useRef, useState } from 'react';
import s from './CzarWidget.module.css';

const WELCOME = {
  role: 'assistant',
  content:
    "I'm the Digital Czar. I answer from FutureTokenization's verified VARA register and knowledge corpus — and I'll say \"I don't know\" rather than guess. Ask me who is licensed, or how tokenization works. Educational only — not investment advice.",
};

const QUICK = [
  'Is Binance licensed by VARA?',
  'What is an In-Principle Approval?',
  'How many active VARA licences are there?',
];

export default function CzarWidget() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const threadRef = useRef(null);

  const scrollDown = () => {
    requestAnimationFrame(() => {
      const el = threadRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  };

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    const next = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setBusy(true);
    scrollDown();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.filter((m) => m !== WELCOME), language: 'en' }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: data.reply || "Sorry, I couldn't answer that right now." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Network error — please try again.' },
      ]);
    } finally {
      setBusy(false);
      scrollDown();
    }
  }

  return (
    <div className={s.widget}>
      <div className={s.header}>
        <span className={s.dot} aria-hidden="true" />
        <span className={s.title}>The Digital Czar</span>
        <span className={s.status}>Grounded · VARA register</span>
      </div>

      <div className={s.thread} ref={threadRef}>
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className={`${s.msg} ${s.user}`}>{m.content}</div>
          ) : (
            <div key={i} className={`${s.msg} ${s.czar}`}>
              {m !== WELCOME && <div className={s.czarLabel}>Czar</div>}
              {m.content}
            </div>
          )
        )}
        {busy && <div className={`${s.msg} ${s.czar} ${s.thinking}`}>Czar is checking the register…</div>}
      </div>

      <div className={s.chips}>
        {QUICK.map((q) => (
          <button key={q} className={s.chip} onClick={() => send(q)} disabled={busy}>
            {q}
          </button>
        ))}
      </div>

      <div className={s.inputRow}>
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about a licence or tokenization…"
          aria-label="Ask the Digital Czar"
        />
        <button className={s.send} onClick={() => send()} disabled={busy || !input.trim()}>
          Ask
        </button>
      </div>

      <p className={s.note}>
        Educational only — not investment, legal, or tax advice. The Czar answers from the verified
        register and declines what it cannot source.
      </p>
    </div>
  );
}
