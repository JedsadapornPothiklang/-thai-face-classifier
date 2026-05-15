const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const predictRouter = require('./routes/predict');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
  methods: ['POST', 'GET'],
}));

// ── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json());

// ── Rate limiting (100 req / 15 min per IP) ──────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'RATE_LIMIT', message: 'Too many requests, please try again later.' },
});
app.use('/predict', limiter);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/predict', predictRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ── Global error handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
