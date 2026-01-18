const express = require('express');
const userRouter = express.Router();
const { getHome, getContactUs, getAboutUs, getLaptops, getDesktops, getMonitors, getProductDetails, getCart } = require('../controllers/userController');


userRouter.get('/', getHome);
userRouter.get('/contact-us', getContactUs);
userRouter.get('/about-us', getAboutUs);
userRouter.get('/laptops', getLaptops);
userRouter.get('/desktops', getDesktops);
userRouter.get('/monitors', getMonitors);
userRouter.get('/product/:id', getProductDetails);
userRouter.get('/cart', getCart);

module.exports = userRouter;