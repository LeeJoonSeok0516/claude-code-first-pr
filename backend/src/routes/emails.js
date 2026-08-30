const express = require('express');
const router = express.Router();
const multer = require('multer');
const { parseEmlFile } = require('../services/eml-parser');
const { analyzeEmlFolder } = require('../services/eml-parser');
const path = require('path');

const EMAILS_FOLDER = path.join(__dirname, '../../data/emails');
const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/analyze-files', upload.array('files'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files provided'
      });
    }

    const emlFiles = req.files.filter(file => file.originalname.toLowerCase().endsWith('.eml'));

    if (emlFiles.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
        message: 'No .eml files found in the selection'
      });
    }

    const results = [];

    for (const file of emlFiles) {
      try {
        const { simpleParser } = require('mailparser');
        const Readable = require('stream').Readable;

        const stream = new Readable();
        stream.push(file.buffer);
        stream.push(null);

        const parsed = await simpleParser(stream);

        const mainContent = parsed.text?.slice(0, 500) || parsed.html?.slice(0, 500) || '';

        results.push({
          id: require('uuid').v4(),
          sender: parsed.from?.text || 'Unknown',
          subject: parsed.subject || '(No Subject)',
          date: parsed.date ? new Date(parsed.date).toLocaleDateString() : 'Unknown',
          mainContent: mainContent.trim(),
          fileName: file.originalname,
          fullPath: file.originalname
        });
      } catch (err) {
        console.error(`Error parsing ${file.originalname}:`, err.message);
      }
    }

    results.sort((a, b) => new Date(b.date) - new Date(a.date));

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
