// server/routes/weather.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines all URL routes related to weather.
// The router's job is purely to map HTTP verbs + paths → controller functions.
// It does NOT contain any logic — that all lives in the controller.
// ─────────────────────────────────────────────────────────────────────────────

const express = require('express');
const { getCurrentWeather } = require('../controllers/weatherController');

// express.Router() creates a mini Express app that handles a slice of routes.
// We mount this at "/api/weather" in server.js, so the full path becomes:
//   GET /api/weather?city=London
const router = express.Router();

// Route definition:
//   GET /   (relative to wherever this router is mounted)
//   Handler: getCurrentWeather (imported from the controller)
router.get('/', getCurrentWeather);

module.exports = router;
