const express = require('express');
const userRouter = express.Router();
const { getHome, getContactUs, postContactUs, getAboutUs, getLaptops, getDesktops, getMonitors, getAccessories, getProductDetails, getCart, addToCart, removeFromCart, getBlogPost, getSearch, getBlogs } = require('../controllers/userController');
const { check } = require('express-validator');


userRouter.get('/', getHome);
userRouter.get('/search', getSearch);
userRouter.get('/contact-us', getContactUs);

userRouter.post('/contact-us', [
    check('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name must contain only alphabets'),
    check('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone('en-IN').withMessage('Please enter a valid 10-digit Indian phone number'),
    check('email')
        .trim()
        .optional({ checkFalsy: true })
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    check('message')
        .trim()
        .optional({ checkFalsy: true })
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters long if provided')
], postContactUs);
userRouter.get('/about-us', getAboutUs);
userRouter.get('/blogs', getBlogs);
userRouter.get('/laptops', getLaptops);
userRouter.get('/desktops', getDesktops);
userRouter.get('/monitors', getMonitors);
userRouter.get('/accessories', getAccessories);
userRouter.get('/product/:slug', getProductDetails);
userRouter.get('/blog/:id', getBlogPost);
userRouter.get('/cart', getCart);
userRouter.post('/cart', addToCart);
userRouter.post('/cart/delete', removeFromCart);
userRouter.post('/cart/update', require('../controllers/userController').updateCartQuantity);

module.exports = userRouter;