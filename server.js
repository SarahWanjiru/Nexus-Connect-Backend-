const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();

const jobRoutes = require('./routes/jobs');
const authRoutes = require('./routes/auth');
const savedJobsRoutes = require('./routes/savedJobs');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Enhanced JSON parsing with error handling
app.use(express.json({
  verify: (req, res, buf, encoding) => {
    try {
      if (buf && buf.length > 0) {
        JSON.parse(buf.toString(encoding));
      }
    } catch (error) {
      console.error('JSON Parsing Error:', error);
      res.status(400).json({
        success: false,
        error: 'Invalid JSON format',
        details: error.message
      });
    }
  }
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/saved-jobs', savedJobsRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nexus Connect API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON request body',
      details: err.message
    });
  }
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Adzuna credentials:', {
    APP_ID: process.env.ADZUNA_APP_ID ? 'SET' : 'MISSING',
    APP_KEY: process.env.ADZUNA_APP_KEY ? 'SET' : 'MISSING'
  });
});
