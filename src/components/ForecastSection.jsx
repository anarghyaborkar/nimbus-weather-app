// src/components/ForecastSection.jsx
// Horizontal 5-day forecast strip — will be powered by API data in a future step.

const PLACEHOLDER_DAYS = [
  { day: 'Today',  icon: '⛅', high: 34, low: 26 },
  { day: 'Tue',   icon: '🌧', high: 30, low: 24 },
  { day: 'Wed',   icon: '⛈', high: 28, low: 22 },
  { day: 'Thu',   icon: '🌤', high: 33, low: 25 },
  { day: 'Fri',   icon: '☀️', high: 36, low: 27 },
];

function ForecastSection() {
  return (
    <section className="forecast" aria-label="5-day forecast">
      <h3 className="forecast__title">5-Day Forecast</h3>

      <div className="forecast__strip">
        {PLACEHOLDER_DAYS.map((item) => (
          <div
            key={item.day}
            className={`forecast__card glass ${item.day === 'Today' ? 'forecast__card--active' : ''}`}
          >
            <p className="forecast__day">{item.day}</p>
            <span className="forecast__icon" aria-hidden="true">{item.icon}</span>
            <p className="forecast__high">{item.high}°</p>
            <p className="forecast__low">{item.low}°</p>
          </div>
        ))}
      </div>

      <style>{`
        .forecast {
          width: 100%;
        }
        .forecast__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-text-secondary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: var(--space-md);
        }
        .forecast__strip {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--space-md);
        }
        .forecast__card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-md) var(--space-sm);
          transition: background var(--transition-base), transform var(--transition-base);
        }
        .forecast__card:hover {
          background: var(--clr-glass-hover);
          transform: translateY(-3px);
        }
        .forecast__card--active {
          background: rgba(79, 142, 247, 0.12);
          border-color: rgba(79, 142, 247, 0.3);
          box-shadow: var(--shadow-glow-blue);
        }
        .forecast__day {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--clr-text-secondary);
        }
        .forecast__icon {
          font-size: 1.75rem;
        }
        .forecast__high {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--clr-text-primary);
        }
        .forecast__low {
          font-size: 0.875rem;
          color: var(--clr-text-muted);
        }
        @media (max-width: 600px) {
          .forecast__strip {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
}

export default ForecastSection;
