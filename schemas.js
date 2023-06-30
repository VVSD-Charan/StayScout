 const Joi = require('joi');
 
 //Adding Joi validations
 module.exports.roomSchema = Joi.object({
    room : Joi.object({
        title : Joi.string().required(),
        price : Joi.number().required().min(0),
        image : Joi.string().required(),
        location: Joi.string().required(),
        description : Joi.string().required()
    }).required()
});