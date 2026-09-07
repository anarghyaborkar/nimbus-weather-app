// src/hooks/useCountUp.js
// ─────────────────────────────────────────────────────────────────────────────
// Lightweight hook that animates a number from 0 to a target value.
// Used for the hero temperature in WeatherCard for a satisfying first-load feel.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react';

/**
 * Smoothly animates from `start` to `end` over `duration` milliseconds.
 * Uses requestAnimationFrame for silky smooth animation.
 *
 * @param {number} end       - Target value to count up to
 * @param {number} duration  - Animation duration in ms (default: 700)
 * @param {number} start     - Starting value (default: 0)
 * @returns {number}         - Current animated value (integer)
 */
export function useCountUp(end, duration = 700, start = 0) {
  const [current, setCurrent] = useState(end === null || end === undefined ? 0 : end);
  const rafRef = useRef(null);
  const prevEndRef = useRef(end);

  useEffect(() => {
    // Skip animation if value hasn't changed or is invalid
    if (end === null || end === undefined) return;

    // If this is the first render with a valid value, jump straight to it
    // (avoids counting up from 0 on every city search — only on the initial load)
    const isFirstRender = prevEndRef.current === end;
    prevEndRef.current = end;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCurrent(end);
      return;
    }

    // Cancel any running animation
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    const from = isFirstRender ? start : current;
    const startTime = performance.now();
    const range = end - from;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(from + range * eased));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration]);

  return current;
}
