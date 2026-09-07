// src/utils/weatherThemes.js
// ─────────────────────────────────────────────────────────────────────────────
// Maps weather condition strings and OpenWeather icon codes to an atmospheric
// weather state for the immersive animated background and card effects.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalized weather themes supported by Nimbus:
 * - 'clear'        (Sun / warm sunlight, dust motes)
 * - 'clouds'       (Drifting clouds, atmospheric shadows)
 * - 'rain'         (Falling rain streaks, droplet ripples)
 * - 'thunderstorm' (Dark tempest, distant lightning flashes)
 * - 'snow'         (Floating snowflakes, frost accumulation)
 * - 'mist'         (Rolling foggy layers, translucent haze)
 */

export function getWeatherCondition(weather) {
  if (!weather) return 'clear';

  const desc = (weather.description || '').toLowerCase();
  const icon = (weather.icon || '').toLowerCase();

  // Check Thunderstorm (icon 11d/11n or description)
  if (icon.startsWith('11') || desc.includes('thunder') || desc.includes('storm') || desc.includes('lightning')) {
    return 'thunderstorm';
  }

  // Check Snow (icon 13d/13n or description)
  if (icon.startsWith('13') || desc.includes('snow') || desc.includes('sleet') || desc.includes('blizzard') || desc.includes('flurr')) {
    return 'snow';
  }

  // Check Rain / Drizzle (icons 09, 10 or description)
  if (
    icon.startsWith('09') ||
    icon.startsWith('10') ||
    desc.includes('rain') ||
    desc.includes('drizzle') ||
    desc.includes('shower')
  ) {
    return 'rain';
  }

  // Check Mist / Fog / Haze / Smoke / Dust / Sand (icon 50d/50n or description)
  if (
    icon.startsWith('50') ||
    desc.includes('mist') ||
    desc.includes('fog') ||
    desc.includes('haze') ||
    desc.includes('smoke') ||
    desc.includes('dust') ||
    desc.includes('sand')
  ) {
    return 'mist';
  }

  // Check Clouds (icons 02, 03, 04 or description)
  if (
    icon.startsWith('02') ||
    icon.startsWith('03') ||
    icon.startsWith('04') ||
    desc.includes('cloud') ||
    desc.includes('overcast')
  ) {
    return 'clouds';
  }

  // Check Clear (icon 01 or description)
  if (icon.startsWith('01') || desc.includes('clear') || desc.includes('sun')) {
    return 'clear';
  }

  return 'clear';
}
