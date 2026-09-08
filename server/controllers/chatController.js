// server/controllers/chatController.js
// ─────────────────────────────────────────────────────────────────────────────
// Handles POST /api/chat for the Nimbus AI weather assistant.
//
// Flow:
//   1. Receive { message, weather } from the frontend
//   2. If GEMINI_API_KEY is set → use Gemini 2.0 Flash with a strict system prompt
//   3. Otherwise → use the local keyword-based fallback engine
//   4. Return { success: true, reply: "..." }
// ─────────────────────────────────────────────────────────────────────────────

const axios = require('axios');

// ── Gemini REST endpoint ────────────────────────────────────────────────────
const GEMINI_MODEL   = 'gemini-2.0-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ── System prompt ───────────────────────────────────────────────────────────
function buildSystemPrompt(weather) {
  const w = weather || {};
  const weatherContext = weather
    ? `Current weather data:
- City: ${w.city || 'Unknown'}, ${w.country || ''}
- Temperature: ${w.temperature ?? 'N/A'}°C (feels like ${w.feelsLike ?? 'N/A'}°C)
- Min/Max: ${w.tempMin ?? 'N/A'}°C / ${w.tempMax ?? 'N/A'}°C
- Condition: ${w.description || 'N/A'}
- Humidity: ${w.humidity ?? 'N/A'}%
- Wind speed: ${w.windSpeed ?? 'N/A'} m/s
- Visibility: ${w.visibility ?? 'N/A'} km
- Pressure: ${w.pressure ?? 'N/A'} hPa`
    : 'No weather data available for this session.';

  return `You are Nimbus — a friendly, concise, and educational weather companion.

STRICT RULES:
- You ONLY answer questions about weather, climate, clouds, rain, forecast, humidity, wind, temperature, air pressure, visibility, seasons, and related atmospheric phenomena.
- Always ground your answers in the provided weather data when relevant. Never hallucinate or invent weather readings.
- Keep answers short (2–4 sentences max), warm, and easy to understand.
- Use the user's actual weather data to personalise your answer whenever possible.
- If the user asks about anything unrelated to weather or climate, politely decline and redirect to weather topics.
- Do not use markdown headers or bullet lists — plain conversational prose only.

${weatherContext}`;
}

