const { validationResult } = require('express-validator');
const Product = require('../models/product');
const DailyStats = require('../models/dailyStats');
const Enquiry = require('../models/enquiry');
const Subscription = require('../models/Subscription');
const webpush = require('web-push');

exports.getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const outputOfStock = await Product.countDocuments({ stock: 0 });
        const enquiryCount = await Enquiry.countDocuments();

        // Calculate category counts
        const categoryCounts = {
            laptop: await Product.countDocuments({ category: 'laptop' }),
            desktop: await Product.countDocuments({ category: 'desktop' }),
            monitor: await Product.countDocuments({ category: 'monitor' })
        };

        // Get recent 5 products
        const recentProducts = await Product.find().sort({ _id: -1 }).limit(5);

        // Get chart data (last 7 days)
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push(d.toISOString().split('T')[0]);
        }

        const chartData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Placeholder labels
            sales: [12, 19, 3, 5, 2, 3, 10], // Placeholder data
            views: [20, 25, 10, 15, 8, 12, 22] // Placeholder data
        };

        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            path: '/admin/dashboard',
            totalProducts: totalProducts,
            outputOfStock: outputOfStock,
            enquiryCount: enquiryCount,
            categoryCounts: categoryCounts,
            recentProducts: recentProducts,
            chartData: chartData
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', {
            pageTitle: 'Admin Inventory',
            path: '/admin/products',
            products: products
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ date: -1 });
        res.render('admin/enquiries', {
            pageTitle: 'Customer Enquiries',
            path: '/admin/enquiries',
            enquiries: enquiries
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/dashboard');
    }
};

exports.postResolveEnquiry = async (req, res) => {
    const enquiryId = req.body.enquiryId;
    try {
        await Enquiry.findByIdAndDelete(enquiryId);
        res.redirect('/admin/enquiries');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/enquiries');
    }
};

// --- Laptop ---
exports.getAddLaptop = (req, res) => {
    res.render('admin/add-laptop', {
        pageTitle: 'Add Laptop',
        path: '/admin/add-laptop',
        errorMessage: null,
        oldInput: { name: '', price: '', mrp: '', image: '', brand: '', quantity: '', description: '', processor: '', ram: '', storage: '', display: '', os: '', graphics: '' }
    });
};

exports.postAddLaptop = async (req, res) => {
    const { name, price, mrp, brand, quantity, description, processor, ram, storage, display, os, graphics } = req.body;
    const images = req.files; // Files from multer array
    const errors = validationResult(req);

    if (!images || images.length === 0) {
        return res.status(422).render('admin/add-laptop', {
            pageTitle: 'Add Laptop',
            path: '/admin/add-laptop',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, brand, quantity, description, processor, ram, storage, display, os, graphics }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-laptop', {
            pageTitle: 'Add Laptop',
            path: '/admin/add-laptop',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, brand, quantity, description, processor, ram, storage, display, os, graphics }
        });
    }

    const imageUrls = images.map(f => f.path); // Cloudinary URLs

    const discount = Math.round(((mrp - price) / mrp) * 100);

    try {
        const product = new Product({
            name, price, mrp, discount, images: imageUrls, image: imageUrls[0], category: 'laptop', brand, quantity, description,
            inStock: quantity > 0,
            specifications: { processor, ram, storage, display, os, graphics }
        });
        await product.save();
        console.log('Created Laptop');

        // Push Notification logic removed as per request to avoid spamming users when adding multiple products.
        // Admins can now manually send notifications via the "Send Notification" page.

        res.redirect('/admin/products?success=true');
    } catch (err) {
        console.log(err);
    }
};

// --- Monitor ---
exports.getAddMonitor = (req, res) => {
    res.render('admin/add-monitor', {
        pageTitle: 'Add Monitor',
        path: '/admin/add-monitor',
        errorMessage: null,
        oldInput: { name: '', price: '', mrp: '', image: '', brand: '', quantity: '', description: '', screenSize: '', panelType: '', refreshRate: '', display: '' }
    });
};

exports.postAddMonitor = async (req, res) => {
    const { name, price, mrp, brand, quantity, description, screenSize, panelType, refreshRate, display } = req.body;
    const images = req.files;
    const errors = validationResult(req);

    if (!images || images.length === 0) {
        return res.status(422).render('admin/add-monitor', {
            pageTitle: 'Add Monitor',
            path: '/admin/add-monitor',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, brand, quantity, description, screenSize, panelType, refreshRate, display }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-monitor', {
            pageTitle: 'Add Monitor',
            path: '/admin/add-monitor',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, brand, quantity, description, screenSize, panelType, refreshRate, display }
        });
    }

    const imageUrls = images.map(f => f.path);

    const discount = Math.round(((mrp - price) / mrp) * 100);

    try {
        const product = new Product({
            name, price, mrp, discount, images: imageUrls, image: imageUrls[0], category: 'monitor', brand, quantity, description,
            inStock: quantity > 0,
            specifications: { screenSize, panelType, refreshRate, display } // display as resolution
        });
        await product.save();
        console.log('Created Monitor');
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
};

