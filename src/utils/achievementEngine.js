// src/utils/achievementEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Manages achievement state in localStorage.
// Provides functions to:
//   • Record events (city searched, condition viewed, journal saved, etc.)
//   • Check which achievements are newly unlocked
//   • Read the full achievement state for rendering
// ─────────────────────────────────────────────────────────────────────────────

import { ACHIEVEMENTS } from '../data/achievements';

const STORAGE_KEY = 'nimbus:achievement_state';

// ── State management ──────────────────────────────────────────────────────────

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently ignore storage errors (private browsing, quota exceeded)
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Records a single event into the persistent achievement state.
 * Returns an array of achievement IDs that were newly unlocked by this event.
 *
 * @param {string} conditionKey  - The key to update (e.g. 'citiesSearched')
 * @param {any}    value         - The new value (number to add, or boolean to set true)
 */
export function recordEvent(conditionKey, value) {
  const state = loadState();

  // For numeric conditions: accumulate
  if (typeof value === 'number') {
    state[conditionKey] = (state[conditionKey] || 0) + value;
  } else {
    // For boolean conditions: set once
    state[conditionKey] = value;
  }

  // Determine which achievements unlock now
  const alreadyUnlocked = new Set(state.__unlocked || []);
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(ach.id)) continue; // Already unlocked

    let unlocked = false;
    const current = state[ach.conditionKey];

    if (typeof ach.conditionValue === 'boolean') {
      unlocked = current === true;
    } else if (typeof ach.conditionValue === 'number') {
      unlocked = (current || 0) >= ach.conditionValue;
    }

    if (unlocked) {
      alreadyUnlocked.add(ach.id);
      newlyUnlocked.push(ach.id);
    }
  }

  state.__unlocked = [...alreadyUnlocked];
  saveState(state);

  return newlyUnlocked;
}

/**
 * Returns the full set of unlocked achievement IDs.
 * @returns {Set<string>}
 */
export function getUnlockedIds() {
  const state = loadState();
  return new Set(state.__unlocked || []);
}

/**
 * Reads the current numeric value for a condition key.
 * @param {string} key
 * @returns {number|boolean}
 */
export function getConditionValue(key) {
  const state = loadState();
  return state[key];
}

/**
 * Returns the full achievement list with `unlocked` boolean on each.
 */
export function getAchievementsWithStatus() {
  const unlockedIds = getUnlockedIds();
  return ACHIEVEMENTS.map((ach) => ({
    ...ach,
    unlocked: unlockedIds.has(ach.id),
  }));
}

/**
 * Record a city search. Also records time-of-day achievements.
 * @param {string} city
 * @param {boolean} isLocationBased
 */
export function recordCitySearch(city, isLocationBased = false) {
  const newlyUnlocked = [];

  // Count unique cities
  newlyUnlocked.push(...recordEvent('citiesSearched', 1));

  if (isLocationBased) {
    newlyUnlocked.push(...recordEvent('usedLocation', true));
  }

  // Time-of-day achievements
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 4) {
    newlyUnlocked.push(...recordEvent('checkedAtNight', true));
  }
  if (hour >= 4 && hour < 6) {
    newlyUnlocked.push(...recordEvent('checkedAtDawn', true));
  }

  return newlyUnlocked;
}

/**
 * Record weather condition viewing.
 * @param {string} condition - normalized condition from getWeatherCondition()
 * @param {number} temperature - in Celsius
 */
export function recordWeatherView(condition, temperature) {
  const newlyUnlocked = [];

  if (condition === 'thunderstorm') {
    newlyUnlocked.push(...recordEvent('viewedThunderstorm', true));
  }
  if (condition === 'snow') {
    newlyUnlocked.push(...recordEvent('viewedSnow', true));
  }
  if (typeof temperature === 'number' && temperature > 35) {
    newlyUnlocked.push(...recordEvent('viewedHeatWave', true));
  }

  return newlyUnlocked;
}
