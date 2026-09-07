// server/controllers/weatherController.js
// ─────────────────────────────────────────────────────────────────────────────
// This is the "brain" of the weather routes.
// It receives city or coordinates from requests, calls OpenWeather API,
// shapes the responses into clean JSON, and handles all errors.
// ─────────────────────────────────────────────────────────────────────────────

const axios = require('axios');

// The base URLs for OpenWeather endpoints
const OW_WEATHER_URL  = 'https://api.openweathermap.org/data/2.5/weather';
const OW_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

/**
 * Helper to transform raw OpenWeather current weather data into our normalized contract.
 */
function normalizeWeatherData(data) {
  return {
    city:        data.name,
    country:     data.sys?.country || '',
    temperature: Math.round(data.main.temp),       // °C, rounded
    feelsLike:   Math.round(data.main.feels_like),
    tempMin:     Math.round(data.main.temp_min),
    tempMax:     Math.round(data.main.temp_max),
    humidity:    data.main.humidity,               // %
    description: data.weather?.[0]?.description || '',      // e.g. "light rain"
    icon:        data.weather?.[0]?.icon || '',             // e.g. "10d"
    windSpeed:   data.wind?.speed ?? 0,                     // m/s
    windDeg:     data.wind?.deg ?? 0,                       // degrees
    visibility:  typeof data.visibility === 'number' ? data.visibility / 1000 : 10, // m → km
    pressure:    data.main.pressure,               // hPa
    sunrise:     data.sys?.sunrise,                 // Unix timestamp
    sunset:      data.sys?.sunset,                  // Unix timestamp
    timezone:    data.timezone,                    // UTC offset in seconds
    coord:       data.coord,                       // { lon, lat }
    fetchedAt:   new Date().toISOString(),
  };
}

/**
 * Helper to group 3-hourly OpenWeather forecast readings into ~5 clean daily forecast entries.
 */
function normalizeForecastData(data) {
  const list = data.list || [];
  const cityInfo = {
    city: data.city?.name || '',
    country: data.city?.country || '',
    timezone: data.city?.timezone || 0,
    sunrise: data.city?.sunrise,
    sunset: data.city?.sunset,
    coord: data.city?.coord,
  };

  // Group readings by date (YYYY-MM-DD in the local timezone of the target location)
  const daysMap = new Map();

  for (const item of list) {
    // Convert UTC timestamp using city timezone offset
    const localDate = new Date((item.dt + (cityInfo.timezone || 0)) * 1000);
    const dateKey = localDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    if (!daysMap.has(dateKey)) {
      daysMap.set(dateKey, []);
    }
    daysMap.get(dateKey).push(item);
  }

  // Transform each grouped day into a clean daily forecast entry
  const daily = [];
  for (const [dateStr, entries] of daysMap.entries()) {
    // Pick the most representative entry for midday conditions (closest to 12:00 / index around midday)
    let bestMiddayEntry = entries[0];
    let minHourDiff = 24;

    let dayMin = Infinity;
    let dayMax = -Infinity;
    let totalHumid = 0;
    let totalWind = 0;

    for (const entry of entries) {
      const entryHour = new Date((entry.dt + (cityInfo.timezone || 0)) * 1000).getUTCHours();
      const diff = Math.abs(entryHour - 12);
      if (diff < minHourDiff) {
        minHourDiff = diff;
        bestMiddayEntry = entry;
      }

      const tempMin = entry.main?.temp_min ?? entry.main?.temp;
      const tempMax = entry.main?.temp_max ?? entry.main?.temp;
      if (tempMin < dayMin) dayMin = tempMin;
      if (tempMax > dayMax) dayMax = tempMax;

      totalHumid += (entry.main?.humidity || 0);
      totalWind  += (entry.wind?.speed || 0);
    }

    const representativeDate = new Date((bestMiddayEntry.dt + (cityInfo.timezone || 0)) * 1000);

    daily.push({
      date: dateStr,
      timestamp: bestMiddayEntry.dt,
      dayOfWeek: representativeDate.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' }),
      formattedDate: representativeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      time: bestMiddayEntry.dt_txt ? bestMiddayEntry.dt_txt.split(' ')[1] : '12:00:00',
      temperature: Math.round(bestMiddayEntry.main?.temp),
      feelsLike: Math.round(bestMiddayEntry.main?.feels_like),
      tempMin: Math.round(dayMin),
      tempMax: Math.round(dayMax),
      description: bestMiddayEntry.weather?.[0]?.description || '',
      icon: bestMiddayEntry.weather?.[0]?.icon || '',
      humidity: Math.round(totalHumid / entries.length),
      windSpeed: Number((totalWind / entries.length).toFixed(1)),
      readingsCount: entries.length,
    });
  }

  // Keep up to 5 days
  return {
    ...cityInfo,
    fetchedAt: new Date().toISOString(),
    daily: daily.slice(0, 5),
  };
}

