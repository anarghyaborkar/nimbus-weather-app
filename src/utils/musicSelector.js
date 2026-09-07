// src/utils/musicSelector.js
// ─────────────────────────────────────────────────────────────────────────────
// Selection engine for Spotify Weather Playlists.
// Maps weather conditions to music categories, prevents immediate repeats,
// and constructs safe encoded Spotify search URLs.
// ─────────────────────────────────────────────────────────────────────────────

import {
  MUSIC_RECOMMENDATIONS,
  FALLBACK_RECOMMENDATION,
} from '../data/musicRecommendations';

/**
 * Maps a weather data object to the most appropriate music category.
 *
 * @param {object|null} weather
 * @returns {string} One of: 'Rain', 'Thunderstorm', 'Snow', 'Fog', 'Wind', 'Hot', 'Cold', 'Clouds', 'Sunny', 'Clear'
 */
export function getMusicCategory(weather) {
  if (!weather) return 'Clear';

  const desc = (weather.description || '').toLowerCase();
  const icon = (weather.icon || '').toLowerCase();
  const temp = typeof weather.temperature === 'number' ? weather.temperature : 20;
  const wind = typeof weather.windSpeed === 'number' ? weather.windSpeed : 0;
  const visibility = typeof weather.visibility === 'number' ? weather.visibility : 10;

  // Thunderstorm
  if (icon.startsWith('11') || desc.includes('thunder') || desc.includes('storm')) {
    return 'Thunderstorm';
  }

  // Snow / Freezing
  if (icon.startsWith('13') || desc.includes('snow') || desc.includes('sleet')) {
    return 'Snow';
  }

  // Rain / Drizzle / Showers
  if (
    icon.startsWith('09') ||
    icon.startsWith('10') ||
    desc.includes('rain') ||
    desc.includes('drizzle') ||
    desc.includes('shower')
  ) {
    return 'Rain';
  }

  // Fog / Mist / Low visibility
  if (visibility < 4 || icon.startsWith('50') || desc.includes('fog') || desc.includes('mist')) {
    return 'Fog';
  }

  // High Wind
  if (wind >= 9) {
    return 'Wind';
  }

  // Extreme Cold
  if (temp <= 8) {
    return 'Cold';
  }

  // Extreme Heat
  if (temp >= 29) {
    return 'Hot';
  }

  // Clouds / Overcast
  if (
    icon.startsWith('02') ||
    icon.startsWith('03') ||
    icon.startsWith('04') ||
    desc.includes('cloud') ||
    desc.includes('overcast')
  ) {
    return 'Clouds';
  }

  // Sunny / Clear
  if (icon.startsWith('01') || desc.includes('sun') || desc.includes('clear')) {
    return 'Sunny';
  }

  return 'Clear';
}

/**
 * Builds a valid, safe Spotify search URL.
 * Format: https://open.spotify.com/search/{encoded query}
 *
 * @param {string} query
 * @returns {string}
 */
export function buildSpotifyUrl(query) {
  if (!query) return 'https://open.spotify.com';
  return `https://open.spotify.com/search/${encodeURIComponent(query.trim())}`;
}

/**
 * Selects a playlist recommendation matching the weather, avoiding immediate repeats.
 *
 * @param {object|null} weather
 * @param {string|null} currentRecommendationId
 * @returns {object}
 */
export function selectMusicRecommendation(weather, currentRecommendationId = null) {
  const category = getMusicCategory(weather);

  // Filter recommendations matching the primary category
  let matches = MUSIC_RECOMMENDATIONS.filter(
    (item) => item.weather.toLowerCase() === category.toLowerCase() && item.id !== currentRecommendationId
  );

  // If none found after excluding current ID (e.g. only 1 item in cat), allow current ID
  if (matches.length === 0) {
    matches = MUSIC_RECOMMENDATIONS.filter(
      (item) => item.weather.toLowerCase() === category.toLowerCase()
    );
  }

  // Graceful fallback if category has no entries
  if (matches.length === 0) {
    return FALLBACK_RECOMMENDATION;
  }

  const randomIndex = Math.floor(Math.random() * matches.length);
  return matches[randomIndex] || FALLBACK_RECOMMENDATION;
}
