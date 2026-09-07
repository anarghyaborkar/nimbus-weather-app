// src/components/AnimatedBackground.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Immersive Atmospheric Weather Engine
// Dynamically morphs the entire backdrop into real-time weather conditions:
// ☀ Clear: Warm sun rays, slow moving sunlight beam, floating sun-dust motes
// ☁ Clouds: Multi-layered drifting cloud masses, soft shadow variations
// 🌧 Rain: Slanted falling raindrops, puddle ripple rings, glass reflection sheen
// ⛈ Thunderstorm: Brooding dark skies with intermittent lightning flashes
// ❄ Snow: Softly descending multi-speed snowflakes, chilled ambient glow
// 🌫 Mist: Floating translucent mist and fog veils
// Respects prefers-reduced-motion for accessibility.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { getWeatherCondition } from '../utils/weatherThemes';

function AnimatedBackground({ weather }) {
  const condition = useMemo(() => getWeatherCondition(weather), [weather]);

  return (
    <div className={`anim-bg anim-bg--${condition}`} aria-hidden="true">
      {/* ── Condition-specific weather elements ── */}

      {/* 1. CLEAR: Warm sunlight beam and floating dust motes */}
      {condition === 'clear' && (
        <div className="weather-scene scene-clear">
          <div className="sun-glow" />
          <div className="sun-beam" />
          <div className="sun-beam sun-beam--secondary" />
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="dust-mote"
              style={{
                left: `${(i * 7 + 5) % 95}%`,
                top: `${(i * 13 + 10) % 90}%`,
                animationDelay: `${(i * 0.7) % 5}s`,
                animationDuration: `${6 + (i % 5)}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 2. CLOUDS: Multi-layered billowing cloud silhouettes */}
      {condition === 'clouds' && (
        <div className="weather-scene scene-clouds">
          <div className="cloud-mass cloud-mass--back" />
          <div className="cloud-mass cloud-mass--mid" />
          <div className="cloud-mass cloud-mass--fore" />
          <div className="cloud-shadow" />
        </div>
      )}

      {/* 3. RAIN: Slanted rain streaks and ground/glass ripples */}
      {condition === 'rain' && (
        <div className="weather-scene scene-rain">
          <div className="rain-layer rain-layer--fast">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className="raindrop"
                style={{
                  left: `${(i * 3.3 + 1)}%`,
                  animationDelay: `${(i * 0.12) % 1.5}s`,
                  animationDuration: `${0.65 + (i % 3) * 0.15}s`,
                }}
              />
            ))}
          </div>
          <div className="rain-layer rain-layer--slow">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={`slow-${i}`}
                className="raindrop raindrop--light"
                style={{
                  left: `${(i * 5 + 3)}%`,
                  animationDelay: `${(i * 0.18) % 2}s`,
                  animationDuration: `${0.95 + (i % 3) * 0.2}s`,
                }}
              />
            ))}
          </div>
          {/* Subtle ripple rings */}
          <div className="ripple ripple--1" />
          <div className="ripple ripple--2" />
          <div className="ripple ripple--3" />
        </div>
      )}

      {/* 4. THUNDERSTORM: Storm darkness and periodic lightning flash */}
      {condition === 'thunderstorm' && (
        <div className="weather-scene scene-thunder">
          <div className="lightning-flash" />
          <div className="storm-cloud storm-cloud--1" />
          <div className="storm-cloud storm-cloud--2" />
          <div className="rain-layer rain-layer--storm">
            {Array.from({ length: 36 }).map((_, i) => (
              <span
                key={i}
                className="raindrop raindrop--heavy"
                style={{
                  left: `${(i * 2.8 + 1)}%`,
                  animationDelay: `${(i * 0.08) % 1}s`,
                  animationDuration: `${0.45 + (i % 3) * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 5. SNOW: Gently drifting snowflakes */}
      {condition === 'snow' && (
        <div className="weather-scene scene-snow">
          <div className="snow-glow" />
          {Array.from({ length: 35 }).map((_, i) => (
            <span
              key={i}
              className={`snowflake snowflake--size-${(i % 3) + 1}`}
              style={{
                left: `${(i * 2.85 + 2)}%`,
                animationDelay: `${(i * 0.35) % 6}s`,
                animationDuration: `${4.5 + (i % 5) * 1.2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 6. MIST / FOG: Shifting translucent haze layers */}
      {condition === 'mist' && (
        <div className="weather-scene scene-mist">
          <div className="fog-layer fog-layer--1" />
          <div className="fog-layer fog-layer--2" />
          <div className="fog-layer fog-layer--3" />
        </div>
      )}

      {/* Subtle base atmospheric orbs that adapt tint to current theme */}
      <div className="anim-bg__orb anim-bg__orb--1" />
      <div className="anim-bg__orb anim-bg__orb--2" />

      <style>{`
        /* ── Base Container ── */
        .anim-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* ── Atmospheric Ambient Gradients per Condition ── */
        .anim-bg--clear {
          background: radial-gradient(ellipse at 70% 15%, #1c2e4a 0%, #0c172a 45%, #070c16 85%);
        }
        .anim-bg--clouds {
          background: radial-gradient(ellipse at 50% 20%, #172338 0%, #0d1626 50%, #080d16 90%);
        }
        .anim-bg--rain {
          background: radial-gradient(ellipse at 40% 10%, #112338 0%, #0a1524 55%, #050b13 90%);
        }
        .anim-bg--thunderstorm {
          background: radial-gradient(ellipse at 50% 0%, #12182b 0%, #080b14 60%, #04050a 95%);
        }
        .anim-bg--snow {
          background: radial-gradient(ellipse at 50% 10%, #182c47 0%, #0d1b30 55%, #08101d 90%);
        }
        .anim-bg--mist {
          background: radial-gradient(ellipse at 50% 30%, #1c2738 0%, #0f1826 50%, #090e18 90%);
        }

        /* Base Floating Orbs with contextual tints */
        .anim-bg__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          animation: orbFloat 14s ease-in-out infinite alternate;
          transition: background 1.2s ease, opacity 1.2s ease;
        }
        .anim-bg__orb--1 {
          width: 520px;
          height: 520px;
          top: -100px;
          left: -80px;
        }
        .anim-bg__orb--2 {
          width: 420px;
          height: 420px;
          bottom: 5%;
          right: -80px;
          animation-duration: 11s;
          animation-direction: alternate-reverse;
        }
        .anim-bg--clear .anim-bg__orb--1 { background: rgba(251, 191, 36, 0.13); }
        .anim-bg--clear .anim-bg__orb--2 { background: rgba(79, 142, 247, 0.12); }
        .anim-bg--clouds .anim-bg__orb--1 { background: rgba(148, 163, 184, 0.10); }
        .anim-bg--clouds .anim-bg__orb--2 { background: rgba(79, 142, 247, 0.08); }
        .anim-bg--rain .anim-bg__orb--1 { background: rgba(56, 189, 248, 0.10); }
        .anim-bg--rain .anim-bg__orb--2 { background: rgba(30, 58, 138, 0.18); }
        .anim-bg--thunderstorm .anim-bg__orb--1 { background: rgba(124, 58, 237, 0.16); }
        .anim-bg--thunderstorm .anim-bg__orb--2 { background: rgba(59, 130, 246, 0.10); }
        .anim-bg--snow .anim-bg__orb--1 { background: rgba(224, 242, 254, 0.12); }
        .anim-bg--snow .anim-bg__orb--2 { background: rgba(56, 189, 248, 0.08); }
        .anim-bg--mist .anim-bg__orb--1 { background: rgba(203, 213, 225, 0.08); }
        .anim-bg--mist .anim-bg__orb--2 { background: rgba(100, 116, 139, 0.08); }

        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(35px, 45px) scale(1.08); }
        }

        /* ── 1. CLEAR THEME ANIMATIONS ── */
        .scene-clear .sun-glow {
          position: absolute;
          top: -120px;
          right: 15%;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(253, 224, 71, 0.22) 0%, rgba(251, 191, 36, 0.08) 50%, transparent 75%);
          filter: blur(40px);
          animation: sunPulse 8s ease-in-out infinite alternate;
        }
        .scene-clear .sun-beam {
          position: absolute;
          top: -200px;
          right: 10%;
          width: 700px;
          height: 1000px;
          background: linear-gradient(135deg, rgba(253, 224, 71, 0.06) 0%, transparent 60%);
          transform: rotate(-25deg);
          transform-origin: top right;
          animation: beamSweep 16s ease-in-out infinite alternate;
          filter: blur(24px);
        }
        .scene-clear .sun-beam--secondary {
          right: 25%;
          width: 500px;
          animation-duration: 22s;
          opacity: 0.7;
        }
        .dust-mote {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(254, 240, 138, 0.65);
          box-shadow: 0 0 6px rgba(253, 224, 71, 0.8);
          animation: dustDrift linear infinite;
        }
        @keyframes sunPulse {
          0%   { transform: scale(1); opacity: 0.85; }
          100% { transform: scale(1.12); opacity: 1; }
        }
        @keyframes beamSweep {
          0%   { transform: rotate(-28deg) scale(0.95); }
          100% { transform: rotate(-20deg) scale(1.08); }
        }
        @keyframes dustDrift {
          0%   { transform: translate(0, 0) scale(0.6); opacity: 0; }
          25%  { opacity: 0.8; }
          75%  { opacity: 0.8; }
          100% { transform: translate(30px, -70px) scale(1.2); opacity: 0; }
        }

        /* ── 2. CLOUDS THEME ANIMATIONS ── */
        .cloud-mass {
          position: absolute;
          border-radius: 50%;
          filter: blur(65px);
          animation: cloudDrift linear infinite;
        }
        .cloud-mass--back {
          width: 750px;
          height: 350px;
          top: 5%;
          left: -400px;
          background: rgba(148, 163, 184, 0.09);
          animation-duration: 65s;
        }
        .cloud-mass--mid {
          width: 650px;
          height: 300px;
          top: 15%;
          left: -350px;
          background: rgba(100, 116, 139, 0.08);
          animation-duration: 48s;
          animation-delay: -12s;
        }
        .cloud-mass--fore {
          width: 550px;
          height: 250px;
          top: 30%;
          left: -300px;
          background: rgba(71, 85, 105, 0.07);
          animation-duration: 38s;
          animation-delay: -24s;
        }
        .cloud-shadow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 30%, rgba(15, 23, 42, 0.3) 0%, transparent 70%);
          animation: shadowShift 12s ease-in-out infinite alternate;
        }
        @keyframes cloudDrift {
          from { transform: translateX(-150px); }
          to   { transform: translateX(calc(100vw + 200px)); }
        }
        @keyframes shadowShift {
          0%   { opacity: 0.4; }
          100% { opacity: 0.7; }
        }

        /* ── 3. RAIN THEME ANIMATIONS ── */
        .rain-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .raindrop {
          position: absolute;
          top: -60px;
          width: 1.5px;
          height: 48px;
          background: linear-gradient(180deg, transparent, rgba(186, 230, 253, 0.65));
          border-radius: 2px;
          transform: rotate(15deg);
          animation: rainFall linear infinite;
        }
        .raindrop--light {
          width: 1px;
          height: 36px;
          background: linear-gradient(180deg, transparent, rgba(186, 230, 253, 0.4));
        }
        .raindrop--heavy {
          width: 2px;
          height: 60px;
          background: linear-gradient(180deg, transparent, rgba(224, 242, 254, 0.8));
          transform: rotate(20deg);
        }
        @keyframes rainFall {
          0%   { transform: translateY(-50px) rotate(15deg); opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(15deg); opacity: 0.3; }
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(186, 230, 253, 0.3);
          transform: scale(0);
          animation: rippleExpand 4s ease-out infinite;
        }
        .ripple--1 { width: 90px; height: 35px; bottom: 8%; left: 20%; animation-delay: 0.4s; }
        .ripple--2 { width: 120px; height: 45px; bottom: 18%; right: 25%; animation-delay: 1.8s; }
        .ripple--3 { width: 80px; height: 30px; bottom: 12%; left: 60%; animation-delay: 3.1s; }
        @keyframes rippleExpand {
          0%   { transform: scale(0.1); opacity: 0.8; }
          70%  { opacity: 0.25; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        /* ── 4. THUNDERSTORM THEME ANIMATIONS ── */
        .lightning-flash {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 60% 20%, rgba(248, 250, 252, 0.4) 0%, rgba(199, 210, 254, 0.15) 50%, transparent 80%);
          opacity: 0;
          animation: lightningCycle 9s ease-out infinite;
        }
        @keyframes lightningCycle {
          0%, 88%, 91%, 95%, 100% { opacity: 0; }
          89%  { opacity: 0.85; }
          90%  { opacity: 0.15; }
          93%  { opacity: 0.95; }
          94%  { opacity: 0.3; }
        }
        .storm-cloud--1 {
          position: absolute;
          width: 800px;
          height: 380px;
          top: -50px;
          left: -100px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.6);
          filter: blur(70px);
          animation: stormPulse 6s ease-in-out infinite alternate;
        }
        .storm-cloud--2 {
          position: absolute;
          width: 700px;
          height: 320px;
          top: 10px;
          right: -80px;
          border-radius: 50%;
          background: rgba(30, 27, 75, 0.45);
          filter: blur(70px);
          animation: stormPulse 8s ease-in-out infinite alternate;
        }
        @keyframes stormPulse {
          0%   { transform: scale(1); }
          100% { transform: scale(1.08) translate(15px, 10px); }
        }

        /* ── 5. SNOW THEME ANIMATIONS ── */
        .snow-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(186, 230, 253, 0.08) 0%, transparent 65%);
        }
        .snowflake {
          position: absolute;
          top: -20px;
          border-radius: 50%;
          background: rgba(240, 249, 255, 0.85);
          box-shadow: 0 0 6px rgba(224, 242, 254, 0.9);
          animation: snowFall linear infinite;
        }
        .snowflake--size-1 { width: 3px; height: 3px; opacity: 0.6; }
        .snowflake--size-2 { width: 5px; height: 5px; opacity: 0.85; }
        .snowflake--size-3 { width: 7px; height: 7px; opacity: 0.95; filter: blur(0.5px); }
        @keyframes snowFall {
          0% {
            transform: translateY(-10px) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.9; }
          50% { transform: translateY(50vh) translateX(25px); }
          90% { opacity: 0.9; }
          100% {
            transform: translateY(105vh) translateX(-15px);
            opacity: 0.1;
          }
        }

        /* ── 6. MIST / FOG THEME ANIMATIONS ── */
        .fog-layer {
          position: absolute;
          left: -50%;
          width: 200%;
          height: 350px;
          background: linear-gradient(180deg, transparent, rgba(203, 213, 225, 0.07) 50%, transparent);
          filter: blur(45px);
          animation: fogMove ease-in-out infinite alternate;
        }
        .fog-layer--1 { top: 20%; animation-duration: 25s; }
        .fog-layer--2 { top: 45%; animation-duration: 35s; animation-delay: -10s; }
        .fog-layer--3 { top: 65%; animation-duration: 30s; animation-delay: -5s; }
        @keyframes fogMove {
          0%   { transform: translateX(-80px) scaleY(1); opacity: 0.4; }
          100% { transform: translateX(80px) scaleY(1.2); opacity: 0.8; }
        }

        /* ── ACCESSIBILITY: prefers-reduced-motion ── */
        @media (prefers-reduced-motion: reduce) {
          .anim-bg__orb,
          .sun-glow,
          .sun-beam,
          .dust-mote,
          .cloud-mass,
          .cloud-shadow,
          .raindrop,
          .ripple,
          .lightning-flash,
          .storm-cloud,
          .snowflake,
          .fog-layer {
            animation: none !important;
          }
          .raindrop, .snowflake {
            display: none !important;
          }
          .lightning-flash {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AnimatedBackground;