// --- Desktop ---
exports.getAddDesktop = (req, res) => {
    res.render('admin/add-desktop', {
        pageTitle: 'Add Desktop',
        path: '/admin/add-desktop',
        errorMessage: null,
        oldInput: { name: '', price: '', mrp: '', image: '', brand: '', quantity: '', description: '', processor: '', ram: '', storage: '', graphics: '', os: '' }
    });
};

exports.postAddDesktop = async (req, res) => {
    const { name, price, mrp, brand, quantity, description, processor, ram, storage, graphics, os } = req.body;
    const images = req.files;
    const errors = validationResult(req);

    if (!images || images.length === 0) {
        return res.status(422).render('admin/add-desktop', {
            pageTitle: 'Add Desktop',
            path: '/admin/add-desktop',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, brand, quantity, description, processor, ram, storage, graphics, os }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-desktop', {
            pageTitle: 'Add Desktop',
            path: '/admin/add-desktop',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, brand, quantity, description, processor, ram, storage, graphics, os }
        });
    }

    const imageUrls = images.map(f => f.path);

    const discount = Math.round(((mrp - price) / mrp) * 100);

    try {
        const product = new Product({
            name, price, mrp, discount, images: imageUrls, image: imageUrls[0], category: 'desktop', brand, quantity, description,
            inStock: quantity > 0,
            specifications: { processor, ram, storage, graphics, os }
        });
        await product.save();
        console.log('Created Desktop');
    } catch (err) {
        console.log(err);
    }
};

// --- Accessories ---
exports.getAddAccessories = (req, res) => {
    res.render('admin/add-accessories', {
        pageTitle: 'Add Accessories',
        path: '/admin/add-accessories',
        errorMessage: null,
        oldInput: { name: '', price: '', mrp: '', image: '', brand: '', quantity: '', description: '' }
    });
};

exports.postAddAccessories = async (req, res) => {
    const { name, price, mrp, brand, quantity, description } = req.body;
    const images = req.files;
    const errors = validationResult(req);

    if (!images || images.length === 0) {
        return res.status(422).render('admin/add-accessories', {
            pageTitle: 'Add Accessories',
            path: '/admin/add-accessories',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, brand, quantity, description }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-accessories', {
            pageTitle: 'Add Accessories',
            path: '/admin/add-accessories',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, brand, quantity, description }
        });
    }

    const imageUrls = images.map(f => f.path);
    const discount = Math.round(((mrp - price) / mrp) * 100);

    try {
        const product = new Product({
            name, price, mrp, discount, images: imageUrls, image: imageUrls[0], category: 'accessory', brand, quantity, description,
            inStock: quantity > 0,
            specifications: {} // No specific specs for now, or add if needed
        });
        await product.save();
        console.log('Created Accessory');
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
};

// exports.getAddProduct = ... (Removed/Replaced)
// exports.postAddProduct = ... (Removed/Replaced)

exports.getEditProduct = async (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.redirect('/');
        }

        // Flatten product data for oldInput to match the view's expectation
        const oldInput = {
            name: product.name,
            price: product.price,
            mrp: product.mrp,
            // discount: product.discount, // No longer needed in oldInput for edit view if field is removed
            image: product.image,
            brand: product.brand,
            quantity: product.quantity,
            description: product.description,
            ...product.specifications // Spread specs into oldInput
        };

        let viewPath = 'admin/edit-product'; // Fallback
        if (product.category === 'laptop') viewPath = 'admin/edit-laptop';
        if (product.category === 'monitor') viewPath = 'admin/edit-monitor';
        if (product.category === 'desktop') viewPath = 'admin/edit-desktop';

        res.render(viewPath, {
            pageTitle: 'Edit ' + (product.category.charAt(0).toUpperCase() + product.category.slice(1)),
            path: '/admin/edit-product', // Keep generic to not break nav active state potentially, or use specific
            editing: editMode,
            product: product,
            oldInput: oldInput,
            errorMessage: null
        });
    } catch (err) {
        console.log(err);
        res.redirect('/admin/products');
    }
};

exports.postEditProduct = async (req, res) => {
    const prodId = req.body.productId;
    const { name, price, mrp, brand, quantity, description, category, processor, ram, storage, display, os, graphics, screenSize, panelType, refreshRate } = req.body;
    const images = req.files;

    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.redirect('/');
        }

        product.name = name;
        product.price = price;
        product.mrp = mrp;
        product.discount = Math.round(((mrp - price) / mrp) * 100);
        product.brand = brand;
        product.quantity = quantity;
        product.description = description;
        product.category = category; // Should match hidden input
        product.inStock = quantity > 0;

        // If new images are uploaded, update them. Otherwise keep the old ones.
        if (images && images.length > 0) {
            const imageUrls = images.map(f => f.path);
            product.images = imageUrls;
            product.image = imageUrls[0];
        }

        // Update Specifications based on Category
        if (category === 'laptop') {
            product.specifications = { processor, ram, storage, display, os, graphics };
        } else if (category === 'monitor') {
            product.specifications = { screenSize, panelType, refreshRate, display };
        } else if (category === 'desktop') {
            product.specifications = { processor, ram, storage, graphics, os };
        }

        await product.save();
        console.log('UPDATED PRODUCT');
        await product.save();
        console.log('UPDATED PRODUCT');
        res.redirect(`/admin/edit-product/${prodId}?edit=true&success=true`);
    } catch (err) {
        console.log(err);
        res.redirect('/admin/products');
    }
};

