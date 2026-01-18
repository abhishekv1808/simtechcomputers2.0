exports.getHome = (req, res) => {
    // Filter products for homepage sections
    const appleLaptops = PRODUCTS.filter(p => p.category === 'laptop' && p.brand === 'Apple').slice(0, 8);
    const dellLaptops = PRODUCTS.filter(p => p.category === 'laptop' && p.brand === 'Dell').slice(0, 8);
    const hpLaptops = PRODUCTS.filter(p => p.category === 'laptop' && p.brand === 'HP').slice(0, 8);
    const lenovoLaptops = PRODUCTS.filter(p => p.category === 'laptop' && p.brand === 'Lenovo').slice(0, 8);
    const desktops = PRODUCTS.filter(p => p.category === 'desktop').slice(0, 8);
    const monitors = PRODUCTS.filter(p => p.category === 'monitor').slice(0, 8);

    res.render('../views/user/home.ejs', {
        pageTitle: "Home | Simtech computers",
        appleLaptops,
        dellLaptops,
        hpLaptops,
        lenovoLaptops,
        desktops,
        monitors
    })
}

exports.getContactUs = (req, res) => {
    res.render('../views/user/contactUs.ejs', { pageTitle: "Contact Us | Simtech computers" })
}

exports.getAboutUs = (req, res) => {
    res.render('../views/user/aboutUs.ejs', { pageTitle: "About Us | Simtech computers" })
}

// Shared Product Data
const PRODUCTS = [
    // Laptops
    {
        id: "lap-001",
        category: "laptop",
        name: "Apple MacBook Air M1 (8GB RAM, 256GB SSD)",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop",
        price: 45000,
        mrp: 79000,
        discount: 43,
        rating: 4.8
    },
    {
        id: "lap-002",
        category: "laptop",
        name: "Dell XPS 13 (i7, 16GB RAM, 512GB SSD)",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&auto=format&fit=crop",
        price: 55000,
        mrp: 120000,
        discount: 54,
        rating: 4.7
    },
    {
        id: "lap-003",
        category: "laptop",
        name: "HP Spectre x360 (i5, 8GB RAM, 512GB SSD)",
        brand: "HP",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop",
        price: 42000,
        mrp: 85000,
        discount: 50,
        rating: 4.6
    },
    {
        id: "lap-004",
        category: "laptop",
        name: "Lenovo ThinkPad X1 Carbon (i7, 16GB)",
        brand: "Lenovo",
        image: "https://images.unsplash.com/photo-1588872657578-137a675bcf4e?w=500&auto=format&fit=crop",
        price: 58000,
        mrp: 145000,
        discount: 60,
        rating: 4.9
    },
    {
        id: "lap-005",
        category: "laptop",
        name: "Apple MacBook Pro M1 (8GB, 256GB)",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop",
        price: 65000,
        mrp: 110000,
        discount: 40,
        rating: 4.9
    },
    {
        id: "lap-006",
        category: "laptop",
        name: "Dell Latitude 7420 (i5, 16GB, 256GB)",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&auto=format&fit=crop",
        price: 32000,
        mrp: 80000,
        discount: 60,
        rating: 4.5
    },
    // Desktops
    {
        id: "desk-001",
        category: "desktop",
        name: "Apple iMac 24\" M1 (8GB, 256GB)",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop",
        price: 85000,
        mrp: 119900,
        discount: 29,
        rating: 4.9
    },
    {
        id: "desk-002",
        category: "desktop",
        name: "Dell OptiPlex 7090 Ultra (i7, 16GB)",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
        price: 42000,
        mrp: 65000,
        discount: 35,
        rating: 4.7
    },
    {
        id: "desk-003",
        category: "desktop",
        name: "HP EliteOne 800 G6 AIO (i5, 8GB)",
        brand: "HP",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        price: 38000,
        mrp: 58000,
        discount: 34,
        rating: 4.5
    },
    {
        id: "desk-004",
        category: "desktop",
        name: "Lenovo ThinkCentre M90a (i7, 16GB)",
        brand: "Lenovo",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop",
        price: 45000,
        mrp: 72000,
        discount: 37,
        rating: 4.6
    },
    {
        id: "desk-005",
        category: "desktop",
        name: "Apple Mac Mini M2 (8GB, 256GB)",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1615663245857-acda6b9dd330?w=500&auto=format&fit=crop",
        price: 48000,
        mrp: 59900,
        discount: 20,
        rating: 4.8
    },
    {
        id: "desk-006",
        category: "desktop",
        name: "Dell Inspiron 27 AIO (i7, 1TB SSD)",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&auto=format&fit=crop",
        price: 82000,
        mrp: 105000,
        discount: 22,
        rating: 4.7
    },
    // Monitors
    {
        id: "mon-001",
        category: "monitor",
        name: "LG UltraGear 27\" 144Hz IPS",
        brand: "LG",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        price: 23000,
        mrp: 32000,
        discount: 28,
        rating: 4.8
    },
    {
        id: "mon-002",
        category: "monitor",
        name: "Dell Ultrasharp 24\" USB-C Hub",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
        price: 18500,
        mrp: 26000,
        discount: 29,
        rating: 4.7
    },
    {
        id: "mon-003",
        category: "monitor",
        name: "Samsung Odyssey G5 Curved 32\"",
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&auto=format&fit=crop",
        price: 26000,
        mrp: 38000,
        discount: 31,
        rating: 4.6
    },
    {
        id: "mon-004",
        category: "monitor",
        name: "BenQ PD2700U 4K Designer",
        brand: "BenQ",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        price: 34000,
        mrp: 45000,
        discount: 24,
        rating: 4.8
    },
    {
        id: "mon-005",
        category: "monitor",
        name: "Acer Nitro VG271U 2K 170Hz",
        brand: "Acer",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
        price: 19500,
        mrp: 28999,
        discount: 33,
        rating: 4.5
    },
    {
        id: "mon-006",
        category: "monitor",
        name: "MSI Optix MAG241C Curved",
        brand: "MSI",
        image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&auto=format&fit=crop",
        price: 16000,
        mrp: 22000,
        discount: 27,
        rating: 4.4
    }
];

