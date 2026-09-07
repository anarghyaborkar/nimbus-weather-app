// src/pages/Home.jsx
// Main view for Nimbus — Calm, spacious layout inspired by Apple Weather, Linear, Arc and Notion.

import { useEffect, useCallback } from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar            from '../components/Navbar';
import SearchBar         from '../components/SearchBar';
import WeatherCard       from '../components/WeatherCard';
import ForecastSection   from '../components/ForecastSection';
import WeatherFacts      from '../components/WeatherFacts';
import SmartTips         from '../components/SmartTips';
import SpotifyCard       from '../components/SpotifyCard';
import Footer            from '../components/Footer';
import { useWeather }    from '../hooks/useWeather';
import { useForecast }   from '../hooks/useForecast';

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

  useEffect(() => {
    getForecastForCity('London');
  }, [getForecastForCity]);

  const handleSearch = useCallback((city) => {
    searchCity(city);
    getForecastForCity(city);
  }, [searchCity, getForecastForCity]);

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
  }, [detectLocation, getForecastForCoordinates]);

  return (
    <>
      <AnimatedBackground weather={weather} />
      <Navbar />

      <main className="canvas" role="main">
        {/* Search header with generous breathing room */}
        <section className="search-section" aria-label="Search weather">
          <SearchBar
            onSearch={handleSearch}
            onDetectLocation={handleDetectLocation}
            isLoading={weatherLoading || forecastLoading}
          />
        </section>

        {/* Hero focal weather & 5-day outlook */}
        <section className="primary-section" aria-label="Current conditions and forecast">
          <WeatherCard
            weather={weather}
            loading={weatherLoading}
            error={weatherError}
            isLocationBased={isLocationBased}
          />

          <ForecastSection
            forecast={forecast}
            loading={forecastLoading}
            error={forecastError}
          />
        </section>

        {/* Secondary insight modules — quiet 2-column layout */}
        <section className="secondary-section" aria-label="Weather highlights and context">
          <div className="secondary-column">
            <WeatherFacts weather={weather} />
          </div>
          <div className="secondary-column secondary-column--stacked">
            <SmartTips weather={weather} loading={weatherLoading} />
            <SpotifyCard weather={weather} />
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .canvas {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
          padding: var(--space-lg) var(--space-md) var(--space-2xl);
          max-width: 860px;
          width: 100%;
          margin: 0 auto;
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

        .secondary-column--stacked {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
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
