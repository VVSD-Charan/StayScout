const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const {storeReturnTo} =require('../middleware');
const passport = require('passport');
const users = require('../controllers/users');


//Handle get requests
//GET register page
router.get('/register',users.renderRegister);

//Handle post requests
//Register new user
router.post('/register',catchAsync(users.register));

//GET login page
router.get('/login', users.renderLogin);

//Login validation
router.post('/login',storeReturnTo,passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}) , users.login);

//Logout user
router.get('/logout',users.logout);
module.exports=router;