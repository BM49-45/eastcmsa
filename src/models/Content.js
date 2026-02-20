// backend/src/models/Content.js
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['tawhiid', 'fiqh', 'mihadhara', 'book', 'announcement'],
    required: true
  },
  type: {
    type: String,
    enum: ['audio', 'video', 'document', 'text'],
    required: true
  },
  speaker: {
    type: String,
    required: true
  },
  fileUrl: String,
  thumbnailUrl: String,
  duration: String,
  fileSize: String,
  language: {
    type: String,
    default: 'sw'
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Content', contentSchema);