// src/components/SearchBar.jsx
// Minimalist, command-bar inspired search input (Linear / Raycast / Arc style).

import { useState } from 'react';

function SearchBar({ onSearch, onDetectLocation, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <div className="search-wrap">
      <form className="search-form" role="search" onSubmit={handleSubmit}>
        <div className="search-box">
          <svg
            className="search-icon"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            id="city-search"
            className="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or location…"
            aria-label="Search city"
            disabled={isLoading}
          />

          <button
            type="submit"
            className="search-submit"
            aria-label="Search"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? '…' : 'Search'}
          </button>
        </div>
      </form>

      {onDetectLocation && (
        <button
          type="button"
          className="location-pill"
          onClick={onDetectLocation}
          disabled={isLoading}
          aria-label="Detect current location"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
          <span>Use my location</span>
        </button>
      )}

      <style>{`
        .search-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-xs);
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
        }
        .search-form {
          width: 100%;
        }
        .search-box {
          display: flex;
          align-items: center;
          gap: var(--space-xs);
          padding: 8px 10px 8px 14px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid var(--border-subtle);
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          transition: border-color var(--trans-fast), background var(--trans-fast), box-shadow var(--trans-fast);
        }
        .search-box:focus-within {
          background: rgba(255, 255, 255, 0.055);
          border-color: var(--border-focus);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
        }
        .search-icon {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }
        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          color: var(--text-primary);
          letter-spacing: -0.01em;
        }
        .search-input::placeholder {
          color: var(--text-quaternary);
        }
        .search-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .search-submit {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
          font-size: 0.8125rem;
          font-weight: 500;
          transition: background var(--trans-fast), color var(--trans-fast), border-color var(--trans-fast);
        }
        .search-submit:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.14);
          color: var(--text-hero);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .search-submit:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .location-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          color: var(--text-tertiary);
          font-size: 0.75rem;
          font-weight: 400;
          transition: color var(--trans-fast);
        }
        .location-pill:hover:not(:disabled) {
          color: var(--text-secondary);
        }
        .location-pill:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default SearchBar;
