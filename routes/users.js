const express = require('express');
const router = express.Router();
const User = require('../models/user');

//Handle get requests
router.get('/register',(req , res)=>{
    res.render('users/register');
});

//Handle post requests
router.post('/register',async(req , res) =>{
    res.send(req.body);
});

module.exports=router;