const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Room = require('./models/rooms');

//Connecting to DB
mongoose.connect('mongodb://127.0.0.1:27017/StayScout',{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

//Check if connection is successful
const db = mongoose.connection;
db.on("error",console.error.bind(console,"Connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const app = express();

//Set paths and view engine
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


//Handle get requests
app.get('/',(req , res)=>{
    res.render('home');
});
app.get('/rooms',async (req , res) => {
    const rooms = await Room.find();
    res.render('rooms/index',{rooms});
});
app.get('/rooms/new',(req , res)=>{
    res.render('rooms/new');
});
app.get('/rooms/:id',async(req , res)=>{
    const room = await Room.findById(req.params.id);
    res.render('rooms/show',{room});
});
app.get('/rooms/:id/edit',async (req , res)=>{
    const room = await Room.findById(req.params.id);
    res.render('rooms/edit',{room});
});


//Handle post requests
app.post('/rooms',async(req , res , next)=>{
    try{
        const room = new Room(req.body.room);
        await room.save();
        res.redirect(`/rooms/${room._id}`);
    }catch(e){
        next(e);
    }
});


//Handle put requests
app.put('/rooms/:id',async(req , res)=>{
    const {id}=req.params;
    const {title,location,image,price,description} = req.body.room;

    await Room.findByIdAndUpdate(id,{title,location,image,description,price},{new:true});
    res.redirect(`/rooms/${id}`);
});

// Handle delete requests
app.delete('/rooms/:id',async ( req , res) =>{
    const {id} = req.params;
    await Room.findByIdAndDelete(id);
    res.redirect('/rooms');
});

//Validate forms
app.use((err , req , res , next)=>{
    res.send('Oh boy! something went wrong');
});

//Start server
app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Serving on port 3000");
});