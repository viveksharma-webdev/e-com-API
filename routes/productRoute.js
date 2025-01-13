const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig.js');
const authMiddleware =require('../middleware/authMiddleware.js');

router.use(authMiddleware.isAuthenticated).use(authMiddleware.isSeller);


router.post('/create-product',upload.any(),productController);

module.exports= router;