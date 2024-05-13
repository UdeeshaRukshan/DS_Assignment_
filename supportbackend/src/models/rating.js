const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0.5,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
