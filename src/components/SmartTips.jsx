// src/components/SmartTips.jsx
// AI-generated smart tips based on the current weather.
// Placeholder content — will be driven by an AI/chatbot integration later.

const PLACEHOLDER_TIPS = [
  {
    icon: '🧴',
    tip: 'Apply SPF 50+ sunscreen — UV levels are high today.',
  },
  {
    icon: '💧',
    tip: 'Stay hydrated. Drink at least 3 litres of water.',
  },
  {
    icon: '👗',
    tip: 'Wear light, breathable cotton fabrics.',
  },
];

function SmartTips() {
  return (
    <section className="tips glass" aria-label="Smart weather tips">
      <div className="tips__header">
        <span className="tips__ai-badge" aria-hidden="true">✨ AI</span>
        <h3 className="tips__title">Smart Tips for Today</h3>
      </div>

      <ul className="tips__list" role="list">
        {PLACEHOLDER_TIPS.map((item, i) => (
          <li className="tips__item" key={i}>
            <span className="tips__icon" aria-hidden="true">{item.icon}</span>
            <p className="tips__text">{item.tip}</p>
          </li>
        ))}
      </ul>

      <style>{`
        .tips {
          padding: var(--space-xl);
          background: linear-gradient(145deg, rgba(124,111,247,0.10), rgba(79,142,247,0.06));
        }
        .tips__header {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-bottom: var(--space-lg);
        }
        .tips__ai-badge {
          padding: 2px 10px;
          border-radius: var(--radius-full);
          background: rgba(124, 111, 247, 0.18);
          border: 1px solid rgba(124, 111, 247, 0.35);
          color: var(--clr-accent-indigo);
          font-size: 0.75rem;
          font-weight: 600;
        }
        .tips__title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--clr-text-primary);
          margin: 0;
        }
        .tips__list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }
        .tips__item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-md);
          padding: var(--space-md);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--clr-glass-border);
          transition: background var(--transition-fast);
        }
        .tips__item:hover {
          background: rgba(255, 255, 255, 0.07);
        }
        .tips__icon {
          font-size: 1.25rem;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .tips__text {
          font-size: 0.9375rem;
          color: var(--clr-text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}

export default SmartTips;
