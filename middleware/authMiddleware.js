const userModel = require('../models/userModel.js');
const blackList = require('../models/blacklistModel.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// checks whether the user is authenticated or not
module.exports.isAuthenticated = async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];

        const isBlackListed = await blackList.findOne({token: token});

        if(isBlackListed){
            return res.status(401).json({message:'unauthorized'});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await userModel.findById(decoded._id);

        if(!user){
            return res.status(400).json({message: 'Invalid token'});
        };
       
        req.user = user;
        next();

    }catch(err){
      next(err);
    }
};

// checks whether the user is  Seller or just a buyer
module.exports.isSeller = async (req,res,next)=>{
    try {
        const user = req.user;
        if(user.role!=='seller'){
          return res.status(400).json({message:'Unauthenticated'});
        }
        next();
    } catch (error) {
        next(error);
    }
}