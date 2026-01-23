const Product = require('../models/product');

module.exports = async (req, res, next) => {
    let cart = [];
    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
        } catch (e) {
            console.log("Error parsing cart cookie", e);
        }
    }
    if (cart.length > 0) {
        try {
            const productIds = cart.map(item => item.productId);
            // Fetch only _id of valid products
            const validProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
            const validProductIds = validProducts.map(p => p._id.toString());

            // Filter cart to keep only items that exist in DB
            const validCart = cart.filter(item => validProductIds.includes(item.productId));

            // If invalid items were found, update the cookie
            if (validCart.length !== cart.length) {
                cart = validCart;
                res.cookie('cart', JSON.stringify(cart), { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
            }
        } catch (err) {
            console.log("Error validating cart items:", err);
            // On DB error, we might choose to do nothing or clear cart. 
            // For now, let's proceed with potentially stale data but log it.
        }
    }

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    res.locals.cart = cart;
    res.locals.cartCount = cartCount;
    next();
};
