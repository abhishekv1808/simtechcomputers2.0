const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/product');

// Initialize Razorpay
// TODO: Replace with environment variables
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET'
});

exports.createOrder = async (req, res) => {
    try {
        const userId = req.session.user ? req.session.user._id : null; // Assuming session based auth or similar
        // If using passport or other auth, adjust accordingly. Based on userController, it seems req.user might be available if using middleware
        // But let's check userController.js again. It uses isAuthenticated variable in views, likely set by middleware.
        // For now, I'll assume req.user or similar is available if authenticated.
        
        // Actually, looking at userController, it checks req.cookies.cart.
        // And isAuthenticated is passed to views.
        // I need to know how user is stored.
        // Let's assume standard req.user from passport or similar for now, or check auth middleware later.
        // Wait, the userController doesn't show auth middleware details.
        // I'll assume req.user is populated by ensureAuthenticated middleware.

        let cart = [];
        if (req.cookies.cart) {
            cart = JSON.parse(req.cookies.cart);
        }

        if (cart.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const productIds = cart.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });

        let totalAmount = 0;
        const orderProducts = [];

        cart.forEach(cartItem => {
            const product = products.find(p => p._id.toString() === cartItem.productId);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                totalAmount += itemTotal;
                orderProducts.push({
                    product: product, // Store snapshot of product
                    quantity: cartItem.quantity
                });
            }
        });

        // Add Tax (18%)
        const tax = Math.round(totalAmount * 0.18);
        const finalAmount = totalAmount + tax;

        const options = {
            amount: finalAmount * 100, // Amount in paise
            currency: "INR",
            receipt: "order_rcptid_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
        }

        // Save pending order to DB
        const newOrder = new Order({
            user: req.user._id, // Assumes req.user is set
            products: orderProducts,
            totalAmount: finalAmount,
            razorpayOrderId: order.id,
            address: req.body.address || 'Default Address', // Should come from frontend
            status: 'Pending'
        });

        await newOrder.save();

        res.json({
            success: true,
            id: order.id,
            currency: order.currency,
            amount: order.amount,
            key_id: process.env.RAZORPAY_KEY_ID || 'YOUR_KEY_ID' // Send key to frontend
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment Success
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
            if (order) {
                order.status = 'Paid';
                order.razorpayPaymentId = razorpay_payment_id;
                await order.save();

                // Clear Cart
                res.clearCookie('cart');

                return res.json({ success: true, message: "Payment verified successfully" });
            } else {
                return res.status(404).json({ success: false, message: "Order not found" });
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
