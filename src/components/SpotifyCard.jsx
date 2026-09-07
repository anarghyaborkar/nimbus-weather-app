// src/components/SpotifyCard.jsx
// Spotify music mood card — shows a recommended playlist based on the weather.
// Full Spotify API integration will be added in a later step.

function SpotifyCard() {
  return (
    <div className="spotify-card glass" aria-label="Spotify music recommendation">
      <div className="spotify-card__header">
        <span className="spotify-card__brand" aria-hidden="true">🎵</span>
        <div>
          <p className="spotify-card__label">Mood Match</p>
          <h3 className="spotify-card__title">Sunny Afternoon Vibes</h3>
        </div>
      </div>

      <p className="spotify-card__desc">
        Perfect tracks for a warm, partly cloudy day. Sit back and enjoy.
      </p>

      <button className="spotify-card__btn" aria-label="Open playlist on Spotify">
        Open on Spotify →
      </button>

      <style>{`
        .spotify-card {
          padding: var(--space-xl);
          background: linear-gradient(145deg, rgba(29, 185, 84, 0.08), rgba(0, 0, 0, 0));
          border-color: rgba(29, 185, 84, 0.2);
        }
        .spotify-card__header {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .spotify-card__brand {
          font-size: 2rem;
        }
        .spotify-card__label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #1db954;
          margin-bottom: 2px;
        }
        .spotify-card__title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--clr-text-primary);
          margin: 0;
        }
        .spotify-card__desc {
          font-size: 0.875rem;
          color: var(--clr-text-secondary);
          margin-bottom: var(--space-lg);
          line-height: 1.55;
        }
        .spotify-card__btn {
          display: inline-block;
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-full);
          background: #1db954;
          color: #000;
          font-size: 0.875rem;
          font-weight: 700;
          font-family: var(--font-sans);
          transition: opacity var(--transition-fast), transform var(--transition-fast);
        }
        .spotify-card__btn:hover {
          opacity: 0.88;
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

export default SpotifyCard;
