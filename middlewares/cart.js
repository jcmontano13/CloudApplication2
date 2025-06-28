const Cart = require('../models/cart.model');

function initializeCart(req, res, next) {
    let cart;

    if (!req.session.cart) {
        cart = new Cart();
    } else {
        const sessionCart = req.session.cart;
        cart = new Cart(
            sessionCart.items,
            sessionCart.totalQuantity,
            sessionCart.totalPrice
        ); // retrieve cart stored in session
    }
    res.locals.cart = cart;
    next();
}
module.exports = initializeCart