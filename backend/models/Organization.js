const mongoose = require('mongoose');
const crypto = require('crypto');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an organization name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  apiKey: {
    type: String,
    unique: true
  },
  plan: {
    type: String,
    enum: ['free', 'startup', 'enterprise'],
    default: 'free'
  },
  settings: {
    trackingEnabled: {
      type: Boolean,
      default: true
    },
    customDomain: String,
    logoUrl: String,
    primaryColor: String,
    timezone: {
      type: String,
      default: 'UTC'
    },
    dateFormat: {
      type: String,
      default: 'MM/DD/YYYY'
    },
    integrations: {
      enableTracking: { type: Boolean, default: true },
      trackPageViews: { type: Boolean, default: true },
      trackClicks: { type: Boolean, default: true },
      enableGoogleAnalytics: { type: Boolean, default: false },
      googleAnalyticsId: String
    },
    updatedAt: Date,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate API key before saving
OrganizationSchema.pre('save', function(next) {
  if (!this.apiKey) {
    this.apiKey = crypto.randomBytes(16).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Organization', OrganizationSchema);