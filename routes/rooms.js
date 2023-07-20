const express = require('express');
const router = express.Router();
const rooms = require('../controllers/rooms');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,isAuthor,validateRoom} = require('../middleware');
const Room = require('../models/rooms');


//Render all rooms
router.get('/',catchAsync(rooms.index)); 
//Render new room Form
router.get('/new', isLoggedIn ,rooms.renderNewForm);
//Render room data
router.get('/:id',catchAsync(rooms.showRoom));
//Render Edit Form
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(rooms.renderEditForm));


//Handle post requests
//Handling create room post request
router.post('/',isLoggedIn,validateRoom,catchAsync(rooms.createRoom));

//Handle put requests
router.put('/:id',isLoggedIn, isAuthor , validateRoom ,catchAsync(rooms.updateRoom));

//Handle delete requests
//Delete room
router.delete('/:id',isLoggedIn,isAuthor ,catchAsync(rooms.deleteRoom));

module.exports = router;


