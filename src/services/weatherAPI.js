// src/services/weatherAPI.js
// ─────────────────────────────────────────────────────────────────────────────
// Service module responsible for HTTP communication with our Express backend.
// Notice:
// 1. The React app never talks directly to OpenWeatherMap or touches any API keys.
// 2. The backend base URL is centralized here in one place.
// ─────────────────────────────────────────────────────────────────────────────

const BACKEND_BASE_URL = 'http://localhost:5000/api';

/**
 * Internal helper to send requests to backend and handle connection/HTTP errors.
 */
async function sendRequest(endpoint) {
  let response;
  try {
    response = await fetch(`${BACKEND_BASE_URL}${endpoint}`);
  } catch (networkError) {
    throw new Error(
      'Unable to connect to the weather server. Please make sure the backend is running on http://localhost:5000.'
    );
  }

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    const errorMessage =
      result?.error ||
      `Request failed with status ${response.status} (${response.statusText})`;
    throw new Error(errorMessage);
  }

  return result.data;
}

/**
 * Fetches current weather for a given city from our Express server.
 *
 * @param {string} city - The city name to search for (e.g. "London")
 * @returns {Promise<object>} The normalized weather object
 */
export async function fetchWeatherByCity(city) {
  if (!city || !city.trim()) {
    throw new Error('Please provide a city name.');
  }

  return sendRequest(`/weather?city=${encodeURIComponent(city.trim())}`);
}

/**
 * Fetches current weather for given latitude and longitude coordinates.
 *
 * @param {number|string} lat - Latitude (-90 to 90)
 * @param {number|string} lon - Longitude (-180 to 180)
 * @returns {Promise<object>} The normalized weather object
 */
export async function fetchWeatherByCoordinates(lat, lon) {
  if (lat === undefined || lon === undefined || lat === '' || lon === '') {
    throw new Error('Coordinates are required.');
  }

  return sendRequest(`/weather/coordinates?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
}

/**
 * Fetches 5-day weather forecast for a given city from our Express server.
 *
 * @param {string} city - The city name to search for (e.g. "London")
 * @returns {Promise<object>} The normalized forecast object with daily entries
 */
export async function fetchForecastByCity(city) {
  if (!city || !city.trim()) {
    throw new Error('Please provide a city name.');
  }

  return sendRequest(`/weather/forecast?city=${encodeURIComponent(city.trim())}`);
}

/**
 * Fetches 5-day weather forecast for given latitude and longitude coordinates.
 *
 * @param {number|string} lat - Latitude (-90 to 90)
 * @param {number|string} lon - Longitude (-180 to 180)
 * @returns {Promise<object>} The normalized forecast object with daily entries
 */
export async function fetchForecastByCoordinates(lat, lon) {
  if (lat === undefined || lon === undefined || lat === '' || lon === '') {
    throw new Error('Coordinates are required.');
  }

  return sendRequest(`/weather/forecast/coordinates?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
}

// Backward compatibility alias
export const fetchWeather = fetchWeatherByCity;
