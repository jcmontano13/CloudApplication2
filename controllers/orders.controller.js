const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req, res, next) {
    try {
        const orders = await Order.findAllForUser(res.locals.uid);  // find all orders for a given users
        res.render('customer/orders/all-orders', {
            orders: orders,
        });
    } catch (error) {
        next(error);
    }
}

async function addOrder(req, res, next) {
    const cart = res.locals.cart;
    let userDocument;
    try {
        userDocument = await User.findById(res.locals.uid);
    } catch (error) {
        return next(error);
    }

    const order = new Order(cart, userDocument);
    try {
        order.save(); // save to database
    } catch (error) {
        next(error);
        return;
    }
    req.session.cart = null; // clear all the data in the cart
    res.redirect('/orders');
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders
}