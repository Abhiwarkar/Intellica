
const express = require('express');
const {
  getBusinessOverview,
  getUserActivityReport,
  getConversionFunnel
} = require('../controllers/reports');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/overview', authorize('viewer', 'analyst', 'admin'), getBusinessOverview);
router.get('/user-activity', authorize('viewer', 'analyst', 'admin'), getUserActivityReport);
router.get('/conversion-funnel', authorize('analyst', 'admin'), getConversionFunnel);

module.exports = router;