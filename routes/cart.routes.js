// require express / import express package
const express = require('express');

// require(import) cart.control.js 
const cartController = require('../controllers/cart.controller');

// construct a router object 
const router = express.Router();

router.get('/', cartController.getCart); // /cart/..

router.post('/items', cartController.addCartItem);

router.patch('/items', cartController.updateCartItem);

module.exports = router;