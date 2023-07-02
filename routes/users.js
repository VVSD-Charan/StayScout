const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

//Handle get requests
router.get('/register',(req , res)=>{
    res.render('users/register');
});

//Handle post requests
router.post('/register',catchAsync(async(req , res) =>{
   
    try{
        const {email,username,password}=req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);

        console.log(registeredUser);
        req.flash('success','Welcome to StayScout !');
    
        res.redirect('/rooms');
    }catch(err){
        req.flash('error',err.message);
        res.redirect('register');
    }
}));

module.exports=router;