const express = require('express');
const router = express.Router();
const { analyzeEmlFolder } = require('../services/eml-parser');
const path = require('path');

const EMAILS_FOLDER = path.join(__dirname, '../../data/emails');

router.get('/analyze', async (req, res) => {
  try {
    const results = await analyzeEmlFolder(EMAILS_FOLDER);

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
