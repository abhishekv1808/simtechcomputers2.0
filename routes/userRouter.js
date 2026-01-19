const express = require('express');
const userRouter = express.Router();
const { getHome, getContactUs, postContactUs, getAboutUs, getLaptops, getDesktops, getMonitors, getAccessories, getProductDetails, getCart, addToCart, removeFromCart } = require('../controllers/userController');
const { check } = require('express-validator');


userRouter.get('/', getHome);
userRouter.get('/contact-us', getContactUs);

userRouter.post('/contact-us', [
    check('name').notEmpty().withMessage('Name is required'),
    check('phone').notEmpty().withMessage('Phone number is required').isMobilePhone().withMessage('Invalid phone number'),
    check('email').optional({ checkFalsy: true }).isEmail().withMessage('Invalid email address')
], postContactUs);
userRouter.get('/about-us', getAboutUs);
userRouter.get('/laptops', getLaptops);
userRouter.get('/desktops', getDesktops);
userRouter.get('/monitors', getMonitors);
userRouter.get('/accessories', getAccessories);
userRouter.get('/product/:id', getProductDetails);
userRouter.get('/cart', getCart);
userRouter.post('/cart', addToCart);
userRouter.post('/cart/delete', removeFromCart);
userRouter.post('/cart/update', require('../controllers/userController').updateCartQuantity);

module.exports = userRouter;