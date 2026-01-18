const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getDashboard = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const outputOfStock = await Product.countDocuments({ inStock: false });

        const laptopCount = await Product.countDocuments({ category: 'laptop' });
        const desktopCount = await Product.countDocuments({ category: 'desktop' });
        const monitorCount = await Product.countDocuments({ category: 'monitor' });

        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            path: '/admin/dashboard',
            totalProducts,
            outputOfStock,
            categoryCounts: {
                laptop: laptopCount,
                desktop: desktopCount,
                monitor: monitorCount
            }
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

// --- Laptop ---
exports.getAddLaptop = (req, res) => {
    res.render('admin/add-laptop', {
        pageTitle: 'Add Laptop',
        path: '/admin/add-laptop',
        errorMessage: null,
        oldInput: { name: '', price: '', mrp: '', discount: '', image: '', brand: '', quantity: '', description: '', processor: '', ram: '', storage: '', display: '', os: '', graphics: '' }
    });
};

exports.postAddLaptop = async (req, res) => {
    const { name, price, mrp, discount, brand, quantity, description, processor, ram, storage, display, os, graphics } = req.body;
    const image = req.file; // File from multer
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/add-laptop', {
            pageTitle: 'Add Laptop',
            path: '/admin/add-laptop',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, discount, brand, quantity, description, processor, ram, storage, display, os, graphics }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-laptop', {
            pageTitle: 'Add Laptop',
            path: '/admin/add-laptop',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, discount, brand, quantity, description, processor, ram, storage, display, os, graphics }
        });
    }

    const imageUrl = '/uploads/' + image.filename; // Relative path for frontend access

    try {
        const product = new Product({
            name, price, mrp, discount, image: imageUrl, category: 'laptop', brand, quantity, description,
            inStock: quantity > 0,
            specifications: { processor, ram, storage, display, os, graphics }
        });
        await product.save();
        console.log('Created Laptop');
        res.redirect('/admin/products');
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
        oldInput: { name: '', price: '', mrp: '', discount: '', image: '', brand: '', quantity: '', description: '', screenSize: '', panelType: '', refreshRate: '', display: '' }
    });
};

exports.postAddMonitor = async (req, res) => {
    const { name, price, mrp, discount, brand, quantity, description, screenSize, panelType, refreshRate, display } = req.body;
    const image = req.file;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/add-monitor', {
            pageTitle: 'Add Monitor',
            path: '/admin/add-monitor',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, discount, brand, quantity, description, screenSize, panelType, refreshRate, display }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-monitor', {
            pageTitle: 'Add Monitor',
            path: '/admin/add-monitor',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, discount, brand, quantity, description, screenSize, panelType, refreshRate, display }
        });
    }

    const imageUrl = '/uploads/' + image.filename;

    try {
        const product = new Product({
            name, price, mrp, discount, image: imageUrl, category: 'monitor', brand, quantity, description,
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
        oldInput: { name: '', price: '', mrp: '', discount: '', image: '', brand: '', quantity: '', description: '', processor: '', ram: '', storage: '', graphics: '', os: '' }
    });
};

exports.postAddDesktop = async (req, res) => {
    const { name, price, mrp, discount, brand, quantity, description, processor, ram, storage, graphics, os } = req.body;
    const image = req.file;
    const errors = validationResult(req);

    if (!image) {
        return res.status(422).render('admin/add-desktop', {
            pageTitle: 'Add Desktop',
            path: '/admin/add-desktop',
            errorMessage: 'Attached file is not an image.',
            oldInput: { name, price, mrp, discount, brand, quantity, description, processor, ram, storage, graphics, os }
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/add-desktop', {
            pageTitle: 'Add Desktop',
            path: '/admin/add-desktop',
            errorMessage: errors.array()[0].msg,
            oldInput: { name, price, mrp, discount, brand, quantity, description, processor, ram, storage, graphics, os }
        });
    }

    const imageUrl = '/uploads/' + image.filename;

    try {
        const product = new Product({
            name, price, mrp, discount, image: imageUrl, category: 'desktop', brand, quantity, description,
            inStock: quantity > 0,
            specifications: { processor, ram, storage, graphics, os }
        });
        await product.save();
        console.log('Created Desktop');
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
            discount: product.discount,
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
    const { name, price, mrp, discount, brand, quantity, description, category, processor, ram, storage, display, os, graphics, screenSize, panelType, refreshRate } = req.body;
    const image = req.file;

    try {
        const product = await Product.findById(prodId);
        if (!product) {
            return res.redirect('/');
        }

        product.name = name;
        product.price = price;
        product.mrp = mrp;
        product.discount = discount;
        product.brand = brand;
        product.quantity = quantity;
        product.description = description;
        product.category = category; // Should match hidden input
        product.inStock = quantity > 0;

        // If a new image is uploaded, update it. Otherwise keep the old one.
        if (image) {
            product.image = '/uploads/' + image.filename;
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
        res.redirect('/admin/products');
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
