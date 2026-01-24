const User = require('../models/User');
const axios = require('axios');

exports.getLogin = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('user/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: null
    });
};

exports.getSignup = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    res.render('user/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: null
    });
};

exports.postVerifyLogin = async (req, res) => {
    const { user_json_url } = req.body;
    try {
        const response = await axios.get(user_json_url);
        const { user_phone_number } = response.data;

        const user = await User.findOne({ phone: user_phone_number });

        if (!user) {
            return res.render('user/login', {
                pageTitle: 'Login',
                path: '/login',
                errorMessage: 'User not found. Please register first.'
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = {
            _id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            location: user.location,
            email: user.email,
            address: user.address
        };
        req.session.save(err => {
            if (err) console.log(err);
            res.redirect('/');
        });

    } catch (err) {
        console.error('Login verification error:', err);
        res.status(500).render('user/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: 'An error occurred during verification. Please try again.'
        });
    }
};

exports.postVerifySignup = async (req, res) => {
    const { name, location, user_json_url } = req.body;

    try {
        const response = await axios.get(user_json_url);
        const { user_phone_number } = response.data;

        const existingUser = await User.findOne({ phone: user_phone_number });
        if (existingUser) {
            return res.render('user/signup', {
                pageTitle: 'Signup',
                path: '/signup',
                errorMessage: 'User with this phone number already exists. Please login.'
            });
        }

        const user = new User({
            name,
            location,
            phone: user_phone_number
        });
        await user.save();

        req.session.isLoggedIn = true;
        req.session.user = {
            _id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            location: user.location,
            email: user.email,
            address: user.address
        };
        req.session.save(err => {
            if (err) console.log(err);
            res.redirect('/');
        });

    } catch (err) {
        console.error('Signup verification error:', err);
        res.status(500).render('user/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: 'An error occurred during signup. Please try again.'
        });
    }
};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        res.render('user/profile', {
            pageTitle: 'My Profile',
            path: '/profile',
            user: user,
            errorMessage: null,
            successMessage: null
        });
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.redirect('/');
    }
};

exports.postProfile = async (req, res) => {
    const { name, location, email, address } = req.body;

    try {
        const user = await User.findById(req.session.user._id);
        user.name = name;
        user.location = location;
        user.email = email;
        user.address = address;

        await user.save();

        // Update session user to reflect changes
        // Update session user to reflect changes
        req.session.user = {
            _id: user._id.toString(),
            name: user.name,
            phone: user.phone,
            location: user.location,
            email: user.email,
            address: user.address
        };

        res.render('user/profile', {
            pageTitle: 'My Profile',
            path: '/profile',
            user: user,
            errorMessage: null,
            successMessage: 'Profile updated successfully!'
        });

    } catch (err) {
        console.error('Error updating profile:', err);
        res.render('user/profile', {
            pageTitle: 'My Profile',
            path: '/profile',
            user: req.session.user,
            errorMessage: 'Failed to update profile. Please try again.',
            successMessage: null
        });
    }
};
