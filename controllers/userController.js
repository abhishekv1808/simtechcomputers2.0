const Product = require('../models/product');

exports.getHome = async (req, res) => {
    try {
        const appleLaptops = await Product.find({ category: 'laptop', brand: 'Apple' }).limit(8);
        const dellLaptops = await Product.find({ category: 'laptop', brand: 'Dell' }).limit(8);
        const hpLaptops = await Product.find({ category: 'laptop', brand: 'HP' }).limit(8);
        const lenovoLaptops = await Product.find({ category: 'laptop', brand: 'Lenovo' }).limit(8);
        const desktops = await Product.find({ category: 'desktop' }).limit(8);
        const monitors = await Product.find({ category: 'monitor' }).limit(8);

        res.render('../views/user/home.ejs', {
            pageTitle: "Home | Simtech computers",
            appleLaptops,
            dellLaptops,
            hpLaptops,
            lenovoLaptops,
            desktops,
            monitors
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}

exports.getContactUs = (req, res) => {
    res.render('../views/user/contactUs.ejs', { pageTitle: "Contact Us | Simtech computers" })
}

exports.getAboutUs = (req, res) => {
    res.render('../views/user/aboutUs.ejs', { pageTitle: "About Us | Simtech computers" })
}

exports.getLaptops = async (req, res) => {
    const brandFilter = req.query.brand;
    let query = { category: 'laptop' };

    if (brandFilter) {
        query.brand = brandFilter;
    }

    try {
        const products = await Product.find(query);
        res.render('../views/user/laptops.ejs', {
            pageTitle: (brandFilter ? `Used ${brandFilter} Laptops` : "All Laptops") + " | Simtech computers",
            products: products,
            currentBrand: brandFilter || 'All'
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getDesktops = async (req, res) => {
    const brandFilter = req.query.brand;
    let query = { category: 'desktop' };

    if (brandFilter) {
        query.brand = brandFilter;
    }

    try {
        const products = await Product.find(query);
        res.render('../views/user/desktops.ejs', {
            pageTitle: (brandFilter ? `Used ${brandFilter} Desktops` : "All Desktops") + " | Simtech computers",
            products: products,
            currentBrand: brandFilter || 'All'
        });
    } catch (err) {
        console.log(err);
    }
}

exports.getMonitors = async (req, res) => {
    const brandFilter = req.query.brand;
    let query = { category: 'monitor' };

    if (brandFilter) {
        query.brand = brandFilter;
    }

    try {
        const products = await Product.find(query);
        res.render('../views/user/monitors.ejs', {
            pageTitle: (brandFilter ? `${brandFilter} Monitors` : "All Monitors") + " | Simtech computers",
            products: products,
            currentBrand: brandFilter || 'All'
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

exports.getCart = (req, res) => {
    // Dummy Cart Data
    // We can leave this as dummy for now or fetch real products if we wanted, 
    // but the task said "Implement Admin Dashboard" and "Migrate User Controller".
    // Keeping this dummy is strictly safer to not break the cart feature I just delivered.
    const cartItems = [
        {
            product_id: "lap-001",
            name: "Apple MacBook Air M1 (8GB RAM, 256GB SSD)",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop",
            price: 45000,
            quantity: 1
        },
        {
            product_id: "mon-002",
            name: "Dell Ultrasharp 24\" USB-C Hub",
            image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
            price: 18500,
            quantity: 2
        }
    ];

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
}
