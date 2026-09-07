// server/controllers/weatherController.js
// ─────────────────────────────────────────────────────────────────────────────
// This is the "brain" of the weather route.
// It receives the city name from the request, calls the OpenWeather API,
// shapes the response into clean JSON, and handles all errors.
// ─────────────────────────────────────────────────────────────────────────────

const axios = require('axios');

// The base URL for the OpenWeather "Current Weather" endpoint.
// We read the API key from process.env so it is never hard-coded in source code.
const OW_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * GET /api/weather?city=London
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 */
async function getCurrentWeather(req, res) {
  // 1. Pull the city from the query string.
  //    e.g. /api/weather?city=London  →  city = "London"
  const { city } = req.query;

  // 2. Validate — reject the request early if no city was provided.
  if (!city || city.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a city name. Example: /api/weather?city=London',
    });
  }

  try {
    // 3. Call the OpenWeather API.
    //    "units=metric" gives us Celsius; switch to "imperial" for Fahrenheit.
    const response = await axios.get(OW_BASE_URL, {
      params: {
        q:     city.trim(),
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric',
      },
      // Fail fast if the API takes more than 8 seconds.
      timeout: 8000,
    });

    const data = response.data;

    // 4. Shape the raw OpenWeather response into a cleaner object.
    //    This protects the frontend from the raw API structure and makes
    //    future API changes easier to manage in one place.
    const weather = {
      city:        data.name,
      country:     data.sys.country,
      temperature: Math.round(data.main.temp),       // °C, rounded
      feelsLike:   Math.round(data.main.feels_like),
      tempMin:     Math.round(data.main.temp_min),
      tempMax:     Math.round(data.main.temp_max),
      humidity:    data.main.humidity,               // %
      description: data.weather[0].description,      // e.g. "light rain"
      icon:        data.weather[0].icon,             // e.g. "10d"
      windSpeed:   data.wind.speed,                  // m/s
      windDeg:     data.wind.deg,                    // degrees
      visibility:  data.visibility / 1000,           // convert m → km
      pressure:    data.main.pressure,               // hPa
      sunrise:     data.sys.sunrise,                 // Unix timestamp
      sunset:      data.sys.sunset,                  // Unix timestamp
      timezone:    data.timezone,                    // UTC offset in seconds
      fetchedAt:   new Date().toISOString(),
    };

    // 5. Send the clean response back to the frontend.
    return res.status(200).json({ success: true, data: weather });

  } catch (err) {
    // 6. Handle errors gracefully.

    // "err.response" exists when the API itself replied with an error code.
    if (err.response) {
      const status = err.response.status;

      // 404 → city not found
      if (status === 404) {
        return res.status(404).json({
          success: false,
          error: `City "${city}" was not found. Please check the spelling and try again.`,
        });
      }

      // 401 → bad API key
      if (status === 401) {
        return res.status(500).json({
          success: false,
          error: 'Weather API key is invalid or missing. Check your .env file.',
        });
      }

      // Any other API error
      return res.status(status).json({
        success: false,
        error: `OpenWeather API returned an error: ${err.response.data?.message || 'Unknown error'}`,
      });
    }

    // "err.code === ECONNABORTED" → the request timed out
    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: 'The weather service took too long to respond. Please try again.',
      });
    }

    // Catch-all for unexpected errors (network down, etc.)
    console.error('[weatherController] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'An unexpected server error occurred. Please try again later.',
    });
  }
}

module.exports = { getCurrentWeather };
