const express = require('express');
const cors = require('cors');
const SourceAnalyzer = require('./src/analyzer');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json({
        success: false,
        error: 'Path is required'
      });
    }

    const analyzer = new SourceAnalyzer();
    const result = analyzer.analyzeDirectory(path);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Source Analyzer Backend',
    port: PORT
  });
});

app.listen(PORT, () => {
  console.log(`✅ Source Analyzer Backend running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
