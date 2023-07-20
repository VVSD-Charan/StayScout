const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateRoom} = require('../middleware');
const Room = require('../models/rooms');

//Handling show rooms get request
router.get('/',catchAsync(rooms.index)); 
//Login form
router.get('/new', isLoggedIn ,rooms.renderNewForm);
//Handling get room requests
router.get('/:id',catchAsync(rooms.createRoom));

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


