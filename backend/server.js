const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const users = require('./routes/users');
const analytics = require('./routes/analytics');
const reports = require('./routes/reports');
const settings = require('./routes/settings');

const app = express();

// Body parser
app.use(express.json());

// Set security headers
app.use(helmet());

// Enable CORS with correct configuration
app.use(cors({
  origin: 'http://localhost:5173', // Frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

console.log('CORS configured for frontend on localhost:5173');

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routes
app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/analytics', analytics);
app.use('/api/reports', reports);
app.use('/api/settings', settings);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});