require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');
const crypto = require('crypto');

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB for migration');
        migrateProducts();
    })
    .catch(err => console.log(err));

const generateSlug = (name) => {
    return name
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        + '-' + crypto.randomBytes(3).toString('hex'); // Add random suffix
};

async function migrateProducts() {
    try {
        const products = await Product.find({ slug: { $exists: false } });
        console.log(`Found ${products.length} products to migrate.`);

        for (const product of products) {
            const slug = generateSlug(product.name);
            product.slug = slug;
            await product.save();
            console.log(`Updated ${product.name} -> ${slug}`);
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}
