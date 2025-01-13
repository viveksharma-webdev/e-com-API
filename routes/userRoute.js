const express =  require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/signout', userController.signout);

router.get('/profile',authMiddleware.isAuthenticated ,userController.getProfile);
router.get('/products', authMiddleware.isAuthenticated ,userController.getProducts);
router.get('/products/:id', authMiddleware.isAuthenticated , userController.getProductById);

router.get('/order/:id', authMiddleware.isAuthenticated , userController.createOrder);
router.get('/verify/:id', authMiddleware.isAuthenticated , userController.verifyPayment);


module.exports = router;