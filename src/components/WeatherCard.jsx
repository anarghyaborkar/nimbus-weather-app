// src/components/WeatherCard.jsx
// Apple Weather / Notion inspired minimalist hero weather display.
// Focuses on huge, elegant typography, airy whitespace, and refined metric tiles.

function WeatherCard({ weather, loading, error, isLocationBased }) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  // Error state
  if (error && !weather) {
    return (
      <div className="weather-hero weather-hero--error glass" role="alert">
        <p className="weather-hero__error-title">Weather unavailable</p>
        <p className="weather-hero__error-sub">{error}</p>
        <style>{`
          .weather-hero--error {
            padding: var(--space-xl) var(--space-md);
            text-align: center;
            border-color: rgba(239, 68, 68, 0.15);
          }
          .weather-hero__error-title {
            color: #fca5a5;
            font-size: 0.9375rem;
            font-weight: 500;
            margin-bottom: 4px;
          }
          .weather-hero__error-sub {
            color: var(--text-tertiary);
            font-size: 0.8125rem;
          }
        `}</style>
      </div>
    );
  }

  // Loading skeleton
  if (!weather && loading) {
    return (
      <div className="weather-hero glass weather-hero--skeleton">
        <div className="skeleton-line skeleton-line--city" />
        <div className="skeleton-line skeleton-line--temp" />
        <div className="skeleton-line skeleton-line--cond" />
        <style>{`
          .weather-hero--skeleton {
            padding: var(--space-2xl) var(--space-md);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-md);
          }
          .skeleton-line {
            background: rgba(255, 255, 255, 0.04);
            border-radius: var(--radius-sm);
            animation: pulse 1.6s ease-in-out infinite;
          }
          .skeleton-line--city { width: 140px; height: 18px; }
          .skeleton-line--temp { width: 120px; height: 80px; border-radius: var(--radius-md); }
          .skeleton-line--cond { width: 100px; height: 14px; }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  const iconUrl = weather.icon
    ? `https://openweathermap.org/img/wn/${weather.icon}@2x.png`
    : null;

  return (
    <div
      className={`weather-hero glass ${loading ? 'weather-hero--loading' : ''}`}
      aria-label="Current weather conditions"
    >
      {/* Subsequent error alert */}
      {error && (
        <div className="weather-hero__banner" role="status">
          <span>{error}</span>
        </div>
      )}

      {/* Top Location & Date Anchor */}
      <div className="weather-hero__meta">
        <div className="weather-hero__city-wrap">
          <h2 className="weather-hero__city">
            {weather.city}
            {weather.country ? <span className="weather-hero__country">, {weather.country}</span> : ''}
          </h2>
          {isLocationBased && (
            <span className="location-tag">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
              My location
            </span>
          )}
        </div>
        <p className="weather-hero__date">{formattedDate}</p>
      </div>

      {/* Huge Apple-style Focal Temperature */}
      <div className="weather-hero__centerpiece">
        <div className="temp-cluster">
          <span className="hero-degree">{weather.temperature}</span>
          <span className="hero-unit">°</span>
        </div>

        <div className="condition-cluster">
          {iconUrl && (
            <img
              src={iconUrl}
              alt=""
              className="condition-icon"
              width="36"
              height="36"
              aria-hidden="true"
            />
          )}
          <span className="condition-name">
            {weather.description
              ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
              : 'Clear'}
          </span>
          <span className="condition-range">
            Feels like {weather.feelsLike ?? weather.temperature}°
          </span>
        </div>
      </div>

      {/* Subtle Metrics Grid (Notion / Linear tabular clean layout) */}
      <div className="weather-hero__metrics">
        <div className="metric-cell">
          <span className="metric-label">Humidity</span>
          <span className="metric-val">{weather.humidity}%</span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Wind</span>
          <span className="metric-val">{weather.windSpeed} <span className="metric-sub">m/s</span></span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Visibility</span>
          <span className="metric-val">{weather.visibility} <span className="metric-sub">km</span></span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Pressure</span>
          <span className="metric-val">{weather.pressure} <span className="metric-sub">hPa</span></span>
        </div>
      </div>

      <style>{`
        .weather-hero {
          position: relative;
          padding: var(--space-xl) var(--space-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-lg);
          border-radius: var(--radius-xl);
          transition: opacity var(--trans-base);
        }
        .weather-hero--loading {
          opacity: 0.65;
        }
        .weather-hero__banner {
          width: 100%;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          font-size: 0.75rem;
        }

        /* ── Location & Date ── */
        .weather-hero__meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .weather-hero__city-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .weather-hero__city {
          font-size: 1.375rem;
          font-weight: 500;
          color: var(--text-hero);
          letter-spacing: -0.02em;
        }
        .weather-hero__country {
          color: var(--text-tertiary);
          font-weight: 400;
        }
        .location-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.6875rem;
          font-weight: 500;
        }
        .weather-hero__date {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
        }

        /* ── Hero Temperature Centerpiece (Apple Weather) ── */
        .weather-hero__centerpiece {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          margin: var(--space-xs) 0;
        }
        .temp-cluster {
          display: flex;
          align-items: flex-start;
          line-height: 0.88;
        }
        .hero-degree {
          font-size: clamp(5.5rem, 14vw, 7.5rem);
          font-weight: 300;
          letter-spacing: -0.055em;
          color: var(--text-hero);
        }
        .hero-unit {
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 300;
          color: var(--text-tertiary);
          margin-top: 6px;
        }

        .condition-cluster {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }
        .condition-icon {
          width: 28px;
          height: 28px;
          object-fit: contain;
          opacity: 0.9;
        }
        .condition-name {
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .condition-range {
          font-size: 0.8125rem;
          color: var(--text-tertiary);
          margin-left: 4px;
        }

        /* ── Metrics Row (Clean Notion style key-values) ── */
        .weather-hero__metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          width: 100%;
          max-width: 580px;
          padding-top: var(--space-lg);
          border-top: 1px solid var(--border-subtle);
        }
        .metric-cell {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          padding: 0 var(--space-xs);
        }
        .metric-label {
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-quaternary);
          font-weight: 500;
        }
        .metric-val {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .metric-sub {
          font-size: 0.75rem;
          font-weight: 400;
          color: var(--text-tertiary);
        }

        @media (max-width: 600px) {
          .weather-hero {
            padding: var(--space-lg) var(--space-md);
            gap: var(--space-md);
          }
          .weather-hero__metrics {
            grid-template-columns: repeat(2, 1fr);
            row-gap: var(--space-sm);
          }
          .hero-degree {
            font-size: 4.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default WeatherCard;
