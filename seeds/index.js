//Connecting to DB
const mongoose = require('mongoose');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
const Room = require('../models/rooms');

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

const sample = (array) => {
    return array[Math.floor(Math.random()*array.length)];
}

const seedDB = async () =>{
    await Room.deleteMany({});
    
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);

        const room = new Room({
            author : '64a12c22899f4a4029296b3b',
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title : `${sample(descriptors)} , ${sample(places)}`,
            image : 'https://source.unsplash.com/collection/483251',
            description : "Discover a wide range of available room rentals across diverse locations on our website.",
            price : 500
        })

        await room.save();
    }
};

seedDB().then(()=>{
    mongoose.connection.close();
});