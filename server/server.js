const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Production CORS Configuration
const allowedOrigins = [
  'https://study-twin-49tw.onrender.com',
  'https://study-twin-r15d.vercel.app/register',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS Policy: Origin ${origin} not allowed by CORS configuration.`));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes Imports
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const topicRoutes = require('./routes/topicRoutes');
const studySessionRoutes = require('./routes/studySessionRoutes');
const quizRoutes = require('./routes/quizRoutes');
const masteryRoutes = require('./routes/masteryRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/study-sessions', studySessionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/mastery', masteryRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'StudyTwin Express Backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[StudyTwin Backend] Server running on port ${PORT}`);
    });
  });
}

module.exports = app;
