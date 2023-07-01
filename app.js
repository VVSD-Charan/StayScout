const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Room = require('./models/rooms');
const Joi = require('joi');
const {roomSchema,reviewSchema} = require("./schemas.js");
const Review = require('./models/review');
const rooms = require('./routes/rooms');

//Connecting to DB
mongoose.connect('mongodb://127.0.0.1:27017/StayScout',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

//Check if connection is successful
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const app = express();

//Set paths and view engine
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

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

app.use('/rooms',rooms);

//Handle get requests
app.get('/',(req , res)=>{
    res.render('home');
});


//Handle post requests
app.post('/rooms/:id/reviews',validateReview,catchAsync(async(req , res) =>{
    const id = req.params.id;
    const room = await Room.findById(req.params.id);
    const review = new Review(req.body.review);
    room.reviews.push(review);
    await review.save();
    await room.save();

    res.redirect(`/rooms/${room._id}`)
}));

// Handle delete requests
app.delete('/rooms/:id/reviews/:reviewId',catchAsync(async ( req , res)=>{
    const {id , reviewId} = req.params;
    await Room.findByIdAndUpdate(id,{$pull : {reviews : reviewId}},{new : true});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/rooms/${id}`);
}));

//If none of urls match then send 404 page not found page
app.all('*',(req , res , next)=>{
    next(new ExpressError('Page Not Found',404));
});

//Validate forms
app.use((err , req , res , next)=>{

    const {statusCode=500} = err;
    if(!err.message){
        err.message='Something went wrong!';
    }

    res.status(statusCode).render('error' , {err});
});

//Start server
app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Serving on port 3000");
});