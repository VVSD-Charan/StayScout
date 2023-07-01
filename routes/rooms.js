const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {roomSchema} = require('../schemas.js');
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
}

//Handling get requests
router.get('/',catchAsync(async (req , res) => {
    const rooms = await Room.find();
    res.render('rooms/index',{rooms});
}));
router.get('/new',(req , res)=>{
    res.render('rooms/new');
});
router.get('/:id',catchAsync(async(req , res)=>{
    const room = await Room.findById(req.params.id).populate('reviews');
    res.render('rooms/show',{room});
}));
router.get('/:id/edit',catchAsync(async (req , res)=>{
    const room = await Room.findById(req.params.id);
    res.render('rooms/edit',{room});
}));

//Handle post requests
router.post('/',validateRoom,catchAsync(async(req , res , next)=>{
    const room = new Room(req.body.room);
    await room.save();
    res.redirect(`/rooms/${room._id}`);
}));

//Handle put requests
router.put('/:id', validateRoom ,catchAsync(async(req , res)=>{
    const {id}=req.params;
    const {title,location,image,price,description} = req.body.room;

    await Room.findByIdAndUpdate(id,{title,location,image,description,price},{new:true});
    res.redirect(`/rooms/${id}`);
}));

//Handle delete requests
router.delete('/:id',catchAsync(async ( req , res) =>{
    const {id} = req.params;
    await Room.findByIdAndDelete(id);
    res.redirect('/rooms');
}));

module.exports = router;


