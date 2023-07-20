const Room = require('../models/rooms');

module.exports.index = async (req , res) => {
    const rooms = await Room.find();
    res.render('rooms/index',{rooms});
};

module.exports.renderNewForm = (req , res)=>{
    res.render('rooms/new');
};

module.exports.createRoom = async(req , res)=>{
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