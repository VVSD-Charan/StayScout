const Room = require('../models/rooms');

//Render all rooms data
module.exports.index = async (req , res) => {
    const rooms = await Room.find();
    res.render('rooms/index',{rooms});
};

//Render add room form
module.exports.renderNewForm = (req , res)=>{
    res.render('rooms/new');
};

//Create a new room
module.exports.createRoom = async(req , res , next)=>{
    const room = new Room(req.body.room);
    room.author = req.user._id;
    await room.save();
    req.flash('success','Successfully made a new rental house');
    res.redirect(`/rooms/${room._id}`);
};

//Render room data
module.exports.showRoom = async(req , res)=>{
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
};

//Render edit room form
module.exports.renderEditForm = async (req , res)=>{
    const room = await Room.findById(req.params.id);

    if(!room){
        req.flash('error','Cannot find that room');
        return res.redirect('/rooms');
    }
    res.render('rooms/edit',{room});
};

//Update room data
module.exports.updateRoom = async(req , res)=>{
    const {id}=req.params;
    const room = await Room.findById(id);

    const {title,location,image,price,description} = req.body.room;

    await Room.findByIdAndUpdate(id,{title,location,image,description,price},{new:true});
    req.flash('success','Successfully updated room details!');
    res.redirect(`/rooms/${id}`);
};

//Delete room
module.exports.deleteRoom = async ( req , res) =>{
    const {id} = req.params;
    await Room.findByIdAndDelete(id);

    req.flash('success','Room has been deleted successfully');
    res.redirect('/rooms');
};