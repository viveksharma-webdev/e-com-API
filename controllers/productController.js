const productModel = require('../models/productModel.js');

module.exports.createProduct =async (req,res,next)=>{
    try {
        const {name,description,price} = req.body;

        const images = req.files.map(file=> file.publicUrl).filter(url=> url ? true : false);

        if(!name || !description || !price) return res.status(400).json({message:"All fields are required"});

        const product = await productModel.create({
            name,
            description,
            image: images,
            price,
            seller: req.user._id,
        });
     res.status(200).json({message: "product created successfully", product});

    } catch (error) {
     next(error);   
    }
}