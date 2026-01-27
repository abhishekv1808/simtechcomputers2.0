const express = require('express');
const userRouter = express.Router();
const { getHome, getContactUs, postContactUs, getAboutUs, getLaptops, getDesktops, getMonitors, getAccessories, getProductDetails, getCart, addToCart, removeFromCart, getBlogPost, getSearch, getBlogs } = require('../controllers/userController');
const { check } = require('express-validator');
const isUserAuth = require('../middleware/is-user-auth');


userRouter.get('/', getHome);
userRouter.get('/search', getSearch);
userRouter.get('/sitemap.xml', require('../controllers/userController').getSitemap);
userRouter.get('/privacy-policy', require('../controllers/userController').getPrivacyPolicy);
userRouter.get('/terms-and-conditions', require('../controllers/userController').getTermsConditions);
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
userRouter.get('/cart', isUserAuth, getCart);
userRouter.post('/cart', isUserAuth, addToCart);
userRouter.post('/cart/delete', isUserAuth, removeFromCart);
userRouter.post('/cart/update', isUserAuth, require('../controllers/userController').updateCartQuantity);

// Payment Routes
const paymentController = require('../controllers/paymentController');
userRouter.get('/checkout', isUserAuth, require('../controllers/userController').getCheckout);
userRouter.post('/create-order', isUserAuth, paymentController.createOrder);
userRouter.post('/verify-payment', isUserAuth, paymentController.verifyPayment);

module.exports = userRouter;