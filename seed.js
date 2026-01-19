const mongoose = require('mongoose');
const Product = require('./models/product');

const mongodbURL = "mongodb+srv://abhishekv1808:Grow%40%24%402025@aribnb.xvmlcnz.mongodb.net/simtech20?retryWrites=true&w=majority&appName=aribnb";

mongoose.connect(mongodbURL)
    .then(() => {
        console.log("Connected to MongoDB for seeding");
        seedDB();
    })
    .catch(err => {
        console.log(err);
    });

const seedProducts = [
    // Laptops
    {
        name: "Apple MacBook Air M1 (8GB RAM, 256GB SSD)",
        category: "laptop",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop",
        price: 45000,
        mrp: 79000,
        discount: 43,
        rating: 4.8,
        specifications: { processor: "M1", ram: "8GB", storage: "256GB SSD" }
    },
    {
        name: "Dell XPS 13 (i7, 16GB RAM, 512GB SSD)",
        category: "laptop",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&auto=format&fit=crop",
        price: 55000,
        mrp: 120000,
        discount: 54,
        rating: 4.7,
        specifications: { processor: "i7", ram: "16GB", storage: "512GB SSD" }
    },
    {
        name: "HP Spectre x360 (i5, 8GB RAM, 512GB SSD)",
        category: "laptop",
        brand: "HP",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&auto=format&fit=crop",
        price: 42000,
        mrp: 85000,
        discount: 50,
        rating: 4.6,
        specifications: { processor: "i5", ram: "8GB", storage: "512GB SSD" }
    },
    {
        name: "Lenovo ThinkPad X1 Carbon (i7, 16GB)",
        category: "laptop",
        brand: "Lenovo",
        image: "https://images.unsplash.com/photo-1588872657578-137a675bcf4e?w=500&auto=format&fit=crop",
        price: 58000,
        mrp: 145000,
        discount: 60,
        rating: 4.9,
        specifications: { processor: "i7", ram: "16GB", storage: "512GB SSD" }
    },
    {
        name: "Apple MacBook Pro M1 (8GB, 256GB)",
        category: "laptop",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop",
        price: 65000,
        mrp: 110000,
        discount: 40,
        rating: 4.9,
        specifications: { processor: "M1", ram: "8GB", storage: "256GB SSD" }
    },
    {
        name: "Dell Latitude 7420 (i5, 16GB, 256GB)",
        category: "laptop",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593642632823-8f78536788c6?w=500&auto=format&fit=crop",
        price: 32000,
        mrp: 80000,
        discount: 60,
        rating: 4.5,
        specifications: { processor: "i5", ram: "16GB", storage: "256GB SSD" }
    },
    // Desktops
    {
        name: "Apple iMac 24\" M1 (8GB, 256GB)",
        category: "desktop",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format&fit=crop",
        price: 85000,
        mrp: 119900,
        discount: 29,
        rating: 4.9,
        specifications: { processor: "M1", ram: "8GB", storage: "256GB SSD" }
    },
    {
        name: "Dell OptiPlex 7090 Ultra (i7, 16GB)",
        category: "desktop",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
        price: 42000,
        mrp: 65000,
        discount: 35,
        rating: 4.7,
        specifications: { processor: "i7", ram: "16GB", storage: "512GB SSD" }
    },
    {
        name: "HP EliteOne 800 G6 AIO (i5, 8GB)",
        category: "desktop",
        brand: "HP",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        price: 38000,
        mrp: 58000,
        discount: 34,
        rating: 4.5,
        specifications: { processor: "i5", ram: "8GB", storage: "512GB SSD" }
    },
    {
        name: "Lenovo ThinkCentre M90a (i7, 16GB)",
        category: "desktop",
        brand: "Lenovo",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop",
        price: 45000,
        mrp: 72000,
        discount: 37,
        rating: 4.6,
        specifications: { processor: "i7", ram: "16GB", storage: "512GB SSD" }
    },
    {
        name: "Apple Mac Mini M2 (8GB, 256GB)",
        category: "desktop",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1615663245857-acda6b9dd330?w=500&auto=format&fit=crop",
        price: 48000,
        mrp: 59900,
        discount: 20,
        rating: 4.8,
        specifications: { processor: "M2", ram: "8GB", storage: "256GB SSD" }
    },
    {
        name: "Dell Inspiron 27 AIO (i7, 1TB SSD)",
        category: "desktop",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&auto=format&fit=crop",
        price: 82000,
        mrp: 105000,
        discount: 22,
        rating: 4.7,
        specifications: { processor: "i7", ram: "16GB", storage: "1TB SSD" }
    },
    // Monitors
    {
        name: "LG UltraGear 27\" 144Hz IPS",
        category: "monitor",
        brand: "LG",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        price: 23000,
        mrp: 32000,
        discount: 28,
        rating: 4.8,
        specifications: { display: "27 inch", refreshRate: "144Hz" }
    },
    {
        name: "Dell Ultrasharp 24\" USB-C Hub",
        category: "monitor",
        brand: "Dell",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
        price: 18500,
        mrp: 26000,
        discount: 29,
        rating: 4.7,
        specifications: { display: "24 inch", refreshRate: "60Hz" }
    },
    {
        name: "Samsung Odyssey G5 Curved 32\"",
        category: "monitor",
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&auto=format&fit=crop",
        price: 26000,
        mrp: 38000,
        discount: 31,
        rating: 4.6,
        specifications: { display: "32 inch curved", refreshRate: "144Hz" }
    },
    {
        name: "BenQ PD2700U 4K Designer",
        category: "monitor",
        brand: "BenQ",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
        price: 34000,
        mrp: 45000,
        discount: 24,
        rating: 4.8,
        specifications: { display: "27 inch 4K", refreshRate: "60Hz" }
    },
    {
        name: "Acer Nitro VG271U 2K 170Hz",
        category: "monitor",
        brand: "Acer",
        image: "https://images.unsplash.com/photo-1547082299-bb196bcce49c?w=500&auto=format&fit=crop",
        price: 19500,
        mrp: 28999,
        discount: 33,
        rating: 4.5,
        specifications: { display: "27 inch 2K", refreshRate: "170Hz" }
    },
    {
        name: "MSI Optix MAG241C Curved",
        category: "monitor",
        brand: "MSI",
        image: "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=500&auto=format&fit=crop",
        price: 16000,
        mrp: 22000,
        discount: 27,
        rating: 4.4,
        specifications: { display: "24 inch curved", refreshRate: "144Hz" }
    }
];

const bcrypt = require('bcryptjs');
const Admin = require('./models/admin');

const seedDB = async () => {
    try {
        await Product.deleteMany({});
        await Product.insertMany(seedProducts);
        console.log("Products Seeded Successfully");

        const admin = await Admin.findOne({ email: 'admin@simtech.com' });
        const hashedPassword = await bcrypt.hash('Simtech@2025!Secure', 12);
        
        if (!admin) {
            const newAdmin = new Admin({
                email: 'admin@simtech.com',
                password: hashedPassword
            });
            await newAdmin.save();
            console.log("Default Admin Created");
        } else {
            admin.password = hashedPassword;
            await admin.save();
            console.log("Admin Password Updated");
        }

    } catch (err) {
        console.log(err);
    } finally {
        mongoose.connection.close();
    }
}
