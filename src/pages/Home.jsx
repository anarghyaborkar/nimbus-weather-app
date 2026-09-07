// src/pages/Home.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Main view for Nimbus — wires all features together.
//
// Feature inventory:
//   Phase 1  AnimatedBackground (weather-reactive scenes)
//   Phase 2  Premium UI (design system)
//   Phase 3  SmartTips (local tip engine)
//   Phase 4  WeatherFacts (Did You Know? 100+ facts)
//   Phase 5  SpotifyCard (music recommendations)
//   Phase 6  SunriseSunsetCard (animated SVG arc)
//   Phase 7  Day/Night transitions (dayPhase → AnimatedBackground)
//   Phase 8  ShareCard (PNG download modal)
//   Phase 9  Micro-interactions (count-up temp, staggered forecast)
//   Phase 10 AmbientPlayer (weather sounds, in Navbar)
//   Phase 11 WeatherJournal (localStorage diary)
//   Phase 12 AchievementsPanel (badges + achievement engine)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useCallback, useState, useMemo, Suspense, lazy } from 'react';

import AnimatedBackground    from '../components/AnimatedBackground';
import Navbar                from '../components/Navbar';
import SearchBar             from '../components/SearchBar';
import WeatherCard           from '../components/WeatherCard';
import ForecastSection       from '../components/ForecastSection';
import SmartTips             from '../components/SmartTips';
import SpotifyCard           from '../components/SpotifyCard';
import SunriseSunsetCard     from '../components/SunriseSunsetCard';
import Footer                from '../components/Footer';

import { useWeather }        from '../hooks/useWeather';
import { useForecast }       from '../hooks/useForecast';
import { getDayPhase, getWeatherCondition } from '../utils/weatherThemes';
import {
  recordCitySearch,
  recordWeatherView,
  recordEvent,
} from '../utils/achievementEngine';

// Heavy below-fold components loaded lazily (React 18+)
const WeatherFacts      = lazy(() => import('../components/WeatherFacts'));
const WeatherJournal    = lazy(() => import('../components/WeatherJournal'));
const AchievementsPanel = lazy(() => import('../components/AchievementsPanel'));
const ShareCard         = lazy(() => import('../components/ShareCard'));

// Minimal spinner for Suspense fallback
function Spinner() {
  return (
    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-quaternary)', fontSize: '0.75rem' }}>
      Loading…
    </div>
  );
}

