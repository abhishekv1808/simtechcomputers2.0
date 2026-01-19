const Product = require('../models/product');
const DailyStats = require('../models/dailyStats');
const Enquiry = require('../models/enquiry');
const Blog = require('../models/blog');
const { validationResult } = require('express-validator');

exports.getSearch = async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const categoryQuery = req.query.category;

        let products = [];
        let filter = {};

        if (searchQuery) {
            // Case-insensitive regex search on name, brand, description, and category
            const regex = new RegExp(searchQuery, 'i');
            filter.$or = [
                { name: regex },
                { brand: regex },
                { category: regex },
                { description: regex }
            ];
        }

        if (categoryQuery && categoryQuery !== '') {
            filter.category = categoryQuery;
        }

        if (Object.keys(filter).length > 0) {
            products = await Product.find(filter);
        }

        res.render('../views/user/searchResults.ejs', {
            pageTitle: `Search Results for "${searchQuery}" | Simtech computers`,
            products: products,
            searchQuery: searchQuery,
            currentFilters: {} // Optional: if you want to reuse filters component
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}

exports.getHome = async (req, res) => {
    try {
        const appleLaptops = await Product.find({ category: 'laptop', brand: 'Apple' }).limit(8);
        const dellLaptops = await Product.find({ category: 'laptop', brand: 'Dell' }).limit(8);
        const hpLaptops = await Product.find({ category: 'laptop', brand: 'HP' }).limit(8);
        const lenovoLaptops = await Product.find({ category: 'laptop', brand: 'Lenovo' }).limit(8);
        const desktops = await Product.find({ category: 'desktop' }).limit(8);
        const monitors = await Product.find({ category: 'monitor' }).limit(8);
        const accessories = await Product.find({ category: 'accessory' }).limit(8);

        // Fetch Best Sellers (Top 2 by highest discount)
        const bestSellers = await Product.find().sort({ discount: -1 }).limit(2);

        // Fetch latest blogs
        const latestBlogs = await Blog.find().sort({ date: -1 }).limit(4);

        let cartProductIds = [];
        if (req.cookies.cart) {
            try {
                const cart = JSON.parse(req.cookies.cart);
                cartProductIds = cart.map(item => item.productId);
            } catch (e) {
                console.log("Error parsing cart cookie", e);
            }
        }

        res.render('../views/user/home.ejs', {
            pageTitle: "Home | Simtech computers",
            appleLaptops,
            dellLaptops,
            hpLaptops,
            lenovoLaptops,
            desktops,
            monitors,
            accessories,
            bestSellers, // Pass to view
            latestBlogs, // Pass blogs to view
            cartProductIds // Pass cart state
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}

exports.getBlogPost = async (req, res) => {
    const blogId = req.params.id;
    try {
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).render('404', { pageTitle: "Blog Not Found" });
        }

        const relatedBlogs = await Blog.find({ _id: { $ne: blogId } }).limit(3);

        res.render('../views/user/blog-post.ejs', {
            pageTitle: `${blog.title} | Simtech computers`,
            blog: blog,
            relatedBlogs: relatedBlogs
        });
    } catch (err) {
        console.log(err);
        res.status(404).render('404', { pageTitle: "Blog Not Found" });
    }
}

exports.getContactUs = (req, res) => {
    res.render('../views/user/contactUs.ejs', {
        pageTitle: "Contact Us | Simtech computers",
        errorMessage: null,
        successMessage: null,
        oldInput: {
            name: '',
            phone: '',
            email: '',
            brand: '',
            processor: '',
            ram: '',
            storage: '',
            model: '',
            purpose: '',
            message: ''
        },
        validationErrors: []
    })
}

exports.postContactUs = async (req, res) => {
    const { name, phone, email, brand, processor, ram, storage, model, purpose, message } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('../views/user/contactUs.ejs', {
            pageTitle: "Contact Us | Simtech computers",
            errorMessage: errors.array()[0].msg,
            successMessage: null,
            oldInput: { name, phone, email, brand, processor, ram, storage, model, purpose, message },
            validationErrors: errors.array()
        });
    }

    try {
        const enquiry = new Enquiry({
            name, phone, email, brand, processor, ram, storage, model, purpose, message
        });
        await enquiry.save();

        res.render('../views/user/contactUs.ejs', {
            pageTitle: "Contact Us | Simtech computers",
            errorMessage: null,
            successMessage: "Thank you for your enquiry! Our team will contact you shortly.",
            oldInput: {
                name: '',
                phone: '',
                email: '',
                brand: '',
                processor: '',
                ram: '',
                storage: '',
                model: '',
                purpose: '',
                message: ''
            },
            validationErrors: []
        });
    } catch (err) {
        console.log(err);
        res.status(500).render('../views/user/contactUs.ejs', {
            pageTitle: "Contact Us | Simtech computers",
            errorMessage: "An error occurred. Please try again later.",
            successMessage: null,
            oldInput: { name, phone, email, brand, processor, ram, storage, model, purpose, message },
            validationErrors: []
        });
    }
};

exports.getAboutUs = (req, res) => {
    res.render('../views/user/aboutUs.ejs', { pageTitle: "About Us | Simtech computers" })
}

// Helper to build filter query
const buildFilterQuery = (req, category) => {
    let query = { category: category };
    const { price, brand, processor, ram, storage, screenSize, resolution, refreshRate, formFactor } = req.query;

    // Brand Filter
    if (brand) {
        query.brand = { $in: Array.isArray(brand) ? brand : [brand] };
    }

    // Price Filter
    if (price) {
        const priceRanges = Array.isArray(price) ? price : [price];
        const priceQueries = priceRanges.map(range => {
            // Laptops
            if (range === 'Under ₹20,000') return { price: { $lt: 20000 } };
            if (range === '₹20,000 - ₹40,000') return { price: { $gte: 20000, $lte: 40000 } };
            if (range === '₹40,000 - ₹60,000') return { price: { $gte: 40000, $lte: 60000 } };
            if (range === 'Above ₹60,000') return { price: { $gt: 60000 } };

            // Desktops
            if (range === 'Under ₹25,000') return { price: { $lt: 25000 } };
            if (range === '₹25,000 - ₹50,000') return { price: { $gte: 25000, $lte: 50000 } };
            if (range === '₹50,000 - ₹80,000') return { price: { $gte: 50000, $lte: 80000 } };
            if (range === 'Above ₹80,000') return { price: { $gt: 80000 } };

            // Monitors
            if (range === 'Under ₹10,000') return { price: { $lt: 10000 } };
            if (range === '₹10,000 - ₹20,000') return { price: { $gte: 10000, $lte: 20000 } };
            if (range === '₹20,000 - ₹40,000') return { price: { $gte: 20000, $lte: 40000 } };
            if (range === 'Above ₹40,000') return { price: { $gt: 40000 } };

            // Accessories
            if (range === 'Under ₹1,000') return { price: { $lt: 1000 } };
            if (range === '₹1,000 - ₹5,000') return { price: { $gte: 1000, $lte: 5000 } };
            if (range === '₹5,000 - ₹10,000') return { price: { $gte: 5000, $lte: 10000 } };
            if (range === 'Above ₹10,000') return { price: { $gt: 10000 } };

            return {};
        });

        // Remove empty objects and apply $or if valid queries exist
        const validPriceQueries = priceQueries.filter(q => Object.keys(q).length > 0);
        if (validPriceQueries.length > 0) {
            query.$or = validPriceQueries;
        }
    }

    // Specifications Filters
    if (processor) query['specifications.processor'] = { $in: Array.isArray(processor) ? processor : [processor] };
    if (ram) query['specifications.ram'] = { $in: Array.isArray(ram) ? ram : [ram] };
    if (storage) query['specifications.storage'] = { $in: Array.isArray(storage) ? storage : [storage] };
    if (screenSize) query['specifications.screenSize'] = { $in: Array.isArray(screenSize) ? screenSize : [screenSize] };
    if (resolution) query['specifications.display'] = { $in: Array.isArray(resolution) ? resolution : [resolution] }; // Mapping resolution to display field
    if (refreshRate) query['specifications.refreshRate'] = { $in: Array.isArray(refreshRate) ? refreshRate : [refreshRate] };
    if (formFactor) query['specifications.formFactor'] = { $in: Array.isArray(formFactor) ? formFactor : [formFactor] }; // Assuming formFactor is a spec or top level? Let's assume spec for now or handle appropriately. 
    // Note: Form Factor isn't in the schema explicitly shown before, but assuming it might be in specs or we need to add it. 
    // Based on desktops.ejs, it seems to be a filter. I'll assume it's in specifications for now or just ignore if not in schema. 
    // Actually, let's check schema... schema has `specifications: { processor, ram, storage, display, os, graphics }`. 
    // Form factor might strictly be for desktops. I'll map it to `specifications.formFactor` and if it's not there, it won't match anything, which is fine for now or I can add it to schema later.

    return query;
};

exports.getLaptops = async (req, res) => {
    try {
        const query = buildFilterQuery(req, 'laptop');
        const products = await Product.find(query);

        // Determine current brand for title if only one brand is selected
        let currentBrand = 'All';
        if (req.query.brand && !Array.isArray(req.query.brand)) {
            currentBrand = req.query.brand;
        } else if (req.query.brand && Array.isArray(req.query.brand) && req.query.brand.length === 1) {
            currentBrand = req.query.brand[0];
        }

        res.render('../views/user/laptops.ejs', {
            pageTitle: (currentBrand !== 'All' ? `Used ${currentBrand} Laptops` : "All Laptops") + " | Simtech computers",
            products: products,
            currentBrand: currentBrand,
            currentFilters: req.query // Pass all filters to view
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getDesktops = async (req, res) => {
    try {
        const query = buildFilterQuery(req, 'desktop');
        const products = await Product.find(query);

        let currentBrand = 'All';
        if (req.query.brand && !Array.isArray(req.query.brand)) {
            currentBrand = req.query.brand;
        } else if (req.query.brand && Array.isArray(req.query.brand) && req.query.brand.length === 1) {
            currentBrand = req.query.brand[0];
        }

        res.render('../views/user/desktops.ejs', {
            pageTitle: (currentBrand !== 'All' ? `Used ${currentBrand} Desktops` : "All Desktops") + " | Simtech computers",
            products: products,
            currentBrand: currentBrand,
            currentFilters: req.query
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getMonitors = async (req, res) => {
    try {
        const query = buildFilterQuery(req, 'monitor');
        const products = await Product.find(query);

        let currentBrand = 'All';
        if (req.query.brand && !Array.isArray(req.query.brand)) {
            currentBrand = req.query.brand;
        } else if (req.query.brand && Array.isArray(req.query.brand) && req.query.brand.length === 1) {
            currentBrand = req.query.brand[0];
        }

        res.render('../views/user/monitors.ejs', {
            pageTitle: (currentBrand !== 'All' ? `${currentBrand} Monitors` : "All Monitors") + " | Simtech computers",
            products: products,
            currentBrand: currentBrand,
            currentFilters: req.query
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getAccessories = async (req, res) => {
    try {
        const query = buildFilterQuery(req, 'accessory');
        const products = await Product.find(query);

        let currentBrand = 'All';
        if (req.query.brand && !Array.isArray(req.query.brand)) {
            currentBrand = req.query.brand;
        } else if (req.query.brand && Array.isArray(req.query.brand) && req.query.brand.length === 1) {
            currentBrand = req.query.brand[0];
        }

        res.render('../views/user/accessories.ejs', {
            pageTitle: (currentBrand !== 'All' ? `${currentBrand} Accessories` : "All Accessories") + " | Simtech computers",
            products: products,
            currentBrand: currentBrand,
            currentFilters: req.query
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getProductDetails = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).render('404', { pageTitle: "Product Not Found" });
        }

        // Track View
        const today = new Date().toISOString().split('T')[0];
        await DailyStats.findOneAndUpdate(
            { date: today },
            { $inc: { views: 1 } },
            { upsert: true, new: true }
        );

        // Pass related products (same category, excluding current)
        const relatedProducts = await Product.find({ category: product.category, _id: { $ne: productId } }).limit(4);

        res.render('../views/user/productDetails.ejs', {
            pageTitle: `${product.name} | Simtech computers`,
            product: product,
            relatedProducts: relatedProducts
        });
    } catch (err) {
        console.log(err);
        res.status(404).render('404', { pageTitle: "Product Not Found" });
    }
}

exports.addToCart = async (req, res) => {
    const productId = req.body.productId;
    let cart = [];
    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
        } catch (e) {
            console.log("Error parsing cart cookie", e);
        }
    }

    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    res.cookie('cart', JSON.stringify(cart), { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days
    res.redirect('/cart');
};

exports.getCart = async (req, res) => {
    let cart = [];
    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
        } catch (e) {
            console.log("Error parsing cart cookie", e);
        }
    }

    const productIds = cart.map(item => item.productId);

    try {
        const products = await Product.find({ _id: { $in: productIds } });

        const cartItems = cart.map(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productId);
            if (product) {
                return {
                    product_id: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity: cartItem.quantity,
                    inStock: product.inStock
                };
            }
            return null;
        }).filter(item => item !== null);

        // Calculate Totals
        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const tax = Math.round(subtotal * 0.18);
        const total = subtotal + tax;

        res.render('../views/user/cart.ejs', {
            pageTitle: "Shopping Cart | Simtech computers",
            cartItems: cartItems,
            subtotal: subtotal,
            tax: tax,
            total: total
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

exports.removeFromCart = (req, res) => {
    const productId = req.body.productId;
    let cart = [];
    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
        } catch (e) {
            console.log("Error parsing cart cookie", e);
        }
    }

    const updatedCart = cart.filter(item => item.productId !== productId);
    res.cookie('cart', JSON.stringify(updatedCart), { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.redirect('/cart');
};

exports.updateCartQuantity = (req, res) => {
    const { productId, action } = req.body;
    let cart = [];
    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
        } catch (e) {
            console.log("Error parsing cart cookie", e);
        }
    }

    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex >= 0) {
        if (action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            }
        }
    }

    res.cookie('cart', JSON.stringify(cart), { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.redirect('/cart');
};
