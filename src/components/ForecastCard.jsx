// src/components/ForecastCard.jsx
// Minimalist daily forecast card — clean typography and subtle micro-interactions.

function ForecastCard({ item, isToday }) {
  const iconUrl = item.icon
    ? `https://openweathermap.org/img/wn/${item.icon}.png`
    : null;

  return (
    <div
      className={`f-card ${isToday ? 'f-card--active' : ''}`}
      aria-label={`Forecast for ${item.dayOfWeek}`}
    >
      <div className="f-card__day-wrap">
        <span className="f-card__day">{isToday ? 'Today' : item.dayOfWeek}</span>
        <span className="f-card__date">{item.formattedDate}</span>
      </div>

      <div className="f-card__icon-box">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt=""
            className="f-card__icon-img"
            width="32"
            height="32"
            loading="lazy"
            aria-hidden="true"
          />
        ) : (
          <span className="f-card__emoji" aria-hidden="true">☁</span>
        )}
      </div>

      <div className="f-card__temps">
        <span className="f-card__temp-high">{item.tempMax}°</span>
        <span className="f-card__temp-low">{item.tempMin}°</span>
      </div>

      <style>{`
        .f-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 14px 10px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          transition: background var(--trans-fast), border-color var(--trans-fast), transform var(--trans-base);
          text-align: center;
        }
        .f-card:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
          transform: translateY(-2px);
        }
        .f-card--active {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .f-card__day-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .f-card__day {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .f-card__date {
          font-size: 0.6875rem;
          color: var(--text-quaternary);
        }
        .f-card__icon-box {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2px 0;
        }
        .f-card__icon-img {
          width: 32px;
          height: 32px;
          object-fit: contain;
          opacity: 0.85;
        }
        .f-card__emoji {
          font-size: 1.125rem;
          opacity: 0.7;
        }
        .f-card__temps {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .f-card__temp-high {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .f-card__temp-low {
          font-size: 0.75rem;
          color: var(--text-tertiary);
        }
      `}</style>
    </div>
  );
}

export default ForecastCard;
