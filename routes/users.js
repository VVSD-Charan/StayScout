const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const passport = require('passport');

// --------------------------- User Register ---------
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

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }else{
                req.flash('success','Welcome to StayScout !');
                res.redirect('/rooms');
            }
        });
    }catch(err){
        req.flash('error',err.message);
        res.redirect('register');
    }
}));

//------------------ User login ------------- 

router.get('/login',(req , res)=>{
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}) ,(req , res)=>{
    req.flash('success','Welcome back!');
    res.redirect('/rooms');
});

router.get('/logout',(req , res , next)=>{
    req.logOut(function(err){
        if(err){
            return next(err);
        }else{
            req.flash('success','Logged out successfully');
            res.redirect('/rooms');
        }
    });
});
module.exports=router;