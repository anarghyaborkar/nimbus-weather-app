// src/components/WeatherCard.jsx
// Primary weather display card — shows current conditions for the selected city.
// Data will be supplied via props once the weather API is connected.

function WeatherCard() {
  return (
    <div className="weather-card glass" aria-label="Current weather conditions">
      {/* Location & Date */}
      <div className="weather-card__header">
        <div>
          <h2 className="weather-card__city">New Delhi</h2>
          <p className="weather-card__date">Monday, 7 September 2026</p>
        </div>
        <span className="weather-card__badge">Live</span>
      </div>

      {/* Temperature */}
      <div className="weather-card__main">
        <span className="weather-card__emoji" aria-hidden="true">⛅</span>
        <div>
          <p className="weather-card__temp">34°</p>
          <p className="weather-card__condition">Partly Cloudy</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="weather-card__stats">
        {[
          { icon: '💧', label: 'Humidity', value: '62%' },
          { icon: '💨', label: 'Wind',     value: '18 km/h' },
          { icon: '👁',  label: 'Visibility', value: '8 km' },
          { icon: '🌡', label: 'Feels like', value: '37°' },
        ].map((stat) => (
          <div className="weather-card__stat" key={stat.label}>
            <span className="weather-card__stat-icon" aria-hidden="true">{stat.icon}</span>
            <p className="weather-card__stat-value">{stat.value}</p>
            <p className="weather-card__stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <style>{`
        .weather-card {
          padding: var(--space-xl);
          background: var(--clr-gradient-card), var(--clr-glass-bg);
          box-shadow: var(--shadow-lg), var(--shadow-glow-blue);
        }
        .weather-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: var(--space-xl);
        }
        .weather-card__city {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--clr-text-primary);
          margin: 0;
        }
        .weather-card__date {
          font-size: 0.875rem;
          color: var(--clr-text-muted);
          margin-top: 2px;
        }
        .weather-card__badge {
          padding: 2px 10px;
          border-radius: var(--radius-full);
          background: rgba(79, 142, 247, 0.15);
          border: 1px solid rgba(79, 142, 247, 0.35);
          color: var(--clr-accent-blue);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }
        .weather-card__main {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }
        .weather-card__emoji {
          font-size: 5rem;
          line-height: 1;
          filter: drop-shadow(0 4px 12px rgba(79,142,247,0.4));
        }
        .weather-card__temp {
          font-size: 4.5rem;
          font-weight: 300;
          letter-spacing: -0.04em;
          color: var(--clr-text-primary);
          line-height: 1;
        }
        .weather-card__condition {
          font-size: 1.125rem;
          color: var(--clr-text-secondary);
          margin-top: var(--space-xs);
        }
        .weather-card__stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-md);
          padding-top: var(--space-lg);
          border-top: 1px solid var(--clr-glass-border);
        }
        .weather-card__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .weather-card__stat-icon {
          font-size: 1.25rem;
        }
        .weather-card__stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-text-primary);
        }
        .weather-card__stat-label {
          font-size: 0.75rem;
          color: var(--clr-text-muted);
        }
        @media (max-width: 600px) {
          .weather-card__stats {
            grid-template-columns: repeat(2, 1fr);
          }
          .weather-card__temp { font-size: 3.5rem; }
          .weather-card__emoji { font-size: 3.5rem; }
        }
      `}</style>
    </div>
  );
}

export default WeatherCard;
