// src/components/SmartTips.jsx
// Intelligent Smart Tips module.
// Dynamically generates 2-3 contextual suggestions based on live weather metrics.
// Subtle staggered fade-in animations on updates.

import { useMemo } from 'react';
import { generateSmartTips } from '../utils/tipEngine';

function SmartTips({ weather, loading }) {
  const tips = useMemo(() => generateSmartTips(weather), [weather]);

  return (
    <section className="smart-panel" aria-label="Smart tips">
      <div className="smart-panel__head">
        <h3 className="smart-panel__label">Smart Tips</h3>
        {loading && <span className="smart-panel__status">Updating…</span>}
      </div>

      <div className="smart-panel__card">
        <ul className="smart-list" role="list">
          {tips.map((tip, idx) => (
            <li
              className="smart-item"
              key={tip.id || idx}
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <span className="smart-icon" aria-hidden="true">{tip.icon}</span>
              <div className="smart-body">
                <p className="smart-title">{tip.title}</p>
                <p className="smart-text">{tip.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .smart-panel {
          width: 100%;
        }
        .smart-panel__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-sm);
          padding: 0 2px;
        }
        .smart-panel__label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .smart-panel__status {
          font-size: 0.6875rem;
          color: var(--text-quaternary);
        }
        .smart-panel__card {
          padding: 16px 18px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          transition: background var(--trans-fast), border-color var(--trans-fast);
        }
        .smart-panel__card:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
        }
        .smart-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .smart-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          animation: tipFadeIn 0.35s ease-out both;
        }
        .smart-icon {
          font-size: 0.9375rem;
          line-height: 1.4;
          flex-shrink: 0;
          opacity: 0.9;
        }
        .smart-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .smart-title {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
          line-height: 1.35;
          letter-spacing: -0.01em;
        }
        .smart-text {
          font-size: 0.75rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @keyframes tipFadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .smart-item {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default SmartTips;
