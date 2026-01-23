const express = require("express");
require('dotenv').config(); // Load environment variables
const rootDir = require("./utils/mainUtils");
const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODB_URI;
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const authRouter = require('./routes/authRouter');

const store = new MongoDBStore({
    uri: mongodbURL,
    collection: 'sessions'
});

store.on('error', function(error) {
    console.log('Session Store Error:', error);
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(rootDir, "views"));

app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}));

const cartMiddleware = require('./middleware/cartMiddleware');
app.use(cartMiddleware);

const { optimizeCloudinaryUrl } = require('./utils/urlHelper');

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.optimizeImage = optimizeCloudinaryUrl;
    next();
});

app.use('/admin', adminRouter);
app.use(authRouter);
app.use(userRouter);

// Push Notification Setup
// Push Notification Setup
const webpush = require('web-push');
const Subscription = require('./models/Subscription');

// Load VAPID keys
let vapidKeys;
try {
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
        vapidKeys = {
            publicKey: process.env.VAPID_PUBLIC_KEY,
            privateKey: process.env.VAPID_PRIVATE_KEY
        };
    } else {
        vapidKeys = require('./vapid.json');
    }
} catch (error) {
    console.error("VAPID Keys not found. Push notifications will not work.");
    vapidKeys = { publicKey: 'dummy', privateKey: 'dummy' };
}

webpush.setVapidDetails(
    'mailto:test@test.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

app.use(express.json()); // Handle JSON payloads for push subscription

app.post('/subscribe', async (req, res) => {
    const subscription = req.body;
    try {
        // Use findOneAndUpdate with upsert to prevent duplicates efficiently
        await Subscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            subscription,
            { upsert: true, new: true }
        );
        res.status(201).json({});
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription' });
    }
});

const port = process.env.PORT || 3002;

if (!mongodbURL) {
    console.error("FATAL ERROR: MONGODB_URI is not defined.");
    process.exit(1);
}

mongoose.connect(mongodbURL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server running on port : http://localhost:${port}`);
    });
}).catch((err) => {
    console.log(err);
});

module.exports = app;