exports.postDeleteProduct = async (req, res) => {
    const prodId = req.body.productId;
    try {
        await Product.findByIdAndDelete(prodId);
        console.log('DESTROYED PRODUCT');
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
    }
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

exports.getLogin = (req, res) => {
    res.render('admin/login', {
        pageTitle: 'Admin Login',
        path: '/admin/login'
    });
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            return res.redirect('/admin/login');
        }
        const doMatch = await bcrypt.compare(password, admin.password);
        if (doMatch) {
            const token = jwt.sign({ email: admin.email, adminId: admin._id }, 'somesupersecretsecret', { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.redirect('/admin/dashboard');
        }
        res.redirect('/admin/login');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/login');
    }
};

exports.postLogout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};

exports.postUpdateStock = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.redirect('/admin/products');
        }
        product.quantity = quantity;

        // Only force Out of Stock if quantity is 0.
        // If quantity > 0, we leave inStock as is (respecting manual toggle).
        if (quantity <= 0) {
            product.inStock = false;
        }

        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/products');
    }
};

exports.postToggleStatus = async (req, res) => {
    const { productId, inStock } = req.body; // inStock will be "true" or "false" (string)
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.redirect('/admin/products');
        }

        // Logic:
        // If turning ON (inStock = true): Only allow if quantity > 0.
        // If turning OFF (inStock = false): Always allow.

        const newStatus = inStock === 'true';

        if (newStatus && product.quantity <= 0) {
            // Cannot enable stock if quantity is 0
            // Ideally show an error, but for now just redirect
            return res.redirect('/admin/products');
        }

        product.inStock = newStatus;
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.log(err);
        res.redirect('/admin/products');
    }
};

exports.postDeleteImage = async (req, res) => {
    const { productId, imageUrl } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove image from images array
        product.images = product.images.filter(img => img !== imageUrl);

        // If the main image was deleted, update it to the first available image or empty string
        if (product.image === imageUrl) {
            product.image = product.images.length > 0 ? product.images[0] : '';
        }

        await product.save();

        // Return success response (since we'll likely use fetch)
        // Or redirect back if using form submission. 
        // Given the UI, a redirect back to the edit page is safest for now.
        // We need to know which edit page to redirect to.
        // We can check the category or just redirect to /admin/edit-product/ID?edit=true

        res.redirect(`/admin/edit-product/${productId}?edit=true`);

    } catch (err) {
        console.log(err);
        res.redirect('/admin/products');
    }
};

exports.getSendNotification = (req, res) => {
    res.render('admin/send-notification', {
        pageTitle: 'Send Notification',
        path: '/admin/send-notification',
        errorMessage: null,
        successMessage: req.query.success ? 'Notification Sent Successfully!' : null
    });
};

exports.postSendNotification = async (req, res) => {
    const { title, body, url, action1_title, action1_url, action2_title, action2_url } = req.body;
    
    // req.files is now an object with keys 'image' and 'icon' (arrays of files)
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const iconFile = req.files['icon'] ? req.files['icon'][0] : null;

    try {
        const subscriptions = await Subscription.find();
        if (!subscriptions || subscriptions.length === 0) {
            return res.render('admin/send-notification', {
                pageTitle: 'Send Notification',
                path: '/admin/send-notification',
                errorMessage: 'No subscribers found.',
                successMessage: null
            });
        }

        const imagePath = imageFile ? imageFile.path : null;
        const iconPath = iconFile ? iconFile.path : '/images/logo.png'; // Use uploaded icon or default

        // Construct Actions Array
        const actions = [];
        if (action1_title && action1_url) {
            actions.push({ action: action1_url, title: action1_title });
        }
        if (action2_title && action2_url) {
            actions.push({ action: action2_url, title: action2_title });
        }

        const notificationPayload = JSON.stringify({
            title: title,
            body: body,
            image: imagePath, // Large banner image
            icon: iconPath,   // Small icon (logo)
            url: url || '/',
            actions: actions
        });

        console.log(`Sending manual notifications to ${subscriptions.length} users with icon: ${iconPath} and actions: ${actions.length}`);

        const promises = subscriptions.map(sub =>
            webpush.sendNotification(sub, notificationPayload).catch(err => {
                console.error('Error sending notification, deleting subscription:', err);
                if (err.statusCode === 410 || err.statusCode === 404) {
                    return Subscription.deleteOne({ _id: sub._id });
                }
            })
        );
        await Promise.all(promises);
        console.log('Manual Notifications sent.');
        res.redirect('/admin/send-notification?success=true');

    } catch (err) {
        console.log(err);
        res.render('admin/send-notification', {
            pageTitle: 'Send Notification',
            path: '/admin/send-notification',
            errorMessage: 'Failed to send notifications. Check server logs.',
            successMessage: null
        });
    }
};
