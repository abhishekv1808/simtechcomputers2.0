const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    mrp: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        // required: true // Make optional for now to allow migration or fallback
    },
    images: {
        type: [String],
        default: []
    },
    category: {
        type: String,
        required: true,
        enum: ['laptop', 'desktop', 'monitor', 'accessory']
    },
    brand: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    inStock: {
        type: Boolean,
        default: true
    },
    quantity: {
        type: Number,
        default: 10
    },
    description: {
        type: String,
        default: "Premium refurbished product with warranty."
    },
    specifications: {
        processor: String,
        ram: String,
        storage: String,
        display: String,
        os: String,
        graphics: String,
        screenSize: String,
        refreshRate: String,
        panelType: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
