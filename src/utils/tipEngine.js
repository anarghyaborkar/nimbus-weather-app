// src/utils/tipEngine.js
// ─────────────────────────────────────────────────────────────────────────────
// Intelligent Smart Tips Engine
// Generates prioritized, contextual suggestions locally from real-time weather data
// using multi-variable evaluation (temperature, humidity, wind, visibility, conditions).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluates weather metrics and returns 2–3 contextual, actionable tips.
 *
 * @param {object|null} weather - Current weather data object
 * @returns {Array<{ id: string, icon: string, title: string, text: string }>}
 */
export function generateSmartTips(weather) {
  if (!weather) {
    return [
      {
        id: 'default-1',
        icon: '🌤',
        title: 'Checking Conditions',
        text: 'Fetching local weather to formulate daily recommendations.',
      },
    ];
  }

  const temp = typeof weather.temperature === 'number' ? weather.temperature : 20;
  const feelsLike = typeof weather.feelsLike === 'number' ? weather.feelsLike : temp;
  const humidity = typeof weather.humidity === 'number' ? weather.humidity : 50;
  const wind = typeof weather.windSpeed === 'number' ? weather.windSpeed : 0;
  const visibility = typeof weather.visibility === 'number' ? weather.visibility : 10;
  const desc = (weather.description || '').toLowerCase();
  const icon = (weather.icon || '').toLowerCase();

  const candidates = [];

  // 1. Severe / Storm conditions (Highest priority: rank 100)
  if (
    icon.startsWith('11') ||
    desc.includes('thunder') ||
    desc.includes('storm') ||
    desc.includes('tornado') ||
    desc.includes('squall')
  ) {
    candidates.push({
      priority: 100,
      id: 'storm',
      icon: '⛈',
      title: 'Thunderstorm Active',
      text: 'Thunderstorm in the area. Stay indoors and avoid unnecessary travel.',
    });
  }

  // 2. Heavy Rain / Rain conditions (Priority: 90)
  if (
    icon.startsWith('09') ||
    icon.startsWith('10') ||
    desc.includes('rain') ||
    desc.includes('drizzle') ||
    desc.includes('shower')
  ) {
    const isHeavy = desc.includes('heavy') || desc.includes('extreme');
    candidates.push({
      priority: 90,
      id: 'rain',
      icon: '🌧',
      title: isHeavy ? 'Heavy Rain' : 'Precipitation Expected',
      text: isHeavy
        ? 'Heavy rainfall underway. Carry a sturdy umbrella and watch for slippery roads.'
        : 'Light rain or showers present. An umbrella or waterproof jacket is recommended.',
    });
  }

  // 3. Snow / Freezing conditions (Priority: 85)
  if (
    icon.startsWith('13') ||
    desc.includes('snow') ||
    desc.includes('sleet') ||
    desc.includes('blizzard') ||
    temp <= 0
  ) {
    candidates.push({
      priority: 85,
      id: 'snow',
      icon: '❄',
      title: temp <= 0 ? 'Freezing Temperatures' : 'Snowfall',
      text: 'Sub-zero or snowy conditions. Dress in thermal layers and watch for icy walkways.',
    });
  }

  // 4. Low Visibility / Fog / Mist (Priority: 80)
  if (
    visibility < 3 ||
    icon.startsWith('50') ||
    desc.includes('fog') ||
    desc.includes('mist') ||
    desc.includes('haze') ||
    desc.includes('smoke')
  ) {
    candidates.push({
      priority: 80,
      id: 'visibility',
      icon: '🌫',
      title: 'Reduced Visibility',
      text: `Visibility is reduced to ${visibility} km. Drive with low beams and allow extra travel distance.`,
    });
  }

  // 5. High Wind conditions (Priority: 75)
  if (wind >= 10.8) {
    // 10.8 m/s ≈ 39 km/h (Strong breeze)
    candidates.push({
      priority: 75,
      id: 'wind-strong',
      icon: '💨',
      title: 'Strong Winds',
      text: `Gusts up to ${wind} m/s. Secure lightweight patio items and loose outdoor belongings.`,
    });
  } else if (wind >= 7.5) {
    candidates.push({
      priority: 50,
      id: 'wind-moderate',
      icon: '🍃',
      title: 'Breezy Weather',
      text: `Noticeable breeze at ${wind} m/s. A windbreaker will keep you comfortable.`,
    });
  }

  // 6. Extreme Heat / High UV risk (Priority: 70)
  if (temp >= 32 || feelsLike >= 35) {
    candidates.push({
      priority: 70,
      id: 'heat',
      icon: '☀️',
      title: 'Intense Heat',
      text: `It feels like ${feelsLike}°C. Stay well hydrated, seek shade, and apply high-SPF sunscreen midday.`,
    });
  } else if (temp >= 26) {
    // Warm / Sunny day
    if (desc.includes('clear') || icon.startsWith('01')) {
      candidates.push({
        priority: 55,
        id: 'sun-uv',
        icon: '🧴',
        title: 'Sun Protection',
        text: 'Clear skies with elevated UV levels. Sunglasses and sunscreen recommended for prolonged outdoor exposure.',
      });
    }
  }

  // 7. Chilly / Cold conditions (Priority: 65)
  if (temp > 0 && temp <= 10) {
    candidates.push({
      priority: 65,
      id: 'cold',
      icon: '🧥',
      title: 'Chilly Weather',
      text: `Temperatures near ${temp}°C. Wear a warm jacket and an extra layer if outdoors.`,
    });
  } else if (temp > 10 && temp <= 16) {
    candidates.push({
      priority: 45,
      id: 'cool',
      icon: '🧣',
      title: 'Cool Conditions',
      text: 'Crisp air outdoors. A light sweater or cardigan is ideal for today.',
    });
  }

  // 8. High Humidity combined with Warmth (Priority: 60)
  if (humidity >= 75 && temp >= 22) {
    candidates.push({
      priority: 60,
      id: 'humidity-high',
      icon: '💧',
      title: 'High Humidity',
      text: `Humidity is at ${humidity}%. The air will feel heavier and warmer than the thermometer indicates.`,
    });
  } else if (humidity <= 25 && temp >= 15) {
    candidates.push({
      priority: 45,
      id: 'humidity-low',
      icon: '🥤',
      title: 'Dry Air',
      text: `Low relative humidity (${humidity}%). Keep moisturized and drink plenty of water.`,
    });
  }

  // 9. Ideal / Comfortable weather fallback
  if (temp >= 18 && temp <= 25 && wind < 6 && humidity < 70 && !desc.includes('rain')) {
    candidates.push({
      priority: 30,
      id: 'mild',
      icon: '🌿',
      title: 'Pleasant Outdoor Weather',
      text: 'Optimal ambient temperature with gentle conditions. Excellent time for a walk or outdoor exercise.',
    });
  }

  // Sort by priority descending and slice the top 2-3 most relevant insights
  candidates.sort((a, b) => b.priority - a.priority);

  const selected = candidates.slice(0, 3);

  // Fallback guarantee: if conditions are exceptionally quiet
  if (selected.length === 0) {
    selected.push({
      id: 'calm',
      icon: '✨',
      title: 'Mild Atmosphere',
      text: 'Current conditions are calm and steady throughout the area.',
    });
  }

  return selected;
}
