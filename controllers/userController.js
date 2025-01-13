const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const blackListModel = require('../models/blacklistModel.js');
const productModel = require('../models/productModel.js');
const paymentModel = require('../models/paymentModel.js');
const orderModel = require('../models/orderModel.js');




const razorpay = require('razorpay');

var instance = new razorpay({
    key_id: process.env.RZPAY_ID,
    key_secret: process.env.RZPAY_KEY_SECRET
});

// Authentication logic for user
module.exports.signup = async(req,res,next)=>{
    try{

        const{email,password,username,role}= req.body;

        // check if fields are missing or not
        if (!password) return res.status(400).json({ message: "Password is required" });
        if (!email) return res.status(400).json({ message: "Email is required" });
        if (!username) return res.status(400).json({ message: "Username is required" });

        // check if user already exists or not 
        const isUserAlreadyExist = await userModel.findOne({email:email});

        if(isUserAlreadyExist){
            return res.status(400).json({message:"User already exists"});
        }

        //if before conditions are met then now hass a password

        const hassedPassword = await bcrypt.hash(password,10);

        const user = await userModel.create({
            email,
            password:hassedPassword,
            username,
            role
        });

        // create a token for keeping user logedIn

        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn:"1h"});

        res.status(201).json({
            message:"User created successfully",
            user:user,
            token:token
        })

    }catch(err){
        next(err);
    }
};

module.exports.signin = async(req,res,next)=>{
    try {
        const {email, password,} = req.body;

        if(!email || !password){
            return res.status(400).json({
                message: " Please enter all the details"
            });
        };

        const user = await userModel.findOne({email:email});
        
        if(!user){
            return res.status(401).json({
                message:" user does not exist, please signup first"
            });
        };

        const isPasswordCorrect = await bcrypt.compare(password,user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({
                message:"Incorrect password"
            });
        };
        
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.status(200).json({
            message:"User signed in successfully",
            user:user,
            token:token
        })
        
    } catch (error) {
        next(error);
    }
};

module.exports.signout = async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split('')[1];

        if(!token){
            return res.status(401).json({
                message: "Token is required"
            });
        };

        // check if token is already blacklisted or not

        const isBlackListed = await blackListModelfindOne({token:token});

        if(isBlackListed){
            return res.status(401).json({
                message:"Token is blackListed already"
            });
        };

        // if not then create a token
        await blackListModel.create({token});

    }catch(error){
      next(error);
    }

};

module.exports.getProfile =async(req,res,next)=>{
    try {
        const user = await userModel.findById({_id:req.user._id});
        res.status(200).json({
            message:"user fetched successfully",
            user:user
        });
    } catch (error) {
        next(error);
    }
}

module.exports.getProducts = async(req,res,next)=>{
    try {
        const products = await productModel.find({});

        if(!products){
            return res.status(404).json({message:"Something went wrong"})
        };

        res.status(200).json({message:"Products list initiated",
            products
        });
        
    } catch (error) {
        next(error);
    }
}

module.exports.getProductById = async (req,res,next)=>{
    try {
        const product = await productModel.findById(req.params.id);

        if(!product){
            return res.status(404).json({message:"product is out of stock"})
        };

        res.status(200).json({message:"product by id"},
            product
        );
        
    } catch (error) {
        next(error);
    }
}


module.exports.createOrder = async (req,res,next)=>{
    try {
        const product = await productModel.findById(req.params.id);
        const option = {
            amount: product.amount*100,
            currency: "INR",
            receipt:product._id,
        }

        const order = await instance.orders.create(option);

        res.send(200).json(order);

        const payment = await paymentModel.create({
            order_id:order.id,
            amount:product.amount,
            currency:"INR",
            status: "pending"
        })

    } catch (error) {
        next(error);
    }
}

module.exports.verifyPayment = async (req,res,next)=>{
    try {
      const {orderId,paymentId,signature} = req.body;
      const secret = process.env.RZPAY_KEY_SECRET;

      const {validatePaymentVerification}= require('../node_modules/razorpay/dist/utils/razorpay-utils.js');

      const isValidate = validatePaymentVerification({
        payment_id: paymentId,
        order_id: orderId
      }, signature, secret);

      if(isValidate){
        
        const payment = await paymentModel.findOne({orderId: orderId});

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = "success";

        await payment.save();

        res.status(200).json({message: " payment successfull"});

      }else{

        const payment = await paymentModel.findOne({orderId: orderId});

        payment.status = "failed";
        await payment.save();

        res.status(400).json({message: "payment failed"});
      }
      
    } catch (error) {
        next(error);
    }
}