// ── Gemini API call ─────────────────────────────────────────────────────────
async function askGemini(message, weather) {
  const apiKey = process.env.GEMINI_API_KEY;

  const body = {
    system_instruction: {
      parts: [{ text: buildSystemPrompt(weather) }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ],
    generationConfig: {
      temperature:     0.7,
      maxOutputTokens: 256,
      topP:            0.9,
    },
  };

  const response = await axios.post(
    `${GEMINI_API_URL}?key=${apiKey}`,
    body,
    { timeout: 12000, headers: { 'Content-Type': 'application/json' } }
  );

  const candidate = response.data?.candidates?.[0];
  const text      = candidate?.content?.parts?.[0]?.text || '';

  if (!text) throw new Error('Empty response from Gemini');
  return text.trim();
}

// ── Local fallback engine ───────────────────────────────────────────────────
// Keyword → response generator. Uses actual weather data for personalised replies.
function localFallback(message, weather) {
  const msg = message.toLowerCase();
  const w   = weather || {};

  const city     = w.city        || 'your location';
  const temp     = w.temperature ?? null;
  const feels    = w.feelsLike   ?? null;
  const humidity = w.humidity    ?? null;
  const wind     = w.windSpeed   ?? null;
  const vis      = w.visibility  ?? null;
  const pressure = w.pressure    ?? null;
  const desc     = w.description || '';

  const hasRain   = /rain|drizzle|shower|thunder|storm/.test(desc);
  const hasSnow   = /snow|sleet|blizzard/.test(desc);
  const hasClouds = /cloud|overcast/.test(desc);
  const isClear   = /clear|sunny|fair/.test(desc);

  // ── Umbrella / rain ───────────────────────────────────────────────────────
  if (/umbrella|rain|shower|drizzle|wet|precipitation/.test(msg)) {
    if (hasRain) {
      return `Yes, definitely bring an umbrella! The current conditions in ${city} show ${desc}, so you'll want to stay dry. Consider a waterproof jacket too if the wind picks up.`;
    }
    if (hasClouds) {
      return `It's not raining right now in ${city}, but the clouds could bring some drizzle. I'd keep a compact umbrella handy just in case!`;
    }
    return `Looks like you're in the clear! The skies over ${city} are showing ${desc || 'fair conditions'}, so no umbrella needed for now. Enjoy the dry weather! ☀️`;
  }

  // ── Feels hotter / heat index / feels like ────────────────────────────────
  if (/feel.*(hot|warm|hotter|warmer|heat)|heat.*index|apparent|feels like/.test(msg)) {
    if (temp !== null && feels !== null) {
      const diff = feels - temp;
      if (diff > 2) {
        return `In ${city} it's ${temp}°C but feels like ${feels}°C — that's ${diff}°C warmer! High humidity (${humidity}%) traps your body heat and slows sweat evaporation, making it feel hotter than the thermometer says.`;
      } else if (diff < -2) {
        return `In ${city} it's ${temp}°C but feels like ${feels}°C — the wind is making it feel cooler. Wind chill removes heat from your skin faster, which is why it feels more intense than the actual temperature.`;
      }
      return `In ${city} the temperature is ${temp}°C and the feels-like is very close at ${feels}°C — today's conditions are quite true to the thermometer. Humidity and wind speed are in a comfortable balance.`;
    }
    return `The "feels like" temperature accounts for humidity and wind speed. High humidity makes heat feel more intense because sweat can't evaporate easily, while wind chill makes cold air feel even colder.`;
  }

  // ── Forecast ──────────────────────────────────────────────────────────────
  if (/forecast|week|tomorrow|next (few )?day|upcoming|outlook/.test(msg)) {
    return `Right now in ${city} it's ${temp ?? '—'}°C with ${desc || 'current conditions'}. For a detailed multi-day outlook, scroll up to the forecast cards — they show temperatures, conditions, and humidity for the next 5 days. 📅`;
  }

  // ── Clouds / cloudy ───────────────────────────────────────────────────────
  if (/cloud|overcast|gray|grey|sky/.test(msg)) {
    if (hasClouds) {
      return `${city} is currently covered by ${desc}. Clouds form when water vapour rises, cools, and condenses around tiny particles. Today's clouds are keeping temperatures relatively moderate — a bit cooler than a clear sunny day would be.`;
    }
    if (isClear) {
      return `The skies over ${city} are clear right now — no clouds blocking the sun! That means it may feel warmer during the day and cooler at night, since clouds act as an insulating blanket.`;
    }
    return `Clouds are droplets of water or ice crystals suspended in the atmosphere. They form when moist air rises and cools to its dew point. Depending on their type, they can bring rain, snow, or just shade.`;
  }

  // ── Snow / ice ────────────────────────────────────────────────────────────
  if (/snow|blizzard|ice|sleet|frost|freeze|frozen/.test(msg)) {
    if (hasSnow) {
      return `It's snowing in ${city}! Snow forms when water vapour in clouds freezes into ice crystals that clump together as snowflakes. At ${temp ?? 'sub-zero'}°C, make sure you dress in layers and watch out for icy surfaces. ❄️`;
    }
    if (temp !== null && temp <= 0) {
      return `It's ${temp}°C in ${city} — cold enough for frost or ice. Snow occurs when ice crystals in clouds grow heavy enough to fall, staying frozen if temperatures stay below 0°C all the way to the ground.`;
    }
    return `Snow forms when atmospheric temperatures are at or below freezing and water vapour directly crystallises into snowflakes. Each snowflake has a unique hexagonal structure shaped by the exact temperature and humidity it forms in.`;
  }

  // ── Wind ──────────────────────────────────────────────────────────────────
  if (/wind|breeze|gust|gale|storm|breezy|windy/.test(msg)) {
    if (wind !== null) {
      const bft = wind < 1.5 ? 'calm' : wind < 5.5 ? 'a light breeze' : wind < 10.8 ? 'a moderate breeze' : wind < 17.2 ? 'strong winds' : 'very strong winds';
      return `In ${city} the wind is blowing at ${wind} m/s — that's ${bft}. Wind is caused by pressure differences in the atmosphere; air flows from high-pressure to low-pressure zones. ${wind > 10 ? 'Hold onto your hat! 🌬' : 'Quite pleasant for a walk! 🌿'}`;
    }
    return `Wind is driven by pressure differences across the atmosphere — air always flows from high-pressure zones to low-pressure zones. The greater the difference, the stronger the wind.`;
  }

  // ── Humidity ──────────────────────────────────────────────────────────────
  if (/humid|humidity|damp|moisture|muggy|sticky/.test(msg)) {
    if (humidity !== null) {
      const feel = humidity > 80 ? 'quite muggy' : humidity > 60 ? 'noticeably humid' : humidity > 40 ? 'comfortable' : 'pleasantly dry';
      return `Humidity in ${city} is at ${humidity}% — that's ${feel}. Humidity measures how much water vapour is in the air. High humidity makes heat feel more oppressive because sweat evaporates more slowly, reducing your body's natural cooling.`;
    }
    return `Humidity is the amount of water vapour in the air, expressed as a percentage of the maximum it can hold at that temperature. High humidity makes hot days feel even hotter and can make the air feel thick and heavy.`;
  }

  // ── Temperature / hot / cold ──────────────────────────────────────────────
  if (/temp|hot|cold|warm|cool|degree|celsius|fahrenheit|heat wave|freezing/.test(msg)) {
    if (temp !== null) {
      const comfort = temp > 35 ? 'dangerously hot — stay hydrated and seek shade! 🌡' : temp > 28 ? 'warm and sunny 😎' : temp > 18 ? 'pleasantly comfortable 🌤' : temp > 8 ? 'a bit cool, grab a jacket 🧥' : 'quite cold — bundle up! 🧣';
      return `It's ${temp}°C in ${city} right now, feeling like ${feels ?? temp}°C. That's ${comfort}. Temperature tells us how much heat energy is in the air — driven by solar radiation, wind patterns, and local geography.`;
    }
    return `Temperature measures how much thermal energy the atmosphere holds. It varies with solar radiation, altitude (every 150 m of height drops temperature by ~1°C), and local geography like proximity to water or urban heat islands.`;
  }

  // ── Pressure ──────────────────────────────────────────────────────────────
  if (/pressure|barometric|hpa|millibar|barometer/.test(msg)) {
    if (pressure !== null) {
      const trend = pressure > 1020 ? 'high pressure — usually signals fair, stable weather' : pressure < 1000 ? 'low pressure — often associated with clouds and rain' : 'average pressure, typical conditions';
      return `Air pressure in ${city} is ${pressure} hPa — that's ${trend}. Atmospheric pressure is the weight of the air column above you. Rising pressure usually means improving weather; falling pressure often signals an incoming storm.`;
    }
    return `Atmospheric pressure is caused by the weight of the air above us. High pressure (>1013 hPa) typically brings clear, settled weather. Low pressure brings clouds, wind, and precipitation as air rises and cools.`;
  }

  // ── Visibility / fog / mist ───────────────────────────────────────────────
  if (/visib|fog|mist|haze|smog|clear/.test(msg)) {
    if (vis !== null) {
      const clarity = vis >= 10 ? 'excellent — a beautiful clear day!' : vis >= 5 ? 'moderate' : vis >= 1 ? 'poor — foggy or hazy conditions' : 'very poor — dense fog';
      return `Visibility in ${city} is ${vis} km — ${clarity}. Fog forms when humidity near the ground reaches 100% and water vapour condenses into tiny droplets, scattering light and reducing how far you can see.`;
    }
    return `Visibility is measured by how far you can clearly see. Fog, mist, haze, and smog all reduce visibility. Fog forms when air near the ground cools to the dew point and water vapour condenses into fine water droplets.`;
  }

  // ── Seasons / why is it [season] ─────────────────────────────────────────
  if (/season|summer|winter|spring|autumn|fall|equinox|solstice/.test(msg)) {
    return `Seasons happen because Earth's axis is tilted at ~23.5°. When your hemisphere tilts toward the Sun, days are longer, sunlight hits at a steeper angle, and temperatures rise — that's summer. The opposite tilt gives winter's shorter, cooler days. 🌍`;
  }

  // ── Thunder / lightning / storm ───────────────────────────────────────────
  if (/thunder|lightning|storm|thunderstorm/.test(msg)) {
    if (/thunder|storm/.test(desc)) {
      return `There's a thunderstorm in ${city} right now — stay indoors! Lightning is a massive electrical discharge caused by charge separation inside towering cumulonimbus clouds. Thunder is the sound of the air rapidly expanding from the lightning's heat.`;
    }
    return `Thunderstorms occur when warm, moist air rapidly rises into the atmosphere, creating towering cumulonimbus clouds. Electrical charges separate inside these clouds, eventually discharging as lightning. Thunder is the shockwave that lightning creates.`;
  }

  // ── Sunrise / sunset / daylight ──────────────────────────────────────────
  if (/sunrise|sunset|dawn|dusk|daylight|golden hour/.test(msg)) {
    return `Sunrise and sunset times in ${city} are shown on the Sunrise & Sunset card below! 🌅 The sky turns orange and red because sunlight travels through more atmosphere at low angles, scattering shorter blue wavelengths and leaving the longer warm colours.`;
  }

  // ── Thanks / gratitude ───────────────────────────────────────────────────
  if (/\b(thank|thanks|thx|tysm|appreciate)\b/.test(msg)) {
    return `You're very welcome! Let me know if you have any other weather questions. 🌤`;
  }

  // ── Compliments / casual affection ────────────────────────────────────────
  if (/\b(cute|sweet|smart|awesome|cool|great|nice|love you|best bot|good bot|pretty|handsome)\b|\b(?:you(?:'re| are)|\bu\b are|\bur\b)\s+(?:cute|sweet|smart|awesome|cool|helpful|great|nice|friendly)\b/i.test(msg)) {
    return `Aw, thank you! 😊 I'm always here to help you with the weather. Let me know what you'd like to know!`;
  }

  // ── How are you ──────────────────────────────────────────────────────────
  if (/\b(?:how are you|how're you|how r u|how are u|how is it going|how's it going)\b/.test(msg)) {
    return `I'm doing great, thanks for asking! 😊 Ready to help you with anything weather-related.`;
  }

  // ── General greeting ─────────────────────────────────────────────────────
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howdy|sup|yo)\b|\b(hi|hello|hey)\b/i.test(msg)) {
    return `Hi there! 👋 I'm Nimbus, your weather companion. Ask me anything about today's weather, forecast, or atmospheric phenomena!`;
  }

  // ── Off-topic / non-weather queries ──────────────────────────────────────
  if (/(recipe|cook|movie|music|sport|politic|invest|stock|code|program|math|history|joke|sport|game)/i.test(msg)) {
    return `I'm specialised in weather and atmospheric science, so that's a bit outside my expertise! 😊 Feel free to ask me about today's forecast, humidity, wind, or anything weather-related.`;
  }

  // ── General weather query fallback ───────────────────────────────────────
  if (/\b(?:weather|conditions?|climate|outside|outdoor)\b/.test(msg)) {
    if (temp !== null) {
      return `Right now in ${city}: ${temp}°C, feeling like ${feels ?? temp}°C, ${desc}. Humidity is ${humidity}% with winds at ${wind} m/s. Is there something specific about the weather you'd like me to explain?`;
    }
  }

  // ── Generic non-weather fallback ──────────────────────────────────────────
  return `I'm Nimbus, your weather companion! Ask me about temperature, rain, humidity, wind, clouds, pressure, or the forecast and I'll explain what's happening in the sky. 🌤`;
}

// ── Request validator ────────────────────────────────────────────────────────
function isWeatherRelated(message) {
  const weatherKeywords = [
    'weather', 'rain', 'snow', 'wind', 'cloud', 'sun', 'storm', 'temp', 'hot', 'cold',
    'warm', 'cool', 'humid', 'fog', 'mist', 'forecast', 'umbrella', 'thunder', 'lightning',
    'pressure', 'visibility', 'season', 'winter', 'summer', 'spring', 'autumn', 'climate',
    'feels like', 'celsius', 'fahrenheit', 'sunrise', 'sunset', 'daylight', 'breeze',
    'gale', 'drizzle', 'shower', 'overcast', 'clear', 'sleet', 'frost', 'ice', 'haze',
    'smog', 'breezy', 'windy', 'freeze', 'heat', 'blizzard', 'barometric', 'dew point',
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
  ];
  const lower = message.toLowerCase();
  return weatherKeywords.some((kw) => lower.includes(kw));
}

// ── Location extractor ───────────────────────────────────────────────────────
// Pulls a city name from patterns like:
//   "weather in Manipal", "what about the weather in Manipal, India",
//   "how is the weather in Bangalore", "weather in Udupi"
// Returns the raw city string (may include country hint) or null.
function extractLocationFromMessage(message) {
  // Ordered from most specific to least — stops at first match.
  const patterns = [
    // "weather in <city>", "weather for <city>", "weather of <city>"
    /\bweather\s+(?:in|for|at|of)\s+([a-zA-Z][\w\s,'-]{1,60}?)(?:\?|$|\.|,(?!\s*[a-z]{2,}\b)|\s+(?:today|now|tonight|right now|please|tomorrow))/i,
    // "what about (the weather in) <city>", "what's the weather in <city>"
    /\bwhat(?:'?s|\s+is|\s+about)?\s+(?:the\s+)?weather\s+(?:in|for|at|of)\s+([a-zA-Z][\w\s,'-]{1,60}?)(?:\?|$|\.|\s+(?:today|now|tonight|right now|please|tomorrow))/i,
    // "how is the weather in <city>", "how's the weather in <city>"
    /\bhow(?:'?s|\s+is)\s+(?:the\s+)?weather\s+(?:in|for|at|of)\s+([a-zA-Z][\w\s,'-]{1,60}?)(?:\?|$|\.|\s+(?:today|now|tonight|right now|please|tomorrow))/i,
    // "what about <city>" (e.g., "what about Manipal?", "what about in Manipal?")
    /\b(?:what|how)\s+about\s+(?:in\s+)?([a-zA-Z][\w\s,'-]{1,60}?)(?:\?|$|\.|\s+(?:today|now|tonight|right now|please|tomorrow))/i,
    // "is it raining/cold/hot in <city>", "forecast for <city>"
    /\b(?:rain|raining|sunny|cloudy|clouds|temperature|temp|humidity|wind|windy|forecast|snow|snowing|hot|cold|warm|cool)\b.*?\b(?:in|for|at|of)\s+([a-zA-Z][\w\s,'-]{1,60}?)(?:\?|$|\.)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      let loc = match[1].trim().replace(/\s+/g, ' ');
      loc = loc.replace(/\s+(?:today|now|tonight|right now|please|tomorrow|this week)\b.*$/i, '').trim();
      loc = loc.replace(/[?.,!]+$/, '').trim();
      if (loc.length > 0) return loc;
    }
  }
  return null;
}

// ── Live weather fetch for a named city ─────────────────────────────────────
// Reuses the same OpenWeather endpoint and normalisation already in weatherController.
const OW_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function fetchWeatherForCity(cityQuery) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await axios.get(OW_WEATHER_URL, {
      params: { q: cityQuery, appid: apiKey, units: 'metric' },
      timeout: 6000,
    });
    const d = response.data;
    return {
      city:        d.name,
      country:     d.sys?.country   || '',
      temperature: Math.round(d.main.temp),
      feelsLike:   Math.round(d.main.feels_like),
      tempMin:     Math.round(d.main.temp_min),
      tempMax:     Math.round(d.main.temp_max),
      humidity:    d.main.humidity,
      description: d.weather?.[0]?.description || '',
      icon:        d.weather?.[0]?.icon         || '',
      windSpeed:   d.wind?.speed  ?? 0,
      visibility:  typeof d.visibility === 'number' ? d.visibility / 1000 : 10,
      pressure:    d.main.pressure,
    };
  } catch {
    return null; // silently fall back to the default weather
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────
async function chatHandler(req, res) {
  const { message, weather } = req.body;

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ success: false, error: 'A message is required.' });
  }

  const trimmed = message.trim();

  try {
    let reply;

    // ── Location-switch: fetch fresh weather if user names a city ──────────
    let activeWeather = weather;
    const mentionedLocation = extractLocationFromMessage(trimmed);
    if (mentionedLocation) {
      const fetched = await fetchWeatherForCity(mentionedLocation);
      if (fetched) activeWeather = fetched;
    }
    // ─────────────────────────────────────────────────────────────────────

    const hasGemini = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '';

    if (hasGemini) {
      try {
        reply = await askGemini(trimmed, activeWeather);
      } catch (geminiErr) {
        console.warn('[chatController] Gemini error, falling back to local engine:', geminiErr.message);
        reply = localFallback(trimmed, activeWeather);
      }
    } else {
      reply = localFallback(trimmed, activeWeather);
    }

    return res.status(200).json({ success: true, reply });
  } catch (err) {
    console.error('[chatController] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong. Please try again.',
    });
  }
}

module.exports = { chatHandler };
