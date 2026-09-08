// server/routes/chat.js
// ─────────────────────────────────────────────────────────────────────────────
// Defines the chat route for the Nimbus AI weather assistant.
// ─────────────────────────────────────────────────────────────────────────────

const express       = require('express');
const { chatHandler } = require('../controllers/chatController');

const router = express.Router();

// POST /api/chat  — send a message to Nimbus AI
router.post('/', chatHandler);

module.exports = router;
