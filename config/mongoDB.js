const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const connectDB = ()=>{
   try {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDB connected");
    }).catch((err)=>{
        console.log(err);
    })
   } catch (error) {
    console.lof("Error in connecting to MongoDB");
   }
}

module.exports = connectDB;