function Home() {
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    isLocationBased,
    searchCity,
    detectLocation,
  } = useWeather('London');

  const {
    forecast,
    loading: forecastLoading,
    error: forecastError,
    getForecastForCity,
    getForecastForCoordinates,
  } = useForecast();

  // ── Feature state ──────────────────────────────────────────────────────────
  const [showShare, setShowShare]           = useState(false);
  const [newlyUnlocked, setNewlyUnlocked]   = useState([]);

  // ── Derived values ─────────────────────────────────────────────────────────
  const dayPhase  = useMemo(() => getDayPhase(weather), [weather]);
  const condition = useMemo(() => getWeatherCondition(weather), [weather]);

  // ── Achievement helper ─────────────────────────────────────────────────────
  const handleAchievement = useCallback((ids) => {
    if (ids?.length > 0) {
      setNewlyUnlocked(ids);
    }
  }, []);

  // ── Initial forecast load ──────────────────────────────────────────────────
  useEffect(() => {
    getForecastForCity('London');
  }, [getForecastForCity]);

  // ── Track weather view for achievements ───────────────────────────────────
  useEffect(() => {
    if (!weather) return;
    const ids = recordWeatherView(condition, weather.temperature);
    handleAchievement(ids);
  }, [weather, condition, handleAchievement]);

  // ── Search handler ─────────────────────────────────────────────────────────
  const handleSearch = useCallback((city) => {
    searchCity(city);
    getForecastForCity(city);
    // Achievement: city search
    const ids = recordCitySearch(city, false);
    handleAchievement(ids);
  }, [searchCity, getForecastForCity, handleAchievement]);

  // ── Location detect handler ────────────────────────────────────────────────
  const handleDetectLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getForecastForCoordinates(position.coords.latitude, position.coords.longitude);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    }
    detectLocation();
    // Achievement: used location
    const ids = recordCitySearch('', true);
    handleAchievement(ids);
  }, [detectLocation, getForecastForCoordinates, handleAchievement]);

  // ── Journal save handler ───────────────────────────────────────────────────
  const handleJournalSave = useCallback((_entryCount) => {
    const ids = recordEvent('journalEntries', 1);
    handleAchievement(ids);
  }, [handleAchievement]);

  return (
    <>
      {/* Fixed weather-reactive background */}
      <AnimatedBackground weather={weather} dayPhase={dayPhase} />

      {/* Sticky navigation bar with city clock + ambient sound */}
      <Navbar
        weather={weather}
        condition={condition}
        onAchievement={handleAchievement}
      />

      <main className="canvas" role="main" id="main-content">

        {/* ── Search section ──────────────────────────────────────────── */}
        <section className="search-section" aria-label="Search weather">
          <SearchBar
            onSearch={handleSearch}
            onDetectLocation={handleDetectLocation}
            isLoading={weatherLoading || forecastLoading}
          />
        </section>

        {/* ── Primary hero: weather + forecast ────────────────────────── */}
        <section className="primary-section" aria-label="Current conditions and forecast">
          <WeatherCard
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
            isLocationBased={isLocationBased}
            onShare={() => setShowShare(true)}
          />

          <ForecastSection
            forecast={forecast}
            loading={forecastLoading}
            error={forecastError}
          />
        </section>

        {/* ── Secondary insights row ───────────────────────────────────── */}
        <section className="secondary-section" aria-label="Weather highlights and context">
          {/* Left column */}
          <div className="secondary-column">
            <Suspense fallback={<Spinner />}>
              <WeatherFacts weather={weather} />
            </Suspense>
            <SunriseSunsetCard weather={weather} />
          </div>

          {/* Right column stacked */}
          <div className="secondary-column secondary-column--stacked">
            <SmartTips weather={weather} loading={weatherLoading} />
            <SpotifyCard weather={weather} />
          </div>
        </section>

        {/* ── Journal section ──────────────────────────────────────────── */}
        <section className="journal-section" aria-label="Weather journal and achievements">
          <Suspense fallback={<Spinner />}>
            <WeatherJournal
              weather={weather}
              onSave={handleJournalSave}
            />
          </Suspense>
        </section>

        {/* ── Achievements section ─────────────────────────────────────── */}
        <section className="ach-section" aria-label="Achievements">
          <Suspense fallback={<Spinner />}>
            <AchievementsPanel newlyUnlockedIds={newlyUnlocked} />
          </Suspense>
        </section>
      </main>

      <Footer />

      {/* ── Share card modal (lazy) ──────────────────────────────────── */}
      {showShare && (
        <Suspense fallback={null}>
          <ShareCard
            weather={weather}
            onClose={() => setShowShare(false)}
            onAchievement={handleAchievement}
          />
        </Suspense>
      )}

      <style>{`
        .canvas {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          padding: var(--space-lg) var(--space-md) var(--space-2xl);
          max-width: 880px;
          width: 100%;
          margin: 0 auto;
          animation: pageIn 0.4s var(--ease-smooth) both;
        }
        @keyframes pageIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .search-section {
          padding-top: var(--space-sm);
        }

        .primary-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
        }

        .secondary-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
          align-items: start;
        }

        .secondary-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .journal-section,
        .ach-section {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        /* ── Focus ring \u2014 visible for keyboard users, invisible for mouse ── */
        :focus-visible {
          outline: 2px solid rgba(255,255,255,0.35);
          outline-offset: 3px;
          border-radius: 4px;
        }
        :focus:not(:focus-visible) {
          outline: none;
        }

        @media (max-width: 720px) {
          .canvas {
            padding: var(--space-md) var(--space-sm) var(--space-xl);
            gap: var(--space-lg);
          }
          .secondary-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
