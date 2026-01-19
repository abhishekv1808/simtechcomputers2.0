const express = require("express");
const rootDir = require("./utils/mainUtils");
const mongoose = require('mongoose');
const mongodbURL = "mongodb+srv://abhishekv1808:Grow%40%24%402025@aribnb.xvmlcnz.mongodb.net/simtech20?retryWrites=true&w=majority&appName=aribnb";
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(rootDir, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const cartMiddleware = require('./middleware/cartMiddleware');
app.use(cartMiddleware);

app.use('/admin', adminRouter);
app.use(userRouter);

const port = 3002;

mongoose.connect(mongodbURL).then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
        console.log(`Server running on port : http://localhost:${port}`);
    })
}).catch((err) => {
    console.log(err);
});


