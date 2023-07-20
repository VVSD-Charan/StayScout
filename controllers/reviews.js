const Review = require('../models/review');
const Room=require('../models/rooms');

//Add a review
module.exports.createReview = async(req , res) =>{
    const id = req.params.id;
    const room = await Room.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    room.reviews.push(review);
    await review.save();
    await room.save();

    req.flash('success','Review has been added successfully');
    res.redirect(`/rooms/${room._id}`)
};

//Delete a review
module.exports.deleteReview = async ( req , res)=>{
    const {id , reviewId} = req.params;
    await Room.findByIdAndUpdate(id,{$pull : {reviews : reviewId}},{new : true});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success','Review has been deleted successfully');
    res.redirect(`/rooms/${id}`);
};