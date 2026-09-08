// src/components/NimbusChat.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Nimbus AI — floating conversational weather assistant.
//
// Features:
//   • Bottom-right floating trigger button (💬 Ask Nimbus)
//   • Slide-up glassmorphism chat panel
//   • Welcome message + suggestion chips
//   • Message bubbles with timestamps
//   • Typing indicator (3-dot bounce)
//   • Auto-scroll to latest message
//   • Enter-to-send + Send button
//   • Passes live weather prop to every backend request
//   • Graceful error handling
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback } from 'react';

const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Suggested question chips shown on first open
const SUGGESTION_CHIPS = [
  { emoji: '☂️', label: 'Should I carry an umbrella?' },
  { emoji: '🌡️', label: 'Why does it feel hotter?' },
  { emoji: '🌧️', label: 'Will it rain today?' },
  { emoji: '🌬️', label: 'Explain today\'s forecast.' },
  { emoji: '☁️', label: 'Why is it cloudy?' },
  { emoji: '❄️', label: 'What causes snow?' },
];

// Context-aware greeting based on weather
function getGreeting(weather) {
  if (!weather) return "Hi! I'm Nimbus 🌤\nAsk me anything about today's weather.";

  const desc  = (weather.description || '').toLowerCase();
  const temp  = weather.temperature;
  const city  = weather.city || 'your area';

  if (/rain|drizzle|shower/.test(desc)) {
    return `Hey there! 🌧️ It's raining in ${city} — ask me if you need an umbrella or anything else about today's weather.`;
  }
  if (/thunder|storm/.test(desc)) {
    return `Heads up! ⛈️ There's a storm in ${city} right now. Stay safe and ask me anything about the conditions.`;
  }
  if (/snow|blizzard/.test(desc)) {
    return `It's snowing in ${city}! ❄️ Bundle up — I'm here to answer all your winter weather questions.`;
  }
  if (/clear|sunny/.test(desc) && temp > 25) {
    return `Looks like perfect weather for a walk in ${city}! ☀️ Ask me anything about today's conditions.`;
  }
  if (/cloud|overcast/.test(desc)) {
    return `Today's clouds in ${city} are keeping temperatures comfortable. ☁️ Ask me anything about the weather!`;
  }
  if (temp !== undefined && temp > 30) {
    return `Don't forget to stay hydrated — it's ${temp}°C in ${city}! 💧 Ask me about the heat or anything weather-related.`;
  }
  if (temp !== undefined && temp < 5) {
    return `Brr, it's chilly in ${city} at ${temp}°C! 🧣 Ask me anything about today's cold weather.`;
  }

  return `Hi! I'm Nimbus 🌤\nAsk me anything about today's weather in ${city}.`;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function NimbusChat({ weather }) {
  const [isOpen,    setIsOpen]    = useState(false);
  const [messages,  setMessages]  = useState([]);
  const [input,     setInput]     = useState('');
  const [isTyping,  setIsTyping]  = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const panelRef       = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!hasOpened) {
      setHasOpened(true);
      // Add welcome message on first open
      setMessages([
        {
          id:        Date.now(),
          role:      'assistant',
          text:      getGreeting(weather),
          timestamp: new Date(),
        },
      ]);
    }
  }, [hasOpened, weather]);

  const closeChat = useCallback(() => setIsOpen(false), []);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id:        Date.now(),
      role:      'user',
      text:      trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(`${BACKEND_BASE_URL}/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: trimmed, weather: weather || null }),
      });

      const data = await res.json().catch(() => null);

      const reply = data?.reply || (
        !res.ok
          ? `Sorry, something went wrong (${res.status}). Please try again.`
          : 'Hmm, I didn\'t get a response. Please try again.'
      );

      setMessages((prev) => [
        ...prev,
        {
          id:        Date.now() + 1,
          role:      'assistant',
          text:      reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id:        Date.now() + 1,
          role:      'assistant',
          text:      'Unable to connect to Nimbus AI right now. Please make sure the backend server is running.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [isTyping, weather]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  const handleChip = useCallback((label) => {
    sendMessage(label);
  }, [sendMessage]);

  const showChips = messages.length <= 1 && !isTyping;

  return (
    <>
      {/* ── Floating trigger button ─────────────────────────────────────── */}
      <button
        id="nimbus-chat-trigger"
        className="nimbus-fab"
        onClick={isOpen ? closeChat : openChat}
        aria-label={isOpen ? 'Close Nimbus AI chat' : 'Open Nimbus AI chat'}
        aria-expanded={isOpen}
        aria-controls="nimbus-chat-panel"
      >
        <span className="nimbus-fab__icon" aria-hidden="true">
          {isOpen ? '✕' : '💬'}
        </span>
        {!isOpen && <span className="nimbus-fab__label">Ask Nimbus</span>}
        {!isOpen && <span className="nimbus-fab__pulse" aria-hidden="true" />}
      </button>

      {/* ── Chat panel ─────────────────────────────────────────────────── */}
      <div
        id="nimbus-chat-panel"
        ref={panelRef}
        className={`nimbus-panel ${isOpen ? 'nimbus-panel--open' : ''}`}
        role="dialog"
        aria-label="Nimbus AI weather assistant"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="nimbus-panel__header">
          <div className="nimbus-panel__avatar" aria-hidden="true">🌤️</div>
          <div className="nimbus-panel__title-group">
            <span className="nimbus-panel__title">Nimbus AI</span>
            <span className="nimbus-panel__subtitle">
              {weather?.city ? `${weather.city} · ${weather.temperature}°C` : 'Weather Assistant'}
            </span>
          </div>
          <button
            className="nimbus-panel__close"
            onClick={closeChat}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="nimbus-messages" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`nimbus-bubble nimbus-bubble--${msg.role}`}
            >
              {msg.role === 'assistant' && (
                <div className="nimbus-bubble__avatar" aria-hidden="true">🌤️</div>
              )}
              <div className="nimbus-bubble__content">
                <p className="nimbus-bubble__text">{msg.text}</p>
                <time
                  className="nimbus-bubble__time"
                  dateTime={msg.timestamp.toISOString()}
                >
                  {formatTime(msg.timestamp)}
                </time>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="nimbus-bubble nimbus-bubble--assistant" aria-label="Nimbus is typing">
              <div className="nimbus-bubble__avatar" aria-hidden="true">🌤️</div>
              <div className="nimbus-bubble__content">
                <div className="nimbus-typing" aria-hidden="true">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          {/* Suggestion chips */}
          {showChips && messages.length > 0 && (
            <div className="nimbus-chips" role="group" aria-label="Suggested questions">
              {SUGGESTION_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  className="nimbus-chip"
                  onClick={() => handleChip(chip.label)}
                  type="button"
                >
                  <span aria-hidden="true">{chip.emoji}</span>
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* Input bar */}
        <div className="nimbus-input-bar">
          <input
            ref={inputRef}
            id="nimbus-chat-input"
            className="nimbus-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the weather…"
            maxLength={500}
            disabled={isTyping}
            aria-label="Type your weather question"
            autoComplete="off"
          />
          <button
            id="nimbus-send-btn"
            className={`nimbus-send ${input.trim() && !isTyping ? 'nimbus-send--active' : ''}`}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            type="button"
          >
            ↑
          </button>
        </div>
      </div>

      <style>{`
        /* ─── Floating action button ─────────────────────────────────────── */
        .nimbus-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9000;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 20px 13px 16px;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(99, 102, 241, 0.22) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 999px;
          color: #f4f4f6;
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(56, 189, 248, 0.15);
          transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1),
                      background 180ms ease;
          overflow: visible;
        }
        .nimbus-fab:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 4px 12px rgba(56, 189, 248, 0.25);
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.26) 0%, rgba(99, 102, 241, 0.30) 100%);
        }
        .nimbus-fab:active {
          transform: translateY(0) scale(0.98);
        }
        .nimbus-fab__icon {
          font-size: 1.1rem;
          line-height: 1;
        }
        .nimbus-fab__label {
          white-space: nowrap;
        }

        /* Pulse ring */
        .nimbus-fab__pulse {
          position: absolute;
          inset: -4px;
          border-radius: 999px;
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          animation: nimbuspulse 2.4s ease-out infinite;
          pointer-events: none;
        }
        @keyframes nimbuspulse {
          0%   { opacity: 0.8; transform: scale(1); }
          60%  { opacity: 0; transform: scale(1.18); }
          100% { opacity: 0; transform: scale(1.18); }
        }

        /* ─── Chat panel ──────────────────────────────────────────────────── */
        .nimbus-panel {
          position: fixed;
          bottom: 96px;
          right: 28px;
          z-index: 8999;
          width: 370px;
          max-width: calc(100vw - 32px);
          max-height: 580px;
          display: flex;
          flex-direction: column;
          background: rgba(10, 12, 16, 0.82);
          backdrop-filter: blur(32px) saturate(1.4);
          -webkit-backdrop-filter: blur(32px) saturate(1.4);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 24px;
          box-shadow:
            0 32px 80px rgba(0, 0, 0, 0.6),
            0 8px 24px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transform: translateY(16px) scale(0.97);
          opacity: 0;
          pointer-events: none;
          transition:
            opacity 260ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        .nimbus-panel--open {
          transform: translateY(0) scale(1);
          opacity: 1;
          pointer-events: all;
        }

        /* ─── Header ──────────────────────────────────────────────────────── */
        .nimbus-panel__header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 16px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.07) 0%, rgba(99, 102, 241, 0.07) 100%);
          flex-shrink: 0;
        }
        .nimbus-panel__avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2));
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.05rem;
          flex-shrink: 0;
        }
        .nimbus-panel__title-group {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .nimbus-panel__title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #f4f4f6;
          letter-spacing: -0.02em;
        }
        .nimbus-panel__subtitle {
          font-size: 0.72rem;
          color: rgba(161, 161, 170, 0.8);
          letter-spacing: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nimbus-panel__close {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.07);
          color: #71717a;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 150ms ease, color 150ms ease;
          flex-shrink: 0;
        }
        .nimbus-panel__close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #f4f4f6;
        }

        /* ─── Messages scroll area ────────────────────────────────────────── */
        .nimbus-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scroll-behavior: smooth;
        }
        .nimbus-messages::-webkit-scrollbar { width: 4px; }
        .nimbus-messages::-webkit-scrollbar-track { background: transparent; }
        .nimbus-messages::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.07);
          border-radius: 999px;
        }

        /* ─── Message bubbles ─────────────────────────────────────────────── */
        .nimbus-bubble {
          display: flex;
          align-items: flex-end;
          gap: 7px;
          animation: bubbleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nimbus-bubble--user {
          flex-direction: row-reverse;
        }
        .nimbus-bubble__avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(99, 102, 241, 0.15));
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.78rem;
          flex-shrink: 0;
          margin-bottom: 2px;
        }
        .nimbus-bubble__content {
          max-width: 82%;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .nimbus-bubble--user .nimbus-bubble__content {
          align-items: flex-end;
        }
        .nimbus-bubble__text {
          padding: 10px 13px;
          border-radius: 16px;
          font-size: 0.835rem;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .nimbus-bubble--assistant .nimbus-bubble__text {
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #e4e4e7;
          border-bottom-left-radius: 5px;
        }
        .nimbus-bubble--user .nimbus-bubble__text {
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(99, 102, 241, 0.22) 100%);
          border: 1px solid rgba(56, 189, 248, 0.2);
          color: #f4f4f6;
          border-bottom-right-radius: 5px;
        }
        .nimbus-bubble__time {
          font-size: 0.65rem;
          color: #52525b;
          padding: 0 4px;
          letter-spacing: 0.01em;
        }

        /* ─── Typing indicator ────────────────────────────────────────────── */
        .nimbus-typing {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          border-bottom-left-radius: 5px;
          width: 52px;
        }
        .nimbus-typing span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(161, 161, 170, 0.6);
          animation: typingdot 1.2s ease-in-out infinite;
        }
        .nimbus-typing span:nth-child(1) { animation-delay: 0s; }
        .nimbus-typing span:nth-child(2) { animation-delay: 0.18s; }
        .nimbus-typing span:nth-child(3) { animation-delay: 0.36s; }
        @keyframes typingdot {
          0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
          30%            { opacity: 1;   transform: translateY(-3px); }
        }

        /* ─── Suggestion chips ────────────────────────────────────────────── */
        .nimbus-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 4px 2px;
          animation: bubbleIn 0.3s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .nimbus-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 999px;
          color: #a1a1aa;
          font-size: 0.775rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            color 160ms ease,
            transform 160ms ease;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }
        .nimbus-chip:hover {
          background: rgba(56, 189, 248, 0.1);
          border-color: rgba(56, 189, 248, 0.25);
          color: #e4e4e7;
          transform: translateY(-1px);
        }
        .nimbus-chip:active {
          transform: translateY(0);
        }

        /* ─── Input bar ───────────────────────────────────────────────────── */
        .nimbus-input-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(0, 0, 0, 0.15);
          flex-shrink: 0;
        }
        .nimbus-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 9px 15px;
          color: #f4f4f6;
          font-size: 0.835rem;
          font-family: var(--font-sans);
          letter-spacing: -0.01em;
          outline: none;
          transition: border-color 160ms ease, background 160ms ease;
        }
        .nimbus-input::placeholder {
          color: #52525b;
        }
        .nimbus-input:focus {
          border-color: rgba(56, 189, 248, 0.3);
          background: rgba(255, 255, 255, 0.07);
        }
        .nimbus-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .nimbus-send {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #52525b;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: not-allowed;
          transition:
            background 180ms ease,
            border-color 180ms ease,
            color 180ms ease,
            transform 180ms ease;
          flex-shrink: 0;
        }
        .nimbus-send--active {
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(99, 102, 241, 0.3));
          border-color: rgba(56, 189, 248, 0.35);
          color: #e4e4e7;
          cursor: pointer;
        }
        .nimbus-send--active:hover {
          background: linear-gradient(135deg, rgba(56, 189, 248, 0.45), rgba(99, 102, 241, 0.45));
          transform: scale(1.08);
        }
        .nimbus-send--active:active {
          transform: scale(0.96);
        }

        /* ─── Responsive ──────────────────────────────────────────────────── */
        @media (max-width: 480px) {
          .nimbus-fab {
            bottom: 18px;
            right: 16px;
            padding: 11px 16px 11px 13px;
          }
          .nimbus-panel {
            bottom: 80px;
            right: 8px;
            left: 8px;
            width: auto;
            max-width: none;
            border-radius: 20px;
          }
        }

        /* ─── Reduced motion ──────────────────────────────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .nimbus-fab,
          .nimbus-panel,
          .nimbus-bubble,
          .nimbus-chip,
          .nimbus-send {
            transition: none !important;
            animation: none !important;
          }
          .nimbus-fab__pulse { display: none; }
          .nimbus-panel--open {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </>
  );
}
