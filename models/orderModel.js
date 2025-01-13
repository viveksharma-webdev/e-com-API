const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Payment',
        required:true,
    }

},{timestamsp:true});


module.exports = mongoose.model('Order',orderSchema);