// src/hooks/useForecast.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom React hook for fetching and managing 5-day forecast state.
// Logically separated from current weather so that a forecast error or delay
// never crashes or blocks current weather display.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from 'react';
import {
  fetchForecastByCity,
  fetchForecastByCoordinates,
} from '../services/weatherAPI';

/**
 * Hook to manage forecast data, loading, and error states.
 */
export function useForecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch forecast for a city
  const getForecastForCity = useCallback(async (city) => {
    if (!city || !city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchForecastByCity(city);
      setForecast(data);
    } catch (err) {
      setError(err.message || 'Failed to load 5-day forecast.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch forecast for coordinates
  const getForecastForCoordinates = useCallback(async (lat, lon) => {
    if (lat === undefined || lon === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchForecastByCoordinates(lat, lon);
      setForecast(data);
    } catch (err) {
      setError(err.message || 'Failed to load 5-day forecast for your location.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    forecast,
    loading,
    error,
    getForecastForCity,
    getForecastForCoordinates,
  };
}
