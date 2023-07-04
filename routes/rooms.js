const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {roomSchema} = require('../schemas.js');
const {isLoggedIn} = require('../middleware');
const ExpressError = require('../utils/ExpressError'); 
const Room = require('../models/rooms');

const validateRoom = (req , res , next) =>
{
    const {error} = roomSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
};

const isAuthor = async(req , res , next) => {
    const {id} = req.params;
    const room = await Room.findById(id);

    if(req.user &&  !room.author.equals(req.user._id)){
        req.flash('error','Only owners can perform this action!');
        return res.redirect(`/rooms/${id}`);
    }
    next();
}

//Handling get requests
router.get('/',catchAsync(async (req , res) => {
    const rooms = await Room.find();
    res.render('rooms/index',{rooms});
}));
router.get('/new', isLoggedIn ,(req , res)=>{
    res.render('rooms/new');
});
router.get('/:id',catchAsync(async(req , res)=>{
    const room = await Room.findById(req.params.id).populate('reviews').populate('author');

    if(!room){
        req.flash('error','Cannot find that room');
        return res.redirect('/rooms');
    }
    res.render('rooms/show',{room});
}));
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req , res)=>{
    const room = await Room.findById(req.params.id);

    if(!room){
        req.flash('error','Cannot find that room');
        return res.redirect('/rooms');
    }
    res.render('rooms/edit',{room});
}));

//Handle post requests
router.post('/',isLoggedIn,validateRoom,catchAsync(async(req , res , next)=>{
    const room = new Room(req.body.room);
    room.author = req.user._id;
    await room.save();
    req.flash('success','Successfully made a new rental house');
    res.redirect(`/rooms/${room._id}`);
}));

//Handle put requests
router.put('/:id',isLoggedIn, isAuthor , validateRoom ,catchAsync(async(req , res)=>{
    const {id}=req.params;
    const room = await Room.findById(id);

    const {title,location,image,price,description} = req.body.room;

    await Room.findByIdAndUpdate(id,{title,location,image,description,price},{new:true});
    req.flash('success','Successfully updated room details!');
    res.redirect(`/rooms/${id}`);
}));

//Handle delete requests
router.delete('/:id',isLoggedIn,isAuthor ,catchAsync(async ( req , res) =>{
    const {id} = req.params;
    await Room.findByIdAndDelete(id);

    req.flash('success','Room has been deleted successfully');
    res.redirect('/rooms');
}));

module.exports = router;


