// src/components/ShareCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Generates a beautiful, downloadable PNG weather card using html2canvas.
//
// The off-screen card is rendered in the DOM but positioned out of view,
// then captured when the user clicks "Download PNG". The card features:
//   • City name + country
//   • Hero temperature
//   • Weather description + icon
//   • Humidity, wind, and "feels like" stats
//   • Nimbus branding with a subtle atmospheric gradient
//
// Usage: <ShareCard weather={weather} onClose={() => setOpen(false)} />
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useCallback } from 'react';
import { recordEvent } from '../utils/achievementEngine';

function ShareCard({ weather, onClose, onAchievement }) {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    setError(null);

    try {
      // Dynamically import html2canvas (only when needed)
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,          // Retina quality
        useCORS: true,     // Allow OWM icon images
        logging: false,
        backgroundColor: null,
      });

      // Trigger download
      const link = document.createElement('a');
      link.download = `nimbus-${(weather?.city || 'weather').toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Achievement
      const newAch = recordEvent('sharedCard', true);
      if (newAch.length > 0) onAchievement?.(newAch);
    } catch (err) {
      console.error('[ShareCard] html2canvas error:', err);
      setError('Could not generate image. Please try again.');
    } finally {
      setGenerating(false);
    }
  }, [weather, onAchievement]);

  if (!weather) return null;

  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  const desc = weather.description
    ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
    : '';

  return (
    <>
      {/* Modal overlay */}
      <div
        className="share-overlay"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Share weather card"
      >
        <div
          className="share-modal"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="share-modal__head">
            <h3 className="share-modal__title">Share Weather Card</h3>
            <button
              type="button"
              className="share-modal__close"
              onClick={onClose}
              aria-label="Close share dialog"
            >
              ✕
            </button>
          </div>

          {/* Preview of the card that will be captured */}
          <div className="share-preview-wrap">
            {/* ── THE CARD THAT GETS CAPTURED ── */}
            <div ref={cardRef} className="share-capture-card">
              {/* Background gradient layer */}
              <div className="share-capture-card__bg" aria-hidden="true" />

              {/* City */}
              <div className="share-capture-card__location">
                <span className="share-capture-card__city">{weather.city}</span>
                {weather.country && (
                  <span className="share-capture-card__country">, {weather.country}</span>
                )}
              </div>

              {/* Hero temperature */}
              <div className="share-capture-card__temp-row">
                <span className="share-capture-card__degree">
                  {weather.temperature}
                </span>
                <span className="share-capture-card__unit">°C</span>
              </div>

              {/* Condition */}
              <div className="share-capture-card__condition">
                {iconUrl && (
                  <img
                    src={iconUrl}
                    alt=""
                    className="share-capture-card__icon"
                    crossOrigin="anonymous"
                    width="40"
                    height="40"
                  />
                )}
                <span className="share-capture-card__desc">{desc}</span>
              </div>

              {/* Stats bar */}
              <div className="share-capture-card__stats">
                <div className="share-stat">
                  <span className="share-stat__label">Feels like</span>
                  <span className="share-stat__val">{weather.feelsLike ?? weather.temperature}°</span>
                </div>
                <div className="share-stat">
                  <span className="share-stat__label">Humidity</span>
                  <span className="share-stat__val">{weather.humidity}%</span>
                </div>
                <div className="share-stat">
                  <span className="share-stat__label">Wind</span>
                  <span className="share-stat__val">{weather.windSpeed} m/s</span>
                </div>
              </div>

              {/* Branding footer */}
              <div className="share-capture-card__brand">
                <span aria-hidden="true">☁</span>
                <span>Nimbus</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {error && <p className="share-modal__error">{error}</p>}

          <div className="share-modal__actions">
            <button
              type="button"
              className="share-modal__download-btn"
              onClick={handleDownload}
              disabled={generating}
            >
              {generating ? 'Generating…' : '↓ Download PNG'}
            </button>
            <button
              type="button"
              className="share-modal__cancel-btn"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Overlay ── */
        .share-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-md);
          animation: overlayIn 0.2s ease-out;
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Modal ── */
        .share-modal {
          width: 100%;
          max-width: 380px;
          background: #0f1117;
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: modalIn 0.25s var(--ease-spring);
          box-shadow: var(--shadow-float);
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .share-modal__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .share-modal__title {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-hero);
          margin: 0;
        }
        .share-modal__close {
          color: var(--text-quaternary);
          font-size: 0.875rem;
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          transition: color var(--trans-fast), background var(--trans-fast);
        }
        .share-modal__close:hover {
          color: var(--text-primary);
          background: rgba(255,255,255,0.06);
        }

        /* ── Preview wrap ── */
        .share-preview-wrap {
          display: flex;
          justify-content: center;
        }

        /* ── THE CAPTURED CARD ── */
        .share-capture-card {
          width: 320px;
          min-height: 200px;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #0d1b2e 0%, #111827 60%, #0a0e1a 100%);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .share-capture-card__bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 75% 20%, rgba(56,189,248,0.12) 0%, transparent 60%),
                      radial-gradient(circle at 20% 80%, rgba(167,139,250,0.08) 0%, transparent 55%);
          pointer-events: none;
        }
        .share-capture-card__location {
          position: relative;
        }
        .share-capture-card__city {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: -0.025em;
        }
        .share-capture-card__country {
          font-size: 1rem;
          color: rgba(255,255,255,0.45);
          font-weight: 400;
        }
        .share-capture-card__temp-row {
          display: flex;
          align-items: flex-start;
          line-height: 0.9;
          margin: 4px 0;
          position: relative;
        }
        .share-capture-card__degree {
          font-size: 5rem;
          font-weight: 300;
          color: #ffffff;
          letter-spacing: -0.05em;
        }
        .share-capture-card__unit {
          font-size: 1.75rem;
          font-weight: 300;
          color: rgba(255,255,255,0.5);
          margin-top: 8px;
        }
        .share-capture-card__condition {
          display: flex;
          align-items: center;
          gap: 6px;
          position: relative;
        }
        .share-capture-card__icon {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }
        .share-capture-card__desc {
          font-size: 1rem;
          color: rgba(255,255,255,0.7);
          font-weight: 400;
        }
        .share-capture-card__stats {
          display: flex;
          gap: 20px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.07);
          position: relative;
        }
        .share-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .share-stat__label {
          font-size: 0.5625rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
          font-family: -apple-system, 'Inter', sans-serif;
        }
        .share-stat__val {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          font-family: -apple-system, 'Inter', sans-serif;
        }
        .share-capture-card__brand {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.6875rem;
          color: rgba(255,255,255,0.25);
          font-weight: 500;
          letter-spacing: 0.04em;
          position: relative;
          margin-top: auto;
        }

        /* ── Modal actions ── */
        .share-modal__error {
          font-size: 0.75rem;
          color: #fca5a5;
          text-align: center;
        }
        .share-modal__actions {
          display: flex;
          gap: 8px;
        }
        .share-modal__download-btn {
          flex: 1;
          padding: 9px 16px;
          border-radius: var(--radius-sm);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: var(--text-hero);
          font-size: 0.875rem;
          font-weight: 500;
          transition: background var(--trans-fast), border-color var(--trans-fast), transform var(--trans-base);
        }
        .share-modal__download-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.14);
          border-color: rgba(255,255,255,0.22);
          transform: translateY(-1px);
        }
        .share-modal__download-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }
        .share-modal__cancel-btn {
          padding: 9px 16px;
          border-radius: var(--radius-sm);
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-tertiary);
          font-size: 0.875rem;
          font-weight: 500;
          transition: background var(--trans-fast), color var(--trans-fast);
        }
        .share-modal__cancel-btn:hover {
          background: rgba(255,255,255,0.04);
          color: var(--text-secondary);
        }

        @media (prefers-reduced-motion: reduce) {
          .share-overlay,
          .share-modal {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default ShareCard;
