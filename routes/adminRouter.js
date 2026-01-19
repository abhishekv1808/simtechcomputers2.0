const express = require('express');
const adminController = require('../controllers/adminController');

const { body } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cloudinary Config
const cloudinary = require('../utils/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'simtech_products',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    },
});

const upload = multer({ storage: storage });

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/login => GET
router.get('/login', adminController.getLogin);

// /admin/login => POST
router.post('/login', adminController.postLogin);

// /admin/logout => POST
router.post('/logout', adminController.postLogout);

// /admin/dashboard => GET
router.get('/dashboard', isAuth, adminController.getDashboard);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/enquiries => GET
router.get('/enquiries', isAuth, adminController.getEnquiries);

// /admin/resolve-enquiry => POST
router.post('/resolve-enquiry', isAuth, adminController.postResolveEnquiry);

// --- Laptop ---
router.get('/add-laptop', isAuth, adminController.getAddLaptop);
router.post('/add-laptop', isAuth, upload.array('images', 5), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('price').custom((value, { req }) => {
        if (parseFloat(value) >= parseFloat(req.body.mrp)) {
            throw new Error('Selling Price must be less than MRP');
        }
        return true;
    }),
    body('brand', 'Brand is required').notEmpty(),
    body('processor', 'Processor is required').notEmpty(),
    body('ram', 'RAM is required').notEmpty(),
    body('storage', 'Storage is required').notEmpty()
], adminController.postAddLaptop);

// --- Monitor ---
router.get('/add-monitor', isAuth, adminController.getAddMonitor);
router.post('/add-monitor', isAuth, upload.array('images', 5), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('price').custom((value, { req }) => {
        if (parseFloat(value) >= parseFloat(req.body.mrp)) {
            throw new Error('Selling Price must be less than MRP');
        }
        return true;
    }),
    body('brand', 'Brand is required').notEmpty(),
    body('screenSize', 'Screen Size is required').notEmpty(),
    body('panelType', 'Panel Type is required').notEmpty(),
    body('refreshRate', 'Refresh Rate is required').notEmpty()
], adminController.postAddMonitor);

// --- Desktop ---
router.get('/add-desktop', isAuth, adminController.getAddDesktop);
router.post('/add-desktop', isAuth, upload.array('images', 5), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('price').custom((value, { req }) => {
        if (parseFloat(value) >= parseFloat(req.body.mrp)) {
            throw new Error('Selling Price must be less than MRP');
        }
        return true;
    }),
    body('brand', 'Brand is required').notEmpty(),
    body('processor', 'Processor is required').notEmpty(),
    body('ram', 'RAM is required').notEmpty(),
    body('storage', 'Storage is required').notEmpty(),
    body('graphics', 'Graphics info is required').notEmpty()
], adminController.postAddDesktop);

// --- Accessories ---
router.get('/add-accessories', isAuth, adminController.getAddAccessories);
router.post('/add-accessories', isAuth, upload.array('images', 5), [
    body('name', 'Invalid name').isString().isLength({ min: 3 }).trim(),
    body('price', 'Invalid price').isFloat(),
    body('mrp', 'Invalid MRP').isFloat(),
    body('price').custom((value, { req }) => {
        if (parseFloat(value) >= parseFloat(req.body.mrp)) {
            throw new Error('Selling Price must be less than MRP');
        }
        return true;
    }),
    body('brand', 'Brand is required').notEmpty()
], adminController.postAddAccessories);

// Old generic route (keeping for backward compatibility or future cleanup)
// /admin/add-product => GET
// router.get('/add-product', adminController.getAddProduct);
// router.post('/add-product', adminController.postAddProduct);

// /admin/edit-product/:productId => GET
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', isAuth, upload.array('images', 5), adminController.postEditProduct);

// /admin/update-stock => POST
router.post('/update-stock', isAuth, adminController.postUpdateStock);

// /admin/toggle-status => POST
router.post('/toggle-status', isAuth, adminController.postToggleStatus);

// /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// /admin/delete-image => POST
router.post('/delete-image', isAuth, adminController.postDeleteImage);

module.exports = router;
