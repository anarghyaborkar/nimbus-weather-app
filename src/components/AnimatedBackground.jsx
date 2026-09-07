// src/components/AnimatedBackground.jsx
// Renders the full-screen atmospheric background layer.
// In a future step this will react to weather conditions (rain, clouds, sun).
// Currently shows a static deep-sky gradient with subtle orbs.

function AnimatedBackground() {
  return (
    <div className="anim-bg" aria-hidden="true">
      <div className="anim-bg__orb anim-bg__orb--1" />
      <div className="anim-bg__orb anim-bg__orb--2" />
      <div className="anim-bg__orb anim-bg__orb--3" />

      <style>{`
        .anim-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          background: radial-gradient(ellipse at 50% 0%, #0f1f3d 0%, #080c14 60%);
        }
        .anim-bg__orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: orbFloat 12s ease-in-out infinite alternate;
        }
        .anim-bg__orb--1 {
          width: 500px;
          height: 500px;
          background: rgba(79, 142, 247, 0.12);
          top: -120px;
          left: -80px;
          animation-duration: 14s;
        }
        .anim-bg__orb--2 {
          width: 400px;
          height: 400px;
          background: rgba(124, 111, 247, 0.10);
          bottom: 10%;
          right: -100px;
          animation-duration: 10s;
          animation-direction: alternate-reverse;
        }
        .anim-bg__orb--3 {
          width: 300px;
          height: 300px;
          background: rgba(45, 212, 191, 0.06);
          top: 40%;
          left: 40%;
          animation-duration: 16s;
        }
        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, 40px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

export default AnimatedBackground;
