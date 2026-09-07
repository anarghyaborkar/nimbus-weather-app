// src/data/ambientSounds.js
// ─────────────────────────────────────────────────────────────────────────────
// Maps normalized weather conditions to ambient sound configurations.
// Audio URLs point to free, royalty-free looping audio from Pixabay CDN.
// The `weatherCondition` keys match the output of getWeatherCondition() in
// src/utils/weatherThemes.js
// ─────────────────────────────────────────────────────────────────────────────

export const AMBIENT_SOUNDS = {
  rain: {
    label: 'Rain',
    emoji: '🌧',
    // Gentle rain loop
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_5b2e6b9b8e.mp3',
    volume: 0.45,
  },
  thunderstorm: {
    label: 'Storm',
    emoji: '⛈',
    // Thunder and rain ambience
    url: 'https://cdn.pixabay.com/audio/2022/05/13/audio_afc8dc2bca.mp3',
    volume: 0.4,
  },
  snow: {
    label: 'Winter Wind',
    emoji: '❄',
    // Soft winter wind
    url: 'https://cdn.pixabay.com/audio/2022/03/24/audio_5b2e6b9b8e.mp3',
    volume: 0.25,
  },
  mist: {
    label: 'Morning Mist',
    emoji: '🌫',
    // Calm forest ambience
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749d01c.mp3',
    volume: 0.3,
  },
  clouds: {
    label: 'Gentle Breeze',
    emoji: '☁',
    // Light wind through trees
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749d01c.mp3',
    volume: 0.2,
  },
  clear: {
    label: 'Birdsong',
    emoji: '☀',
    // Birds and nature
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749d01c.mp3',
    volume: 0.3,
  },
};

/** Returns the sound config for a given condition, or null if none found */
export function getSoundForCondition(condition) {
  return AMBIENT_SOUNDS[condition] || null;
}
