// src/components/AchievementsPanel.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Gamification — displays all achievement badges in a collapsible grid.
// Locked achievements shown as faded/greyed-out.
// Newly unlocked achievements animate in with a shimmer pop.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { getAchievementsWithStatus } from '../utils/achievementEngine';

const RARITY_COLORS = {
  common:   'rgba(255,255,255,0.07)',
  uncommon: 'rgba(56,189,248,0.10)',
  rare:     'rgba(167,139,250,0.12)',
};
const RARITY_BORDER = {
  common:   'rgba(255,255,255,0.08)',
  uncommon: 'rgba(56,189,248,0.20)',
  rare:     'rgba(167,139,250,0.28)',
};

function AchievementsPanel({ newlyUnlockedIds = [] }) {
  const [achievements, setAchievements] = useState(getAchievementsWithStatus);
  const [expanded, setExpanded] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(new Set(newlyUnlockedIds));

  // Re-read achievements when new ones unlock
  useEffect(() => {
    if (newlyUnlockedIds.length > 0) {
      setAchievements(getAchievementsWithStatus());
      setJustUnlocked(new Set(newlyUnlockedIds));
      // Clear the "just unlocked" highlight after the animation
      const id = setTimeout(() => setJustUnlocked(new Set()), 3000);
      return () => clearTimeout(id);
    }
  }, [newlyUnlockedIds]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Show summary in collapsed state, full grid when expanded
  const visibleAchievements = expanded ? achievements : achievements.filter((a) => a.unlocked).slice(0, 4);

  return (
    <section className="ach-panel" aria-label="Achievements">
      {/* Header */}
      <div className="ach-panel__head">
        <div className="ach-panel__title-group">
          <span className="ach-panel__icon" aria-hidden="true">🏆</span>
          <h3 className="ach-panel__title">Achievements</h3>
          <span className="ach-panel__progress" aria-label={`${unlockedCount} of ${achievements.length} unlocked`}>
            {unlockedCount}/{achievements.length}
          </span>
        </div>
        <button
          type="button"
          className="ach-panel__toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'See all'}
          <span className="ach-panel__chevron" aria-hidden="true">{expanded ? '↑' : '↓'}</span>
        </button>
      </div>

      {/* Empty / locked state */}
      {unlockedCount === 0 && !expanded && (
        <div className="ach-empty">
          <p className="ach-empty__text">Search cities, check the weather, write journal entries — achievements unlock automatically.</p>
        </div>
      )}

      {/* Achievement grid */}
      {(expanded || unlockedCount > 0) && (
        <div
          className="ach-grid"
          role="list"
          aria-label="Achievement badges"
        >
          {(expanded ? achievements : achievements.filter((a) => a.unlocked)).map((ach) => {
            const isNew = justUnlocked.has(ach.id);
            return (
              <div
                key={ach.id}
                role="listitem"
                className={`ach-badge ${ach.unlocked ? 'ach-badge--unlocked' : 'ach-badge--locked'} ${isNew ? 'ach-badge--new' : ''}`}
                style={ach.unlocked ? {
                  background: RARITY_COLORS[ach.rarity] || RARITY_COLORS.common,
                  borderColor: RARITY_BORDER[ach.rarity] || RARITY_BORDER.common,
                } : {}}
                title={`${ach.title}: ${ach.description}${!ach.unlocked ? ' (Locked)' : ''}`}
                aria-label={`${ach.title}${!ach.unlocked ? ', locked' : ', unlocked'}: ${ach.description}`}
              >
                <span className="ach-badge__icon" aria-hidden="true">{ach.icon}</span>
                <span className="ach-badge__name">{ach.title}</span>
                {!ach.unlocked && (
                  <span className="ach-badge__lock" aria-hidden="true">🔒</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .ach-panel {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        /* ── Header ── */
        .ach-panel__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2px;
        }
        .ach-panel__title-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ach-panel__icon {
          font-size: 0.875rem;
          line-height: 1;
        }
        .ach-panel__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .ach-panel__progress {
          font-size: 0.625rem;
          color: var(--text-quaternary);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          padding: 1px 6px;
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .ach-panel__toggle {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.6875rem;
          font-weight: 500;
          transition: background var(--trans-fast), color var(--trans-fast);
        }
        .ach-panel__toggle:hover {
          background: rgba(255,255,255,0.09);
          color: var(--text-primary);
        }
        .ach-panel__chevron {
          font-size: 0.625rem;
        }

        /* ── Empty ── */
        .ach-empty {
          padding: 16px 18px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
        }
        .ach-empty__text {
          font-size: 0.8125rem;
          color: var(--text-quaternary);
          line-height: 1.55;
          text-align: center;
        }

        /* ── Grid ── */
        .ach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
          gap: 8px;
        }

        /* ── Badge ── */
        .ach-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 10px 6px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          background: var(--bg-surface);
          transition: transform var(--trans-base), border-color var(--trans-fast);
          position: relative;
          text-align: center;
        }
        .ach-badge--unlocked {
          cursor: default;
        }
        .ach-badge--unlocked:hover {
          transform: translateY(-2px);
        }
        .ach-badge--locked {
          opacity: 0.35;
          filter: grayscale(1);
        }
        .ach-badge--new {
          animation: achUnlock 0.6s ease-out;
        }
        @keyframes achUnlock {
          0%   { transform: scale(0.85); opacity: 0.4; }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1);   opacity: 1; }
        }
        .ach-badge__icon {
          font-size: 1.375rem;
          line-height: 1;
        }
        .ach-badge__name {
          font-size: 0.5625rem;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .ach-badge--unlocked .ach-badge__name {
          color: var(--text-primary);
        }
        .ach-badge__lock {
          font-size: 0.5rem;
          position: absolute;
          top: 5px;
          right: 5px;
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .ach-badge--new {
            animation: none !important;
          }
          .ach-badge--unlocked:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default AchievementsPanel;
