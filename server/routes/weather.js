// server/routes/weather.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines all URL routes related to weather & forecasts.
// Maps HTTP verbs + paths → controller functions.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const {
  getCurrentWeather,
  getWeatherByCoordinates,
  getForecast,
  getForecastByCoordinates,
} = require('../controllers/weatherController');

const router = express.Router();

// Specific sub-paths MUST come before generic/root paths
// GET /api/weather/coordinates?lat=...&lon=...
router.get('/coordinates', getWeatherByCoordinates);

// GET /api/weather/forecast/coordinates?lat=...&lon=...
router.get('/forecast/coordinates', getForecastByCoordinates);

// GET /api/weather/forecast?city=London
router.get('/forecast', getForecast);

// GET /api/weather?city=London
router.get('/', getCurrentWeather);

module.exports = router;
