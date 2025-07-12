
const express = require('express');
const {
  updateGeneralSettings,
  getGeneralSettings,
  updateIntegrationSettings
} = require('../controllers/settings');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// General Settings Routes
router.route('/general')
  .get(getGeneralSettings)  // Any authenticated user can view
  .put(authorize('admin'), updateGeneralSettings);  // Only admins can update

// Integration Settings Routes  
router.put('/integrations', authorize('admin'), updateIntegrationSettings);

module.exports = router;