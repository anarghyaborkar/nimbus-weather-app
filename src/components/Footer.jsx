// src/components/Footer.jsx
// Minimal, quiet attribution footer.

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <p className="footer__text">
          Nimbus · {year} · Weather data via OpenWeather
        </p>
      </div>

      <style>{`
        .footer {
          margin-top: auto;
          padding: var(--space-xl) var(--space-md) var(--space-lg);
          border-top: 1px solid var(--border-subtle);
          text-align: center;
        }
        .footer__inner {
          max-width: 980px;
          margin: 0 auto;
        }
        .footer__text {
          font-size: 0.75rem;
          color: var(--text-quaternary);
          letter-spacing: -0.005em;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
