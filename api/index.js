// api/index.js
// ─────────────────────────────────────────────────────────────────────────────
// Vercel Serverless Function entry point.
// Delegates all API routing directly to the existing Express app.
// ─────────────────────────────────────────────────────────────────────────────

const app = require('../server/server.js');

module.exports = app;
