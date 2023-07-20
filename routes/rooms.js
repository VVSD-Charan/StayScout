const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateRoom} = require('../middleware');
const Room = require('../models/rooms');

//Handling get requests
router.get('/',catchAsync(async (req , res) => {
    const rooms = await Room.find();
    res.render('rooms/index',{rooms});
}));
router.get('/new', isLoggedIn ,(req , res)=>{
    res.render('rooms/new');
});
router.get('/:id',catchAsync(async(req , res)=>{
    const room = await Room.findById(req.params.id).populate({
        path : 'reviews',
        populate : {
            path : 'author'
        }
    }).populate('author');

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


