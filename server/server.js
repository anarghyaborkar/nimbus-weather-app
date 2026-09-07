// server/server.js
// ─────────────────────────────────────────────────────────────────────────────
// Entry point for the Nimbus Express backend.
// Responsibilities:
//   1. Load environment variables from .env
//   2. Create and configure the Express app
//   3. Register middleware (CORS, JSON parsing)
//   4. Mount route modules
//   5. Add a global error handler
//   6. Start listening on a port
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');

// Step 1 — Load .env variables into process.env as early as possible.
//           Use an explicit path to server/.env so launching from the project root
//           or inside server/ always loads the correct configuration.
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express      = require('express');
const cors         = require('cors');
const weatherRoute = require('./routes/weather');

// Step 2 — Create the Express application.
const app = express();

// Step 3 — Register middleware.
// ─────────────────────────────
// CORS: allows our React frontend (running on a different port) to make
//       requests to this server without the browser blocking them.
app.use(
  cors({
    // In development allow both Vite's default port (5173) and any others.
    // In production you would restrict this to your deployed frontend URL.
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET'],
  })
);

// express.json(): automatically parses incoming JSON request bodies.
// Not strictly needed for GET requests, but good practice to have.
app.use(express.json());

// Step 4 — Mount route modules.
// ─────────────────────────────
// All weather-related routes live under /api/weather.
// Adding new feature routes later is as simple as:
//   const forecastRoute = require('./routes/forecast');
//   app.use('/api/forecast', forecastRoute);
app.use('/api/weather', weatherRoute);

// Health-check endpoint — useful to quickly verify the server is running.
// Visit http://localhost:5000/health in your browser to confirm.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Nimbus server is running 🌤',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler — catches any request that didn't match a defined route.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route "${req.method} ${req.originalUrl}" not found.`,
  });
});

// Step 5 — Global error handler.
// Express recognises a 4-argument function as an error handler.
// Any time a route calls next(err), execution jumps here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.',
  });
});

// Step 6 — Start the server.
// Fall back to port 5000 if PORT is not set in .env.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🌤  Nimbus server is running`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Weather API:  http://localhost:${PORT}/api/weather?city=London\n`);
});
