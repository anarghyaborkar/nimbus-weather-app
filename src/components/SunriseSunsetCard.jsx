// src/components/SunriseSunsetCard.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Apple Weather-inspired Sunrise & Sunset experience.
// Reads sunrise, sunset, and timezone from the weather data (already returned
// by the backend) and computes everything locally — no API calls needed.
//
// Features:
//   • Animated SVG arc with a glowing sun dot that travels from left to right
//   • Real-time local city clock (updates every second)
//   • Time-remaining countdown ("2h 14m until sunset")
//   • Clean gradient track + subtle glow on the sun dot
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Convert a Unix UTC timestamp to local time in the city's timezone.
 * @param {number} unixTs  - Unix seconds
 * @param {number} tzOffset - City UTC offset in seconds (from weather.timezone)
 */
function toLocalTime(unixTs, tzOffset) {
  // Convert to city's local milliseconds
  const localMs = (unixTs + tzOffset) * 1000;
  const d = new Date(localMs);
  // getUTC* reads the shifted value as-is
  return { h: d.getUTCHours(), m: d.getUTCMinutes(), s: d.getUTCSeconds() };
}

/** Format hours + minutes as "6:42 AM" */
function formatTime({ h, m }) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Format a duration in seconds into "Xh Ym" or "Ym" */
function formatDuration(totalSeconds) {
  if (totalSeconds <= 0) return null;
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Given the current local timestamp and rise/set Unix timestamps,
 * return a 0–1 progress value (0 = at sunrise, 1 = at sunset).
 * Clamps to [0, 1].
 */
function getSunProgress(nowUnix, sunriseUnix, sunsetUnix) {
  const total = sunsetUnix - sunriseUnix;
  if (total <= 0) return 0.5;
  const elapsed = nowUnix - sunriseUnix;
  return Math.min(1, Math.max(0, elapsed / total));
}

// ── SVG Arc Maths ─────────────────────────────────────────────────────────────

const ARC_W = 220;
const ARC_H = 90;
const ARC_PAD = 16;
const ARC_RX = (ARC_W - ARC_PAD * 2) / 2;
const ARC_CX = ARC_W / 2;
const ARC_CY = ARC_H - 4;

/** Parametric point on a semi-ellipse, t ∈ [0, 1] from left to right */
function arcPoint(t) {
  const angle = Math.PI * (1 - t); // π → 0 (left→right, upward arc)
  return {
    x: ARC_CX + ARC_RX * Math.cos(angle),
    y: ARC_CY - (ARC_H - 10) * Math.sin(angle),
  };
}

// Build the SVG path for the full arc
function buildArcPath() {
  const start = arcPoint(0);
  const end = arcPoint(1);
  return `M ${start.x} ${start.y} A ${ARC_RX} ${ARC_H - 10} 0 0 1 ${end.x} ${end.y}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

function SunriseSunsetCard({ weather }) {
  const [nowUnix, setNowUnix] = useState(() => Math.floor(Date.now() / 1000));

  // Tick every second to keep the clock and sun position live
  useEffect(() => {
    const id = setInterval(() => {
      setNowUnix(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Guard: we need sunrise, sunset, timezone
  if (!weather?.sunrise || !weather?.sunset || weather?.timezone === undefined) {
    return null;
  }

  const { sunrise, sunset, timezone } = weather;

  // City's current local time (in city timezone)
  const localNow = toLocalTime(nowUnix, timezone);
  const localClock = formatTime(localNow);

  const sunriseLocal = toLocalTime(sunrise, timezone);
  const sunsetLocal  = toLocalTime(sunset,  timezone);

  // Sun arc progress
  const progress = getSunProgress(nowUnix, sunrise, sunset);
  const sunPos = arcPoint(progress);
  const isDay = nowUnix >= sunrise && nowUnix <= sunset;

  // Time remaining label
  let timeLabel = null;
  if (nowUnix < sunrise) {
    const remaining = sunrise - nowUnix;
    const dur = formatDuration(remaining);
    timeLabel = dur ? `${dur} until sunrise` : 'Sunrise soon';
  } else if (nowUnix <= sunset) {
    const remaining = sunset - nowUnix;
    const dur = formatDuration(remaining);
    timeLabel = dur ? `${dur} until sunset` : 'Sunset soon';
  } else {
    timeLabel = 'Past sunset';
  }

  const arcPath = buildArcPath();
  const startPt = arcPoint(0);
  const endPt   = arcPoint(1);

  return (
    <section className="sun-card" aria-label="Sunrise and sunset times">
      {/* Header */}
      <div className="sun-card__head">
        <div className="sun-card__label-group">
          <span className="sun-card__icon" aria-hidden="true">☀</span>
          <h3 className="sun-card__title">Sun & Sky</h3>
        </div>
        <span className="sun-card__clock" aria-label={`Local time: ${localClock}`}>
          {localClock}
        </span>
      </div>

      {/* SVG Arc */}
      <div className="sun-card__arc-wrap" aria-hidden="true">
        <svg
          width={ARC_W}
          height={ARC_H}
          viewBox={`0 0 ${ARC_W} ${ARC_H}`}
          className="sun-arc"
          overflow="visible"
        >
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="rgba(251,191,36,0.15)" />
              <stop offset="50%"  stopColor="rgba(251,191,36,0.45)" />
              <stop offset="100%" stopColor="rgba(251,191,36,0.12)" />
            </linearGradient>
            <filter id="sunGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track (full arc) */}
          <path
            d={arcPath}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Filled progress arc (same shape, clipped to progress) */}
          <path
            d={arcPath}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${progress * 400} 400`}
            className="sun-arc__progress"
          />

          {/* Horizon baseline */}
          <line
            x1={startPt.x - 4}
            y1={ARC_CY}
            x2={endPt.x + 4}
            y2={ARC_CY}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Sunrise label */}
          <text
            x={startPt.x}
            y={ARC_CY + 14}
            textAnchor="middle"
            className="sun-arc__label"
          >
            {formatTime(sunriseLocal)}
          </text>

          {/* Sunset label */}
          <text
            x={endPt.x}
            y={ARC_CY + 14}
            textAnchor="middle"
            className="sun-arc__label"
          >
            {formatTime(sunsetLocal)}
          </text>

          {/* Sun dot — only visible during day */}
          {isDay && (
            <g filter="url(#sunGlow)" className="sun-dot-group">
              {/* Outer glow halo */}
              <circle
                cx={sunPos.x}
                cy={sunPos.y}
                r="8"
                fill="rgba(251,191,36,0.18)"
                className="sun-dot__halo"
              />
              {/* Core dot */}
              <circle
                cx={sunPos.x}
                cy={sunPos.y}
                r="5"
                fill="#fbbf24"
                className="sun-dot__core"
              />
            </g>
          )}

          {/* Night moon dot */}
          {!isDay && (
            <g>
              <circle cx={endPt.x} cy={ARC_CY} r="4" fill="rgba(186,230,253,0.5)" />
            </g>
          )}
        </svg>
      </div>

      {/* Stats row */}
      <div className="sun-card__stats">
        <div className="sun-stat">
          <span className="sun-stat__emoji" aria-hidden="true">🌅</span>
          <span className="sun-stat__label">Sunrise</span>
          <span className="sun-stat__val">{formatTime(sunriseLocal)}</span>
        </div>

        <div className="sun-stat sun-stat--center">
          <span className="sun-stat__remain" aria-live="polite">{timeLabel}</span>
        </div>

        <div className="sun-stat sun-stat--right">
          <span className="sun-stat__emoji" aria-hidden="true">🌇</span>
          <span className="sun-stat__label">Sunset</span>
          <span className="sun-stat__val">{formatTime(sunsetLocal)}</span>
        </div>
      </div>

      <style>{`
        .sun-card {
          width: 100%;
          padding: 16px 20px 14px;
          border-radius: var(--radius-md);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background var(--trans-fast), border-color var(--trans-fast);
        }
        .sun-card:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
        }

        /* ── Head ── */
        .sun-card__head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 4px;
        }
        .sun-card__label-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sun-card__icon {
          font-size: 0.75rem;
          line-height: 1;
          opacity: 0.85;
        }
        .sun-card__title {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }
        .sun-card__clock {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-secondary);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.01em;
        }

        /* ── Arc SVG ── */
        .sun-card__arc-wrap {
          display: flex;
          justify-content: center;
          margin: 2px 0 0;
          overflow: visible;
        }
        .sun-arc {
          overflow: visible;
        }
        .sun-arc__progress {
          transition: stroke-dasharray 1s linear;
        }
        .sun-arc__label {
          font-family: var(--font-sans);
          font-size: 8px;
          fill: rgba(255,255,255,0.3);
          letter-spacing: 0.02em;
        }
        .sun-dot__halo {
          animation: sunPulseHalo 2.5s ease-in-out infinite alternate;
        }
        .sun-dot__core {
          animation: sunPulseCore 2.5s ease-in-out infinite alternate;
        }
        @keyframes sunPulseHalo {
          from { r: 7; opacity: 0.6; }
          to   { r: 10; opacity: 0.25; }
        }
        @keyframes sunPulseCore {
          from { r: 4.5; }
          to   { r: 5.5; }
        }

        /* ── Stats Row ── */
        .sun-card__stats {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: var(--space-xs);
          padding-top: 6px;
          border-top: 1px solid var(--border-subtle);
          margin-top: 2px;
        }
        .sun-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
        }
        .sun-stat--right {
          align-items: flex-end;
        }
        .sun-stat--center {
          align-items: center;
          text-align: center;
          padding: 0 4px;
        }
        .sun-stat__emoji {
          font-size: 0.875rem;
          line-height: 1;
        }
        .sun-stat__label {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: var(--text-quaternary);
          font-weight: 500;
        }
        .sun-stat__val {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-primary);
          font-variant-numeric: tabular-nums;
        }
        .sun-stat__remain {
          font-size: 0.6875rem;
          color: var(--text-tertiary);
          line-height: 1.4;
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .sun-dot__halo,
          .sun-dot__core,
          .sun-arc__progress {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

export default SunriseSunsetCard;
