// backend/src/models/Analytics.js
const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  visitors: Number,
  pageViews: Number,
  uniqueVisitors: Number,
  downloads: Number,
  likes: Number,
  shares: Number,
  contentViews: [{
    contentId: mongoose.Schema.Types.ObjectId,
    views: Number
  }],
  userActivity: [{
    userId: mongoose.Schema.Types.ObjectId,
    action: String,
    timestamp: Date
  }]
});

module.exports = mongoose.model('Analytics', analyticsSchema);