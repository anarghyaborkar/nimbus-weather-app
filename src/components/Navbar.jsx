// src/components/Navbar.jsx
// Minimalist, calm navigation header inspired by Linear and Vercel.
// Now includes: city local time clock + ambient sound toggle.

import { useState, useEffect } from 'react';
import AmbientPlayer from './AmbientPlayer';

function Navbar({ weather, condition, onAchievement }) {
  const [cityTime, setCityTime] = useState('');

  // Update the city clock every minute using the weather timezone offset
  useEffect(() => {
    function computeTime() {
      if (!weather?.timezone && weather?.timezone !== 0) {
        setCityTime('');
        return;
      }
      const tzOffset = weather.timezone; // seconds
      const nowUnix = Math.floor(Date.now() / 1000);
      const localMs = (nowUnix + tzOffset) * 1000;
      const d = new Date(localMs);
      const h = d.getUTCHours();
      const m = d.getUTCMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hh = h % 12 || 12;
      setCityTime(`${hh}:${String(m).padStart(2, '0')} ${ampm}`);
    }

    computeTime();
    const id = setInterval(computeTime, 30000);
    return () => clearInterval(id);
  }, [weather?.timezone]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true">☁</span>
          <span className="navbar__name">Nimbus</span>
        </div>

        <div className="navbar__actions">
          {/* City local time */}
          {cityTime && weather?.city && (
            <span className="navbar__city-time" aria-label={`Local time in ${weather.city}: ${cityTime}`}>
              {weather.city.split(',')[0]} · {cityTime}
            </span>
          )}

          {/* Ambient sound toggle */}
          <AmbientPlayer condition={condition} onAchievement={onAchievement} />

          <span className="navbar__pill">Live Weather</span>
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(10, 12, 16, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          transition: border-color var(--trans-fast);
        }
        .navbar__inner {
          max-width: 980px;
          margin: 0 auto;
          padding: var(--space-sm) var(--space-md);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .navbar__logo {
          font-size: 1.125rem;
          color: var(--text-hero);
          opacity: 0.9;
        }
        .navbar__name {
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--text-hero);
        }
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
        }
        .navbar__pill {
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .navbar__city-time {
          font-size: 0.75rem;
          color: var(--text-quaternary);
          font-variant-numeric: tabular-nums;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        @media (max-width: 540px) {
          .navbar__city-time {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
