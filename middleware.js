const {roomSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const Room = require('./models/rooms.js');

module.exports.isLoggedIn = (req , res , next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be logged!');
        return res.redirect('/login');
    }    
    next();
};

module.exports.storeReturnTo = (req , res , next) =>{
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateRoom = (req , res , next) =>
{
    const {error} = roomSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg,400);
    }else{
        next();
    }
};

module.exports.isAuthor = async(req , res , next) => {
    const {id} = req.params;
    const room = await Room.findById(id);

    if(req.user &&  !room.author.equals(req.user._id)){
        req.flash('error','Only owners can perform this action!');
        return res.redirect(`/rooms/${id}`);
    }
    next();
}