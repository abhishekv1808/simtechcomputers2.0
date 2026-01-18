const express = require('express');
const adminController = require('../controllers/adminController');

const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

// /admin/dashboard => GET
router.get('/dashboard', adminController.getDashboard);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// --- Laptop ---
router.get('/add-laptop', adminController.getAddLaptop);
router.post('/add-laptop', upload.single('image'), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('discount', 'Invalid discount').isFloat(),
    // body('image') - Remove validation for URL string since it's a file now
    body('brand', 'Brand is required').notEmpty(),
    body('processor', 'Processor is required').notEmpty(),
    body('ram', 'RAM is required').notEmpty(),
    body('storage', 'Storage is required').notEmpty()
], adminController.postAddLaptop);

// --- Monitor ---
router.get('/add-monitor', adminController.getAddMonitor);
router.post('/add-monitor', upload.single('image'), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('discount', 'Invalid discount').isFloat(),
    // body('image') - Remove validation
    body('brand', 'Brand is required').notEmpty(),
    body('screenSize', 'Screen Size is required').notEmpty(),
    body('panelType', 'Panel Type is required').notEmpty(),
    body('refreshRate', 'Refresh Rate is required').notEmpty()
], adminController.postAddMonitor);

// --- Desktop ---
router.get('/add-desktop', adminController.getAddDesktop);
router.post('/add-desktop', upload.single('image'), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('discount', 'Invalid discount').isFloat(),
    // body('image') - Remove validation
    body('brand', 'Brand is required').notEmpty(),
    body('processor', 'Processor is required').notEmpty(),
    body('ram', 'RAM is required').notEmpty(),
    body('storage', 'Storage is required').notEmpty(),
    body('graphics', 'Graphics info is required').notEmpty()
], adminController.postAddDesktop);

// Old generic route (keeping for backward compatibility or future cleanup)
// /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);
// router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product/:productId => GET
router.get('/edit-product/:productId', adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', upload.single('image'), adminController.postEditProduct);

// /admin/delete-product => POST
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
