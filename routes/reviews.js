const express = require('express');
const router = express.Router({mergeParams : true});
const {validateReview,isLoggedIn} = require('../middleware')
const catchAsync = require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const Review = require('../models/review');
const Room=require('../models/rooms');


//Handle post requests
router.post('/',isLoggedIn,validateReview,catchAsync(async(req , res) =>{
    const id = req.params.id;
    const room = await Room.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    room.reviews.push(review);
    await review.save();
    await room.save();

    req.flash('success','Review has been added successfully');
    res.redirect(`/rooms/${room._id}`)
}));

// Handle delete requests
router.delete('/:reviewId',catchAsync(async ( req , res)=>{
    const {id , reviewId} = req.params;
    await Room.findByIdAndUpdate(id,{$pull : {reviews : reviewId}},{new : true});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success','Review has been deleted successfully');
    res.redirect(`/rooms/${id}`);
}));

module.exports = router;