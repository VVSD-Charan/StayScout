const express = require('express');
const router = express.Router({mergeParams : true});
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Review = require('../models/review');
const Room=require('../models/rooms');
const reviews = require('../controllers/reviews');


//Handle post requests
//Post a new review
router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview));

// Handle delete requests
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview));

module.exports = router;