exports.getLaptops = (req, res) => {
    const brandFilter = req.query.brand;
    const products = PRODUCTS.filter(p => p.category === 'laptop');
    let filteredProducts = products;

    if (brandFilter) {
        filteredProducts = products.filter(product => product.brand === brandFilter);
    }

    res.render('../views/user/laptops.ejs', {
        pageTitle: (brandFilter ? `Used ${brandFilter} Laptops` : "All Laptops") + " | Simtech computers",
        products: filteredProducts,
        currentBrand: brandFilter || 'All'
    })
}

exports.getDesktops = (req, res) => {
    const brandFilter = req.query.brand;
    const products = PRODUCTS.filter(p => p.category === 'desktop');
    let filteredProducts = products;

    if (brandFilter) {
        filteredProducts = products.filter(product => product.brand === brandFilter);
    }

    res.render('../views/user/desktops.ejs', {
        pageTitle: (brandFilter ? `Used ${brandFilter} Desktops` : "All Desktops") + " | Simtech computers",
        products: filteredProducts,
        currentBrand: brandFilter || 'All'
    })
}

exports.getMonitors = (req, res) => {
    const brandFilter = req.query.brand;
    const products = PRODUCTS.filter(p => p.category === 'monitor');
    let filteredProducts = products;

    if (brandFilter) {
        filteredProducts = products.filter(product => product.brand === brandFilter);
    }

    res.render('../views/user/monitors.ejs', {
        pageTitle: (brandFilter ? `${brandFilter} Monitors` : "All Monitors") + " | Simtech computers",
        products: filteredProducts,
        currentBrand: brandFilter || 'All'
    })
}


exports.getProductDetails = (req, res) => {
    const productId = req.params.id;
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) {
        return res.status(404).render('404', { pageTitle: "Product Not Found" });
    }

    // Pass related products (same category, excluding current)
    const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    res.render('../views/user/productDetails.ejs', {
        pageTitle: `${product.name} | Simtech computers`,
        product: product,
        relatedProducts: relatedProducts
    })
}

exports.getCart = (req, res) => {
    // Dummy Cart Data
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
