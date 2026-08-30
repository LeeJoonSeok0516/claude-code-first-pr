const express = require('express');
const cors = require('cors');
const emailRoutes = require('./src/routes/emails');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/emails', emailRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 EML Analyzer Backend running on http://localhost:${PORT}`);
  console.log(`📧 API endpoint: http://localhost:${PORT}/api/emails/analyze`);
});
