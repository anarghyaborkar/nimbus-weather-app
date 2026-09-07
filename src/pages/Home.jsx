// src/pages/Home.jsx
// The main landing page for Nimbus.
// Composes all UI components into a single cohesive layout.
// Later steps will add state management (weather data, search results, etc.)

import AnimatedBackground from '../components/AnimatedBackground';
import Navbar            from '../components/Navbar';
import SearchBar         from '../components/SearchBar';
import WeatherCard       from '../components/WeatherCard';
import ForecastSection   from '../components/ForecastSection';
import WeatherFacts      from '../components/WeatherFacts';
import SmartTips         from '../components/SmartTips';
import SpotifyCard       from '../components/SpotifyCard';
import Footer            from '../components/Footer';

function Home() {
  return (
    <>
      {/* Fixed atmospheric background — sits behind everything */}
      <AnimatedBackground />

      {/* Sticky top navigation */}
      <Navbar />

      {/* Scrollable page content */}
      <main className="home-main" role="main">
        {/* Hero section — search + headline */}
        <section className="home-hero" aria-label="Search weather">
          <h1 className="home-hero__heading">
            Your weather,{' '}
            <span className="gradient-text">beautifully clear.</span>
          </h1>
          <p className="home-hero__sub">
            Search for any city and get real-time weather with smart insights.
          </p>
          <SearchBar />
        </section>

        {/* Primary weather information */}
        <section className="home-weather" aria-label="Weather overview">
          <WeatherCard />
          <ForecastSection />
        </section>

        {/* Secondary information row */}
        <section className="home-insights" aria-label="Weather insights">
          <div className="home-insights__left">
            <WeatherFacts />
          </div>
          <div className="home-insights__right">
            <SmartTips />
            <SpotifyCard />
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        .home-main {
          position: relative;
          z-index: 1;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--space-3xl);
          padding: var(--space-3xl) var(--space-xl);
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        /* ── Hero ── */
        .home-hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-lg);
          text-align: center;
          padding-top: var(--space-2xl);
        }
        .home-hero__heading {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.15;
        }
        .home-hero__sub {
          font-size: 1.125rem;
          color: var(--clr-text-secondary);
          max-width: 420px;
        }

        /* ── Primary weather row ── */
        .home-weather {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        /* ── Insights row ── */
        .home-insights {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: var(--space-xl);
          align-items: start;
        }
        .home-insights__right {
          display: flex;
          flex-direction: column;
          gap: var(--space-xl);
        }

        @media (max-width: 960px) {
          .home-insights {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .home-main {
            padding: var(--space-xl) var(--space-md);
            gap: var(--space-2xl);
          }
        }
      `}</style>
    </>
  );
}

export default Home;
