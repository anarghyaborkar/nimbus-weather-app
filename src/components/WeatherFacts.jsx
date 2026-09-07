// src/components/WeatherFacts.jsx
// Displays interesting weather-related trivia or contextual facts.
// In a future step this can be driven by dynamic API data or an AI service.

const PLACEHOLDER_FACTS = [
  {
    icon: '🌊',
    title: 'UV Index',
    value: 'High — 7',
    detail: 'Limit sun exposure between 10 am – 4 pm.',
  },
  {
    icon: '🌅',
    title: 'Sunrise / Sunset',
    value: '6:08 am / 6:41 pm',
    detail: 'Golden hour starts around 6:11 pm.',
  },
  {
    icon: '💦',
    title: 'Dew Point',
    value: '24°C',
    detail: 'Muggy conditions expected throughout the day.',
  },
];

function WeatherFacts() {
  return (
    <section className="facts" aria-label="Weather facts">
      <h3 className="facts__title">Weather Facts</h3>

      <div className="facts__grid">
        {PLACEHOLDER_FACTS.map((fact) => (
          <div className="facts__item glass" key={fact.title}>
            <span className="facts__icon" aria-hidden="true">{fact.icon}</span>
            <div className="facts__body">
              <p className="facts__label">{fact.title}</p>
              <p className="facts__value">{fact.value}</p>
              <p className="facts__detail">{fact.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .facts {
          width: 100%;
        }
        .facts__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-text-secondary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: var(--space-md);
        }
        .facts__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-md);
        }
        .facts__item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-lg);
          transition: background var(--transition-base), transform var(--transition-base);
        }
        .facts__item:hover {
          background: var(--clr-glass-hover);
          transform: translateY(-2px);
        }
        .facts__icon {
          font-size: 1.75rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .facts__body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .facts__label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--clr-text-muted);
        }
        .facts__value {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--clr-text-primary);
        }
        .facts__detail {
          font-size: 0.8125rem;
          color: var(--clr-text-secondary);
          margin-top: 2px;
        }
        @media (max-width: 768px) {
          .facts__grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

export default WeatherFacts;
