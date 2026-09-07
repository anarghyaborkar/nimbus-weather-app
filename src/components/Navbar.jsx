// src/components/Navbar.jsx
// Top navigation bar — displays the app logo/brand and primary nav actions.

function Navbar() {
  return (
    <nav className="navbar glass" role="navigation" aria-label="Main navigation">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden="true">☁️</span>
        <span className="navbar__name">Nimbus</span>
      </div>

      <div className="navbar__actions">
        <button className="navbar__btn" aria-label="Toggle temperature unit">
          °C / °F
        </button>
        <button className="navbar__btn" aria-label="Settings">
          ⚙
        </button>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md) var(--space-xl);
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
        }
        .navbar__brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .navbar__logo {
          font-size: 1.5rem;
        }
        .navbar__name {
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, var(--clr-accent-blue), var(--clr-accent-indigo));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .navbar__actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .navbar__btn {
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          background: var(--clr-glass-bg);
          border: 1px solid var(--clr-glass-border);
          color: var(--clr-text-secondary);
          font-size: 0.875rem;
          transition: background var(--transition-fast), color var(--transition-fast);
        }
        .navbar__btn:hover {
          background: var(--clr-glass-hover);
          color: var(--clr-text-primary);
        }
      `}</style>
    </nav>
  );
}

export default Navbar;
