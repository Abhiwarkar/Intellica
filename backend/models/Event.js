const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an event name'],
    trim: true,
    maxlength: [100, 'Event name cannot be more than 100 characters']
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
    index: true
  },
  userId: {
    type: String,
    index: true
  },
  sessionId: {
    type: String,
    index: true
  },
  properties: {
    type: Object,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    browser: String,
    device: String,
    os: String,
    ip: String,
    country: String,
    referrer: String,
    url: String
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
EventSchema.index({ organization: 1, name: 1, timestamp: -1 });

module.exports = mongoose.model('Event', EventSchema);