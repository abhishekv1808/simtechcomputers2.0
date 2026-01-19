const mongoose = require('mongoose');
const Product = require('../models/product');

const MONGODB_URI = "mongodb+srv://abhishekv1808:Grow%40%24%402025@aribnb.xvmlcnz.mongodb.net/simtech20?retryWrites=true&w=majority&appName=aribnb";

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const result = await Product.deleteMany({});
            console.log(`Deleted ${result.deletedCount} products.`);
        } catch (err) {
            console.error('Error deleting products:', err);
        } finally {
            mongoose.disconnect();
            console.log('Disconnected');
        }
    })
    .catch(err => console.error('Connection error:', err));
