// src/hooks/useWeather.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom React hook for fetching and managing weather state.
// Encapsulates:
// - weather data
// - loading indicator
// - error messaging
// - whether the currently shown weather is from GPS/Location
// - searchCity function
// - detectLocation function
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherByCity, fetchWeatherByCoordinates } from '../services/weatherAPI';

/**
 * Hook to manage weather fetching and state.
 *
 * @param {string} initialCity - Default city to load on mount (default: 'London')
 */
export function useWeather(initialCity = 'London') {
  const [city, setCity] = useState(initialCity);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLocationBased, setIsLocationBased] = useState(false);

  // Search by city name
  const searchCity = useCallback(async (newCity) => {
    if (!newCity || !newCity.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherByCity(newCity);
      setWeather(data);
      setCity(data.city || newCity);
      setIsLocationBased(false); // Flagged as manual city search
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Detect user's location using browser's navigator.geolocation
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please search for a city instead.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      // Success callback
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const data = await fetchWeatherByCoordinates(latitude, longitude);
          setWeather(data);
          setCity(data.city || 'Your Location');
          setIsLocationBased(true); // Flagged as GPS/Location weather
        } catch (err) {
          setError(err.message || 'Failed to fetch weather for your location.');
        } finally {
          setLoading(false);
        }
      },
      // Error callback
      (geoError) => {
        setLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('Location access was denied. Search for a city instead.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Search for a city instead.');
            break;
          case geoError.TIMEOUT:
            setError('Location request timed out. Please try again or search for a city.');
            break;
          default:
            setError('An error occurred while retrieving your location. Search for a city instead.');
            break;
        }
      },
      // Geolocation options
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // cache for 5 minutes
      }
    );
  }, []);

  // Fetch initial city data when component mounts
  useEffect(() => {
    searchCity(initialCity);
  }, [initialCity, searchCity]);

  return {
    weather,
    loading,
    error,
    currentCity: city,
    isLocationBased,
    searchCity,
    detectLocation,
  };
}
