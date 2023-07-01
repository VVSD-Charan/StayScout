const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const ExpressError=require('../utils/ExpressError');
const {reviewSchema} = require('../schemas.js'); 
const Review = require('../models/review');
const Room=require('../models/rooms');


const validateReview = (req , res , next) =>
{
    const {error}=reviewSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
}


//Handle post requests
router.post('/',validateReview,catchAsync(async(req , res) =>{
    const id = req.params.id;
    const room = await Room.findById(req.params.id);
    const review = new Review(req.body.review);
    room.reviews.push(review);
    await review.save();
    await room.save();

    res.redirect(`/rooms/${room._id}`)
}));

// Handle delete requests
router.delete('/:reviewId',catchAsync(async ( req , res)=>{
    const {id , reviewId} = req.params;
    await Room.findByIdAndUpdate(id,{$pull : {reviews : reviewId}},{new : true});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rooms/${id}`);
}));

module.exports = router;