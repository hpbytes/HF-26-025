const express = require('express');
const router = express.Router();

const ML_BASE = process.env.ML_SERVICE_URL || 'http://127.0.0.1:5000';

async function mlProxy(path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${ML_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`ML service error: ${res.status}`);
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// GET /api/ml/forecast — demand forecast
router.get('/forecast', async (req, res, next) => {
  try {
    const data = await mlProxy('/forecast');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/ml/anomalies — anomaly detection
router.get('/anomalies', async (req, res, next) => {
  try {
    const data = await mlProxy('/anomalies');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/ml/expiry — expiry predictions
router.get('/expiry', async (req, res, next) => {
  try {
    const data = await mlProxy('/expiry');
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
