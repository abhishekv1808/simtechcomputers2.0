const express = require("express");
const rootDir = require("./utils/mainUtils");
const mongoose = require('mongoose');
const mongodbURL = "mongodb+srv://abhishekv1808:Grow%40%24%402025@aribnb.xvmlcnz.mongodb.net/simtech20?retryWrites=true&w=majority&appName=aribnb";
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

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

const cartMiddleware = require('./middleware/cartMiddleware');
app.use(cartMiddleware);

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use('/admin', adminRouter);
app.use(authRouter);
app.use(userRouter);

// Push Notification Setup
const webpush = require('web-push');
const Subscription = require('./models/Subscription');
// Load VAPID keys (in production, use environment variables)
const vapidKeys = require('./vapid.json');

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

const port = 3002;

mongoose.connect(mongodbURL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server running on port : http://localhost:${port}`);
    })
}).catch((err) => {
    console.log(err);
});




