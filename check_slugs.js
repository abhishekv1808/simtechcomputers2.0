require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        const products = await Product.find({}, 'name slug');
        console.log('--- Product Slugs ---');
        products.forEach(p => {
            console.log(`Name: ${p.name.substring(0, 30)}... | Slug: ${p.slug}`);
        });
        console.log('---------------------');
        process.exit(0);
    })
    .catch(err => {
        console.log(err);
        process.exit(1);
    });
