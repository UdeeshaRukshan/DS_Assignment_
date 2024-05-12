const Rating = require('../models/rating.js');

// Post a new rating
exports.createRating = async (req, res) => {
  try {
    const { user, value, comment } = req.body;
    const newRating = await Rating.create({ user, value, comment });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all ratings
exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({});
    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
