// src/components/AmbientPlayer.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Ambient Weather Sound System
//
// • Plays a looping audio clip matched to the current weather condition
// • Mute/unmute toggle — preference persisted in localStorage
// • Volume fades in/out smoothly when condition changes or mute toggled
// • Uses a simple <audio> element — no heavy library
// • Respects prefers-reduced-motion (only affects visuals, not audio)
//
// Usage: <AmbientPlayer condition={condition} />
//   where `condition` is the output of getWeatherCondition(weather)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSoundForCondition } from '../data/ambientSounds';
import { recordEvent } from '../utils/achievementEngine';

const STORAGE_KEY = 'nimbus:ambient_muted';
const FADE_STEPS = 20;
const FADE_INTERVAL_MS = 30; // 30ms × 20 steps = 600ms fade

function loadMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

function saveMuted(val) {
  try {
    localStorage.setItem(STORAGE_KEY, String(val));
  } catch {}
}

function AmbientPlayer({ condition, onAchievement }) {
  const [muted, setMuted] = useState(loadMuted);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);
  const fadeTimerRef = useRef(null);
  const targetVolumeRef = useRef(0);
  const soundConfig = getSoundForCondition(condition);

  // ── Volume fade helper ─────────────────────────────────────────────────────
  const fadeTo = useCallback((targetVol, onDone) => {
    if (!audioRef.current) return;
    clearInterval(fadeTimerRef.current);

    const audio = audioRef.current;
    const start = audio.volume;
    const diff = targetVol - start;
    let step = 0;

    if (Math.abs(diff) < 0.01) {
      audio.volume = targetVol;
      onDone?.();
      return;
    }

    fadeTimerRef.current = setInterval(() => {
      step++;
      audio.volume = Math.min(1, Math.max(0, start + (diff * step) / FADE_STEPS));
      if (step >= FADE_STEPS) {
        clearInterval(fadeTimerRef.current);
        audio.volume = targetVol;
        onDone?.();
      }
    }, FADE_INTERVAL_MS);
  }, []);

  // ── Load / switch track when condition changes ─────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !soundConfig) return;

    targetVolumeRef.current = muted ? 0 : soundConfig.volume;

    // Fade out current, swap src, fade in
    fadeTo(0, () => {
      audio.src = soundConfig.url;
      audio.loop = true;
      audio.volume = 0;

      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay blocked — user needs to interact first
        });
      }

      if (!muted) {
        fadeTo(soundConfig.volume);
      }
    });

    return () => {
      clearInterval(fadeTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, soundConfig?.url]);

  // ── Respond to mute toggle ────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !soundConfig) return;

    if (muted) {
      fadeTo(0, () => {
        audio.pause();
      });
    } else {
      // Try to resume play (may be blocked until user interaction)
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {});
      }
      fadeTo(soundConfig.volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  // ── Toggle handler ────────────────────────────────────────────────────────
  const toggle = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    saveMuted(newMuted);
    setHasInteracted(true);

    if (!newMuted) {
      // First unmute = achievement
      const newAch = recordEvent('turnedOnSound', true);
      if (newAch.length > 0) onAchievement?.(newAch);
    }
  }, [muted, onAchievement]);

  if (!soundConfig) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="none" aria-hidden="true" />

      {/* Mute/unmute pill */}
      <button
        type="button"
        className={`ambient-btn ${muted ? 'ambient-btn--muted' : 'ambient-btn--active'}`}
        onClick={toggle}
        title={muted ? `Play ${soundConfig.label} ambience` : 'Mute ambient sound'}
        aria-label={muted ? `Play ${soundConfig.label} ambient sound` : 'Mute ambient sound'}
        aria-pressed={!muted}
      >
        <span className="ambient-btn__icon" aria-hidden="true">
          {muted ? '🔇' : soundConfig.emoji}
        </span>
        <span className="ambient-btn__label">
          {muted ? 'Sound off' : soundConfig.label}
        </span>
      </button>

      <style>{`
        .ambient-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background var(--trans-fast), border-color var(--trans-fast), color var(--trans-fast);
        }
        .ambient-btn:hover {
          background: var(--bg-surface-elevated);
          border-color: var(--border-medium);
          color: var(--text-primary);
        }
        .ambient-btn--active {
          border-color: rgba(255,255,255,0.12);
          color: var(--text-primary);
        }
        .ambient-btn__icon {
          font-size: 0.875rem;
          line-height: 1;
        }
        .ambient-btn__label {
          font-size: 0.6875rem;
        }
      `}</style>
    </>
  );
}

export default AmbientPlayer;
