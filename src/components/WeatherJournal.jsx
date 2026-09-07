// src/components/WeatherJournal.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Personal Weather Journal
//
// Lets users log their mood, a short note, and the current weather snapshot.
// All entries are persisted in localStorage — no backend required.
//
// Features:
//   • Emoji mood selector
//   • Free-text note (max 280 chars)
//   • Auto-attaches current weather (city, temp, condition)
//   • Entries displayed newest-first, with delete option
//   • Empty state with gentle prompt
//   • Accessible form with proper labels
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { JOURNAL_MOODS } from '../data/journalMoods';

const STORAGE_KEY = 'nimbus:journal';
const MAX_NOTE_LEN = 280;

// ── localStorage helpers ──────────────────────────────────────────────────────

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {}
}

// ── Date formatting ───────────────────────────────────────────────────────────

function formatEntryDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

function WeatherJournal({ weather, onSave }) {
  const [entries, setEntries] = useState(loadEntries);
  const [selectedMood, setSelectedMood] = useState(JOURNAL_MOODS[1].id); // default: Good
  const [note, setNote]             = useState('');
  const [showForm, setShowForm]     = useState(false);
  const [saved, setSaved]           = useState(false);

  // Keep localStorage in sync whenever entries change
  useEffect(() => {
    saveEntries(entries);
  }, [entries]);

  const handleSave = () => {
    if (!note.trim() && !selectedMood) return;

    const mood = JOURNAL_MOODS.find((m) => m.id === selectedMood);
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      mood: mood || JOURNAL_MOODS[1],
      note: note.trim(),
      weather: weather
        ? {
            city:        weather.city || 'Unknown',
            temperature: weather.temperature ?? null,
            description: weather.description || '',
            icon:        weather.icon || '',
          }
        : null,
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    setNote('');
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);

    // Notify parent for achievement tracking
    onSave?.(updated.length);
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <section className="journal" aria-label="Weather Journal">
      {/* Header */}
      <div className="journal__head">
        <div className="journal__title-group">
          <span className="journal__icon" aria-hidden="true">📓</span>
          <h3 className="journal__title">Weather Journal</h3>
          {entries.length > 0 && (
            <span className="journal__count">{entries.length}</span>
          )}
        </div>
        <button
          type="button"
          className={`journal__add-btn ${showForm ? 'journal__add-btn--cancel' : ''}`}
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
        >
          {showForm ? '✕ Cancel' : '+ New Entry'}
        </button>
      </div>

      {/* Save success flash */}
      {saved && (
        <div className="journal__saved-flash" role="status" aria-live="polite">
          ✓ Entry saved
        </div>
      )}

      {/* New Entry Form */}
      {showForm && (
        <div className="journal__form" role="form" aria-label="New journal entry">
          {/* Mood picker */}
          <fieldset className="journal__mood-fieldset">
            <legend className="journal__field-label">How are you feeling?</legend>
            <div className="journal__mood-grid" role="group">
              {JOURNAL_MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  className={`mood-btn ${selectedMood === mood.id ? 'mood-btn--selected' : ''}`}
                  onClick={() => setSelectedMood(mood.id)}
                  aria-pressed={selectedMood === mood.id}
                  title={mood.label}
                  aria-label={mood.label}
                >
                  <span className="mood-btn__emoji">{mood.emoji}</span>
                  <span className="mood-btn__label">{mood.label}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Note textarea */}
          <div className="journal__note-wrap">
            <label className="journal__field-label" htmlFor="journal-note">
              Note
            </label>
            <textarea
              id="journal-note"
              className="journal__textarea"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, MAX_NOTE_LEN))}
              placeholder="How is the weather affecting your day?"
              rows={3}
              maxLength={MAX_NOTE_LEN}
            />
            <span className="journal__char-count">
              {note.length}/{MAX_NOTE_LEN}
            </span>
          </div>

          {/* Current weather snapshot preview */}
          {weather && (
            <div className="journal__weather-snap">
              <span aria-hidden="true">
                {weather.icon
                  ? <img
                      src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                      alt=""
                      width="20"
                      height="20"
                      className="journal__snap-icon"
                    />
                  : '🌤'}
              </span>
              <span className="journal__snap-text">
                {weather.city} · {weather.temperature}°C · {weather.description}
              </span>
            </div>
          )}

          <button
            type="button"
            className="journal__save-btn"
            onClick={handleSave}
            disabled={!note.trim() && !selectedMood}
          >
            Save Entry
          </button>
        </div>
      )}

      {/* Entry List */}
      {entries.length === 0 && !showForm && (
        <div className="journal__empty">
          <p className="journal__empty-text">
            No entries yet. Start logging your weather moments.
          </p>
        </div>
      )}

      {entries.length > 0 && (
        <ul className="journal__list" role="list" aria-label="Journal entries">
          {entries.map((entry) => (
            <li key={entry.id} className="journal__entry">
              <div className="journal__entry-top">
                <div className="journal__entry-meta">
                  <span className="journal__entry-mood" aria-label={`Mood: ${entry.mood.label}`}>
                    {entry.mood.emoji}
                  </span>
                  <span className="journal__entry-date">
                    {formatEntryDate(entry.timestamp)}
                  </span>
                </div>
                <button
                  type="button"
                  className="journal__delete-btn"
                  onClick={() => handleDelete(entry.id)}
                  aria-label="Delete this entry"
                >
                  ✕
                </button>
              </div>

              {entry.note && (
                <p className="journal__entry-note">{entry.note}</p>
              )}

              {entry.weather && (
                <div className="journal__entry-weather">
                  {entry.weather.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${entry.weather.icon}.png`}
                      alt=""
                      width="16"
                      height="16"
                      className="journal__entry-weather-icon"
                      aria-hidden="true"
                    />
                  )}
                  <span className="journal__entry-weather-text">
                    {entry.weather.city}
                    {entry.weather.temperature !== null && ` · ${entry.weather.temperature}°C`}
                    {entry.weather.description && ` · ${entry.weather.description}`}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        /* ── Wrapper ── */
        .journal {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        /* ── Head ── */
        .journal__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2px;
        }
        .journal__title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .journal__icon {
          font-size: 0.875rem;
          line-height: 1;
        }
        .journal__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .journal__count {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--text-quaternary);
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 1px 6px;
          letter-spacing: 0.04em;
        }
        .journal__add-btn {
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.6875rem;
          font-weight: 500;
          transition: background var(--trans-fast), color var(--trans-fast);
        }
        .journal__add-btn:hover {
          background: rgba(255,255,255,0.09);
          color: var(--text-primary);
        }
        .journal__add-btn--cancel {
          color: var(--text-tertiary);
        }

        /* ── Saved flash ── */
        .journal__saved-flash {
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.18);
          color: #4ade80;
          font-size: 0.75rem;
          font-weight: 500;
          text-align: center;
          animation: flashIn 0.25s ease-out;
        }
        @keyframes flashIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Form ── */
        .journal__form {
          padding: 16px 18px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: formSlideIn 0.22s ease-out;
        }
        @keyframes formSlideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .journal__mood-fieldset {
          border: none;
          padding: 0;
          margin: 0;
        }
        .journal__field-label {
          display: block;
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-quaternary);
          font-weight: 500;
          margin-bottom: 8px;
        }
        .journal__mood-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .mood-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          transition: background var(--trans-fast), border-color var(--trans-fast), transform var(--trans-base);
        }
        .mood-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: var(--border-medium);
          transform: translateY(-1px);
        }
        .mood-btn--selected {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.2);
          color: var(--text-primary);
        }
        .mood-btn__emoji {
          font-size: 1.125rem;
          line-height: 1;
        }
        .mood-btn__label {
          font-size: 0.5625rem;
          letter-spacing: 0.03em;
          color: var(--text-tertiary);
        }

        /* ── Textarea ── */
        .journal__note-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          position: relative;
        }
        .journal__textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--border-subtle);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.8125rem;
          line-height: 1.6;
          resize: vertical;
          transition: border-color var(--trans-fast), background var(--trans-fast);
        }
        .journal__textarea:focus {
          outline: none;
          border-color: var(--border-focus);
          background: rgba(255,255,255,0.05);
        }
        .journal__textarea::placeholder {
          color: var(--text-quaternary);
        }
        .journal__char-count {
          font-size: 0.625rem;
          color: var(--text-quaternary);
          text-align: right;
        }

        /* ── Weather snap ── */
        .journal__weather-snap {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: var(--radius-xs);
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border-subtle);
        }
        .journal__snap-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
          opacity: 0.8;
        }
        .journal__snap-text {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }

        /* ── Save Button ── */
        .journal__save-btn {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: var(--text-primary);
          font-size: 0.8125rem;
          font-weight: 500;
          transition: background var(--trans-fast), border-color var(--trans-fast), transform var(--trans-base);
        }
        .journal__save-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-1px);
        }
        .journal__save-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* ── Empty state ── */
        .journal__empty {
          padding: 20px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          text-align: center;
        }
        .journal__empty-text {
          font-size: 0.8125rem;
          color: var(--text-quaternary);
          line-height: 1.5;
        }

        /* ── Entry List ── */
        .journal__list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .journal__entry {
          padding: 12px 16px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: background var(--trans-fast), border-color var(--trans-fast);
          animation: entryIn 0.25s ease-out;
        }
        @keyframes entryIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .journal__entry:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
        }
        .journal__entry-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .journal__entry-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .journal__entry-mood {
          font-size: 1rem;
          line-height: 1;
        }
        .journal__entry-date {
          font-size: 0.6875rem;
          color: var(--text-quaternary);
        }
        .journal__delete-btn {
          font-size: 0.625rem;
          color: var(--text-quaternary);
          padding: 2px 5px;
          border-radius: var(--radius-xs);
          transition: color var(--trans-fast), background var(--trans-fast);
          line-height: 1;
        }
        .journal__delete-btn:hover {
          color: #fca5a5;
          background: rgba(239,68,68,0.08);
        }
        .journal__entry-note {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.55;
        }
        .journal__entry-weather {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .journal__entry-weather-icon {
          width: 16px;
          height: 16px;
          object-fit: contain;
          opacity: 0.6;
        }
        .journal__entry-weather-text {
          font-size: 0.6875rem;
          color: var(--text-quaternary);
        }

        @media (prefers-reduced-motion: reduce) {
          .journal__form,
          .journal__entry,
          .journal__saved-flash {
            animation: none !important;
          }
          .mood-btn,
          .journal__save-btn {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default WeatherJournal;
