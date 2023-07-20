const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateRoom} = require('../middleware');
const Room = require('../models/rooms');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    //Render all rooms
    .get(catchAsync(rooms.index))
    //Create a new room
    // .post(isLoggedIn,validateRoom,catchAsync(rooms.createRoom))
    .post(upload.array('image'),(req,res)=>{
        res.send(req.body, req.files);
    })

router.get('/new', isLoggedIn ,rooms.renderNewForm);

router.route('/:id')
    //Render room data
    .get(catchAsync(rooms.showRoom))
    //Update room data
    .put(isLoggedIn, isAuthor , validateRoom ,catchAsync(rooms.updateRoom))
    //Delete the room
    .delete(isLoggedIn,isAuthor ,catchAsync(rooms.deleteRoom))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(rooms.renderEditForm));

module.exports = router;


