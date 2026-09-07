// src/components/ForecastSection.jsx
// 5-day forecast module — quiet, elegant horizontal layout.

import ForecastCard from './ForecastCard';

function ForecastSection({ forecast, loading, error }) {
  const dailyList = forecast?.daily || [];

  return (
    <section className="forecast" aria-label="5-day forecast">
      <div className="forecast__head">
        <h3 className="forecast__label">5-Day Outlook</h3>
        {loading && <span className="forecast__status">Updating…</span>}
      </div>

      {error && !loading && dailyList.length === 0 && (
        <div className="forecast__error">
          <p className="forecast__error-text">{error}</p>
        </div>
      )}

      {loading && dailyList.length === 0 && (
        <div className="forecast__row">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="forecast__skeleton" />
          ))}
        </div>
      )}

      {dailyList.length > 0 && (
        <div className={`forecast__row ${loading ? 'forecast__row--loading' : ''}`}>
          {dailyList.map((item, index) => (
            <ForecastCard
              key={item.date || index}
              item={item}
              isToday={index === 0}
              animationDelay={index * 60}
            />
          ))}
        </div>
      )}

      <style>{`
        .forecast {
          width: 100%;
        }
        .forecast__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
          padding: 0 2px;
        }
        .forecast__label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .forecast__status {
          font-size: 0.6875rem;
          color: var(--text-quaternary);
        }
        .forecast__error {
          padding: var(--space-sm);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(239, 68, 68, 0.15);
          background: rgba(239, 68, 68, 0.04);
        }
        .forecast__error-text {
          color: #fca5a5;
          font-size: 0.75rem;
        }
        .forecast__row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-xs);
          transition: opacity var(--trans-fast);
        }
        .forecast__row--loading {
          opacity: 0.6;
        }
        .forecast__skeleton {
          height: 98px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border-subtle);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.75; }
        }
        @media (max-width: 640px) {
          .forecast__row {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 420px) {
          .forecast__row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

export default ForecastSection;
