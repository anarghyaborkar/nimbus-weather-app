// src/components/WeatherFacts.jsx
// ─────────────────────────────────────────────────────────────────────────────
// "🌍 Did You Know?" Experience
// Displays educational, curated weather & climate insights prioritized by current weather.
// Automatically rotates every 35 seconds with elegant fade/slide transitions,
// and supports manual browsing via a "Next Fact →" button.
// Never repeats the same fact consecutively.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import { selectNextFact } from '../utils/factSelector';

const ROTATION_INTERVAL_MS = 35000; // Auto-rotate every 35 seconds

function WeatherFacts({ weather }) {
  // Initialize with a fact matching current weather
  const [currentFact, setCurrentFact] = useState(() => selectNextFact(weather, null));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Keep a ref of currentFact.id to always avoid immediate consecutive duplicate
  const currentFactIdRef = useRef(currentFact?.id);
  currentFactIdRef.current = currentFact?.id;

  // Function to advance to the next fact with a smooth micro-fade
  const advanceFact = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      const next = selectNextFact(weather, currentFactIdRef.current);
      setCurrentFact(next);
      setIsTransitioning(false);
    }, 180); // Duration matches CSS fade transition
  }, [weather]);

  // When weather changes (e.g. user searches a new city or uses GPS), re-anchor to a contextually relevant fact
  useEffect(() => {
    advanceFact();
  }, [weather?.city, weather?.description, advanceFact]);

  // Auto-rotation timer
  useEffect(() => {
    const timer = setInterval(() => {
      advanceFact();
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [advanceFact]);

  if (!currentFact) return null;

  return (
    <section className="facts-card" aria-label="Did you know weather fact">
      <div className="facts-card__head">
        <h3 className="facts-card__title">🌍 Did You Know?</h3>
        <button
          type="button"
          className="facts-card__next-btn"
          onClick={advanceFact}
          aria-label="Show next fact"
        >
          <span>Next Fact</span>
          <span className="facts-card__arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <div className={`facts-card__body ${isTransitioning ? 'facts-card__body--exiting' : 'facts-card__body--entering'}`}>
        <div className="facts-card__meta">
          <span className="facts-card__tag">{currentFact.category}</span>
        </div>

        {currentFact.headline && (
          <h4 className="facts-card__headline">{currentFact.headline}</h4>
        )}

        <p className="facts-card__text">{currentFact.fact}</p>
      </div>

      <style>{`
        .facts-card {
          width: 100%;
          padding: 18px 20px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
          transition: background var(--trans-fast), border-color var(--trans-fast);
        }
        .facts-card:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
        }
        .facts-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2px;
        }
        .facts-card__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .facts-card__next-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.6875rem;
          font-weight: 500;
          transition: background var(--trans-fast), color var(--trans-fast), transform var(--trans-fast);
        }
        .facts-card__next-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          color: var(--text-hero);
        }
        .facts-card__next-btn:hover .facts-card__arrow {
          transform: translateX(2px);
        }
        .facts-card__arrow {
          transition: transform var(--trans-fast);
        }

        /* ── Transition states for smooth fade & subtle slide ── */
        .facts-card__body {
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: opacity 180ms ease, transform 180ms ease;
        }
        .facts-card__body--exiting {
          opacity: 0;
          transform: translateY(-3px);
        }
        .facts-card__body--entering {
          opacity: 1;
          transform: translateY(0);
        }

        .facts-card__meta {
          display: flex;
          align-items: center;
          margin-top: 2px;
        }
        .facts-card__tag {
          font-size: 0.6875rem;
          font-weight: 500;
          color: var(--text-quaternary);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .facts-card__headline {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.4;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .facts-card__text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .facts-card__body {
            transition: none !important;
          }
          .facts-card__arrow {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default WeatherFacts;
