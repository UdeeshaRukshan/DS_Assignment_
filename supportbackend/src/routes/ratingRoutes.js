const express = require('express');
const ratingRouter = express.Router();
const ratingController = require('../controllers/ratingController');

// Route to post a new rating
ratingRouter.post('/ratings', ratingController.createRating);

// Route to get all ratings
ratingRouter.get('/ratings', ratingController.getAllRatings);

module.exports = ratingRouter;
