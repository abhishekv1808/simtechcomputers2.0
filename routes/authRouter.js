const express = require('express');
const authController = require('../controllers/authController');
const isUserAuth = require('../middleware/is-user-auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postVerifyLogin); // Adjusted to handle the post directly or via a specific verify route if needed

router.get('/signup', authController.getSignup);
router.post('/signup', authController.postVerifySignup);

router.post('/logout', authController.postLogout);

router.get('/profile', isUserAuth, authController.getProfile);
router.post('/profile', isUserAuth, authController.postProfile);

module.exports = router;
