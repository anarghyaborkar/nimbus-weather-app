// src/components/SearchBar.jsx
// City search input — will eventually call the weather API to look up a location.

function SearchBar() {
  return (
    <div className="searchbar" role="search">
      <div className="searchbar__container glass">
        <span className="searchbar__icon" aria-hidden="true">🔍</span>
        <input
          id="city-search"
          className="searchbar__input"
          type="text"
          placeholder="Search for a city…"
          aria-label="Search for a city"
        />
        <button className="searchbar__btn" aria-label="Search">
          Search
        </button>
      </div>

      <style>{`
        .searchbar {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
        }
        .searchbar__container {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md);
          border-radius: var(--radius-full);
        }
        .searchbar__icon {
          font-size: 1rem;
          opacity: 0.6;
          flex-shrink: 0;
        }
        .searchbar__input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-sans);
          font-size: 1rem;
          color: var(--clr-text-primary);
        }
        .searchbar__input::placeholder {
          color: var(--clr-text-muted);
        }
        .searchbar__btn {
          padding: var(--space-xs) var(--space-md);
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--clr-accent-blue), var(--clr-accent-indigo));
          color: #fff;
          font-size: 0.875rem;
          font-weight: 500;
          transition: opacity var(--transition-fast), transform var(--transition-fast);
          flex-shrink: 0;
        }
        .searchbar__btn:hover {
          opacity: 0.88;
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

export default SearchBar;
