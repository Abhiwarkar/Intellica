

const express = require('express');
const {
  trackEvent,
  getEvents,
  getOverview,
  getUserMetrics
} = require('../controllers/analytics');
const { generateSampleData } = require('../controllers/sampleData');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Routes accessible to all authenticated users
router.post('/events', trackEvent);

// Routes that require at least viewer role
router.get('/events', authorize('viewer', 'analyst', 'admin'), getEvents);
router.get('/overview', authorize('viewer', 'analyst', 'admin'), getOverview);
router.get('/users', authorize('viewer', 'analyst', 'admin'), getUserMetrics);

// Allow both Admin and Analyst to generate sample data for testing
router.post('/generate-sample-data', authorize('analyst', 'admin'), generateSampleData);

module.exports = router;