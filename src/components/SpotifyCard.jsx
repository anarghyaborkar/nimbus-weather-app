// src/components/SpotifyCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Weather-Based Music Companion
// Suggests curated playlists matched to current weather conditions.
// Displays title, mood badge, description, official Spotify logo, and opens
// https://open.spotify.com/search/{encoded query} in a new tab without OAuth/login.
// Allows manual random refresh within the current weather category with smooth fade.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  selectMusicRecommendation,
  buildSpotifyUrl,
} from '../utils/musicSelector';

function SpotifyCard({ weather }) {
  const [recommendation, setRecommendation] = useState(() =>
    selectMusicRecommendation(weather, null)
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Keep a ref of current recommendation ID to avoid immediate repetition
  const currentRecIdRef = useRef(recommendation?.id);
  currentRecIdRef.current = recommendation?.id;

  // Refresh function with smooth micro-fade
  const refreshRecommendation = useCallback(() => {
    setIsTransitioning(true);

    setTimeout(() => {
      const next = selectMusicRecommendation(weather, currentRecIdRef.current);
      setRecommendation(next);
      setIsTransitioning(false);
    }, 180);
  }, [weather]);

  // When weather changes (e.g. city search, GPS update), automatically update the recommendation
  useEffect(() => {
    refreshRecommendation();
  }, [weather?.city, weather?.description, refreshRecommendation]);

  if (!recommendation) return null;

  const spotifyUrl = buildSpotifyUrl(recommendation.spotifyQuery);

  return (
    <section className="spotify-card" aria-label="Weather music recommendation">
      {/* Top Meta Bar */}
      <div className="spotify-card__head">
        <div className="spotify-card__label-group">
          <span className="spotify-card__icon" aria-hidden="true">🎵</span>
          <h3 className="spotify-card__title">Weather Playlist</h3>
        </div>

        <button
          type="button"
          className="spotify-card__refresh-btn"
          onClick={refreshRecommendation}
          title="Shuffle recommendation for current weather"
          aria-label="Refresh music recommendation"
        >
          <svg
            className="spotify-card__refresh-icon"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          <span>Shuffle</span>
        </button>
      </div>

      {/* Dynamic Content with Smooth Fade Transition */}
      <div
        className={`spotify-card__body ${
          isTransitioning ? 'spotify-card__body--exiting' : 'spotify-card__body--entering'
        }`}
      >
        <div className="spotify-card__meta">
          <span className="spotify-card__mood-badge">{recommendation.mood}</span>
          <span className="spotify-card__weather-tag">{recommendation.weather}</span>
        </div>

        <h4 className="spotify-card__song-title">{recommendation.title}</h4>

        {recommendation.artist && (
          <p className="spotify-card__artist">{recommendation.artist}</p>
        )}

        <p className="spotify-card__desc">{recommendation.description}</p>
      </div>

      {/* Spotify Action CTA */}
      <a
        href={spotifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="spotify-card__cta"
        aria-label={`Open "${recommendation.title}" search on Spotify`}
      >
        {/* Official Spotify Icon */}
        <svg
          className="spotify-card__brand-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.494 17.306c-.216.353-.674.464-1.026.25-2.812-1.718-6.352-2.107-10.521-1.155-.404.093-.807-.162-.9-.567-.092-.404.163-.807.568-.9 4.568-1.044 8.487-.597 11.63 1.345.352.215.464.673.249 1.027zm1.467-3.26c-.272.443-.852.584-1.295.312-3.22-1.979-8.127-2.55-11.935-1.393-.5.152-1.034-.132-1.186-.632-.152-.5.132-1.034.632-1.186 4.356-1.322 9.774-.683 13.472 1.589.443.272.584.852.312 1.295zm.126-3.41c-3.861-2.293-10.233-2.505-13.916-1.387-.592.18-1.222-.157-1.402-.75-.18-.592.157-1.223.75-1.403 4.237-1.286 11.278-1.042 15.727 1.597.533.316.708 1.006.392 1.539-.316.533-1.006.708-1.539.392z" />
        </svg>
        <span>Open in Spotify</span>
        <span className="spotify-card__cta-arrow" aria-hidden="true">→</span>
      </a>

      <style>{`
        .spotify-card {
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
        .spotify-card:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
        }
        .spotify-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 2px;
        }
        .spotify-card__label-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .spotify-card__icon {
          font-size: 0.8125rem;
          line-height: 1;
        }
        .spotify-card__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .spotify-card__refresh-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.6875rem;
          font-weight: 500;
          transition: background var(--trans-fast), color var(--trans-fast);
        }
        .spotify-card__refresh-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          color: var(--text-hero);
        }
        .spotify-card__refresh-btn:hover .spotify-card__refresh-icon {
          transform: rotate(45deg);
        }
        .spotify-card__refresh-icon {
          transition: transform var(--trans-fast);
        }

        /* ── Transitions ── */
        .spotify-card__body {
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: opacity 180ms ease, transform 180ms ease;
        }
        .spotify-card__body--exiting {
          opacity: 0;
          transform: translateY(-3px);
        }
        .spotify-card__body--entering {
          opacity: 1;
          transform: translateY(0);
        }

        .spotify-card__meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .spotify-card__mood-badge {
          display: inline-block;
          padding: 2px 7px;
          border-radius: var(--radius-xs);
          background: rgba(29, 185, 84, 0.12);
          border: 1px solid rgba(29, 185, 84, 0.25);
          color: #22c55e;
          font-size: 0.6875rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        .spotify-card__weather-tag {
          font-size: 0.6875rem;
          color: var(--text-quaternary);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .spotify-card__song-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.35;
          letter-spacing: -0.01em;
          margin: 0;
        }
        .spotify-card__artist {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .spotify-card__desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.45;
          margin-top: 2px;
        }

        /* ── Large CTA Button ── */
        .spotify-card__cta {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: rgba(29, 185, 84, 0.12);
          border: 1px solid rgba(29, 185, 84, 0.28);
          color: #f4f4f6;
          font-size: 0.8125rem;
          font-weight: 500;
          transition: background var(--trans-fast), border-color var(--trans-fast), transform var(--trans-base);
        }
        .spotify-card__cta:hover {
          background: rgba(29, 185, 84, 0.2);
          border-color: rgba(29, 185, 84, 0.45);
          transform: translateY(-1px);
        }
        .spotify-card__brand-icon {
          color: #1db954;
          flex-shrink: 0;
        }
        .spotify-card__cta-arrow {
          color: var(--text-secondary);
          transition: transform var(--trans-fast);
        }
        .spotify-card__cta:hover .spotify-card__cta-arrow {
          transform: translateX(3px);
          color: var(--text-hero);
        }

        @media (prefers-reduced-motion: reduce) {
          .spotify-card__body,
          .spotify-card__cta,
          .spotify-card__cta-arrow,
          .spotify-card__refresh-icon {
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default SpotifyCard;
