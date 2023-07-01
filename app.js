const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const rooms = require('./routes/rooms');
const reviews = require('./routes/reviews');

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
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret : 'eggisveg',
    resave : false,
    saveUninitialized : true
}
app.use(session(sessionConfig ));

app.use('/rooms',rooms);
app.use('/rooms/:id/reviews',reviews);

//Handle get requests
app.get('/',(req , res)=>{
    res.render('home');
});

//If none of urls match then send 404 page not found page
app.all('*',(req , res , next)=>{
    next(new ExpressError('Page Not Found',404));
});

//Validate forms
app.use((err , req , res , next)=>{

    const {statusCode=500} = err;
    if(!err.message){
        err.message='Something went wrong!';
    }

    res.status(statusCode).render('error' , {err});
});

//Start server
app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("Serving on port 3000");
});