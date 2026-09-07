// src/components/Footer.jsx
// Simple footer with attribution and secondary links.

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <p className="footer__copy">
        © {year} <span className="footer__brand">Nimbus</span> — Weather, beautifully presented.
      </p>
      <p className="footer__attr">
        Weather data powered by OpenWeatherMap · Built with React & Vite
      </p>

      <style>{`
        .footer {
          margin-top: auto;
          padding: var(--space-xl) var(--space-xl);
          text-align: center;
          border-top: 1px solid var(--clr-glass-border);
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }
        .footer__copy {
          font-size: 0.9375rem;
          color: var(--clr-text-secondary);
        }
        .footer__brand {
          font-weight: 700;
          background: linear-gradient(135deg, var(--clr-accent-blue), var(--clr-accent-indigo));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .footer__attr {
          font-size: 0.8125rem;
          color: var(--clr-text-muted);
        }
      `}</style>
    </footer>
  );
}

export default Footer;
