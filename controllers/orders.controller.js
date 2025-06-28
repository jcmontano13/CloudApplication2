const Order = require('../models/order.model');
const User = require('../models/user.model');

function getOrders(reqw, res) {
    res.render('customer/orders/all-orders');
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