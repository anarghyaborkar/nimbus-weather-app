// src/utils/factSelector.js
// ─────────────────────────────────────────────────────────────────────────────
// Selection engine for the "Did You Know?" module.
// Prioritizes facts matching the user's active weather conditions while
// preventing consecutive duplicates and gracefully falling back to diverse facts.
// ─────────────────────────────────────────────────────────────────────────────

import { WEATHER_FACTS } from '../data/weatherFactsData';

/**
 * Maps a weather data object to prioritized fact categories.
 *
 * @param {object|null} weather
 * @returns {string[]} Array of prioritized category names
 */
export function getPrioritizedCategories(weather) {
  if (!weather) {
    return ['Climate', 'Atmosphere', 'Space & Earth'];
  }

  const desc = (weather.description || '').toLowerCase();
  const icon = (weather.icon || '').toLowerCase();
  const temp = typeof weather.temperature === 'number' ? weather.temperature : 20;
  const wind = typeof weather.windSpeed === 'number' ? weather.windSpeed : 0;
  const visibility = typeof weather.visibility === 'number' ? weather.visibility : 10;

  const categories = [];

  // Storms / Thunder
  if (icon.startsWith('11') || desc.includes('thunder') || desc.includes('storm')) {
    categories.push('Thunderstorm', 'Rain', 'Atmosphere');
  }

  // Snow / Freezing
  if (icon.startsWith('13') || desc.includes('snow') || desc.includes('sleet') || temp <= 0) {
    categories.push('Snow', 'Cold', 'Atmosphere');
  }

  // Rain / Drizzle / Showers / Monsoons
  if (
    icon.startsWith('09') ||
    icon.startsWith('10') ||
    desc.includes('rain') ||
    desc.includes('drizzle') ||
    desc.includes('shower')
  ) {
    categories.push('Rain', 'Clouds', 'Monsoons');
  }

  // Fog / Mist / Reduced visibility
  if (visibility < 4 || icon.startsWith('50') || desc.includes('fog') || desc.includes('mist')) {
    categories.push('Fog', 'Atmosphere', 'Clouds');
  }

  // Strong wind
  if (wind >= 7.5) {
    categories.push('Wind', 'Atmosphere', 'Oceans');
  }

  // Extreme Heat / Warmth
  if (temp >= 28) {
    categories.push('Heat', 'Clear Sky', 'Seasons');
  }

  // Cold
  if (temp > 0 && temp <= 10) {
    categories.push('Cold', 'Atmosphere', 'Seasons');
  }

  // Overcast / Clouds
  if (icon.startsWith('02') || icon.startsWith('03') || icon.startsWith('04') || desc.includes('cloud')) {
    categories.push('Clouds', 'Atmosphere', 'Rain');
  }

  // Clear Sky
  if (icon.startsWith('01') || desc.includes('clear')) {
    categories.push('Clear Sky', 'Space & Earth', 'Atmosphere');
  }

  // Add general fallback categories
  categories.push('Climate', 'Atmosphere', 'Oceans', 'Space & Earth', 'Seasons');

  // Deduplicate while preserving priority order
  return [...new Set(categories)];
}

/**
 * Selects a fact relevant to the current weather, ensuring it differs from the last fact shown.
 *
 * @param {object|null} weather
 * @param {string|null} lastFactId - ID of currently displayed fact to avoid consecutive repeats
 * @returns {object} Selected fact object
 */
export function selectNextFact(weather, lastFactId = null) {
  const categories = getPrioritizedCategories(weather);

  // 1. Gather all facts matching prioritized categories
  let candidates = [];
  for (const cat of categories) {
    const matched = WEATHER_FACTS.filter((f) => f.category === cat && f.id !== lastFactId);
    if (matched.length > 0) {
      candidates = candidates.concat(matched);
      // Give top 2 categories strong preference
      if (candidates.length >= 8) break;
    }
  }

  // 2. If candidates are sparse, fallback to all facts excluding the current one
  if (candidates.length === 0) {
    candidates = WEATHER_FACTS.filter((f) => f.id !== lastFactId);
  }

  // Pick a random fact from candidates
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] || WEATHER_FACTS[0];
}