/**
 * Shared error handler for OpenWeather API requests.
 */
function handleWeatherError(err, res, queryInfo) {
  if (err.response) {
    const status = err.response.status;

    // 404 → not found
    if (status === 404) {
      return res.status(404).json({
        success: false,
        error: `Weather data for ${queryInfo} was not found.`,
      });
    }

    // 401 → OpenWeather rejected the key
    if (status === 401) {
      return res.status(502).json({
        success: false,
        error: 'OpenWeather API rejected the key (401 Unauthorized). If this is a newly generated key, OpenWeather keys typically take 10 minutes to a few hours to activate.',
      });
    }

    // Any other API error
    return res.status(status).json({
      success: false,
      error: `OpenWeather API returned an error: ${err.response.data?.message || 'Unknown error'}`,
    });
  }

  // Timeout
  if (err.code === 'ECONNABORTED') {
    return res.status(504).json({
      success: false,
      error: 'The weather service took too long to respond. Please try again.',
    });
  }

  console.error('[weatherController] Unexpected error:', err.message);
  return res.status(500).json({
    success: false,
    error: 'An unexpected server error occurred. Please try again later.',
  });
}

/**
 * GET /api/weather?city=London
 */
async function getCurrentWeather(req, res) {
  const { city } = req.query;

  if (!city || city.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a city name. Example: /api/weather?city=London',
    });
  }

  if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY.trim() === '') {
    return res.status(500).json({
      success: false,
      error: 'OPENWEATHER_API_KEY is missing in server/.env.',
    });
  }

  try {
    const response = await axios.get(OW_WEATHER_URL, {
      params: {
        q:     city.trim(),
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 8000,
    });

    const weather = normalizeWeatherData(response.data);
    return res.status(200).json({ success: true, data: weather });
  } catch (err) {
    return handleWeatherError(err, res, `city "${city}"`);
  }
}

/**
 * GET /api/weather/coordinates?lat=51.5074&lon=-0.1278
 */
async function getWeatherByCoordinates(req, res) {
  const { lat, lon } = req.query;

  if (lat === undefined || lon === undefined || lat === '' || lon === '') {
    return res.status(400).json({
      success: false,
      error: 'Latitude (lat) and longitude (lon) query parameters are required. Example: /api/weather/coordinates?lat=51.5074&lon=-0.1278',
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.',
    });
  }

  if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY.trim() === '') {
    return res.status(500).json({
      success: false,
      error: 'OPENWEATHER_API_KEY is missing in server/.env.',
    });
  }

  try {
    const response = await axios.get(OW_WEATHER_URL, {
      params: {
        lat:   latitude,
        lon:   longitude,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 8000,
    });

    const weather = normalizeWeatherData(response.data);
    return res.status(200).json({ success: true, data: weather });
  } catch (err) {
    return handleWeatherError(err, res, `coordinates (${latitude}, ${longitude})`);
  }
}

/**
 * GET /api/weather/forecast?city=London
 */
async function getForecast(req, res) {
  const { city } = req.query;

  if (!city || city.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a city name. Example: /api/weather/forecast?city=London',
    });
  }

  if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY.trim() === '') {
    return res.status(500).json({
      success: false,
      error: 'OPENWEATHER_API_KEY is missing in server/.env.',
    });
  }

  try {
    const response = await axios.get(OW_FORECAST_URL, {
      params: {
        q:     city.trim(),
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 8000,
    });

    const forecast = normalizeForecastData(response.data);
    return res.status(200).json({ success: true, data: forecast });
  } catch (err) {
    return handleWeatherError(err, res, `city "${city}" forecast`);
  }
}

/**
 * GET /api/weather/forecast/coordinates?lat=51.5074&lon=-0.1278
 */
async function getForecastByCoordinates(req, res) {
  const { lat, lon } = req.query;

  if (lat === undefined || lon === undefined || lat === '' || lon === '') {
    return res.status(400).json({
      success: false,
      error: 'Latitude (lat) and longitude (lon) query parameters are required. Example: /api/weather/forecast/coordinates?lat=51.5074&lon=-0.1278',
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates. Latitude must be between -90 and 90, and longitude between -180 and 180.',
    });
  }

  if (!process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY.trim() === '') {
    return res.status(500).json({
      success: false,
      error: 'OPENWEATHER_API_KEY is missing in server/.env.',
    });
  }

  try {
    const response = await axios.get(OW_FORECAST_URL, {
      params: {
        lat:   latitude,
        lon:   longitude,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
      timeout: 8000,
    });

    const forecast = normalizeForecastData(response.data);
    return res.status(200).json({ success: true, data: forecast });
  } catch (err) {
    return handleWeatherError(err, res, `coordinates (${latitude}, ${longitude}) forecast`);
  }
}

module.exports = {
  getCurrentWeather,
  getWeatherByCoordinates,
  getForecast,
  getForecastByCoordinates,
};
