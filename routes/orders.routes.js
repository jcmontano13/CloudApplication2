// require express / import express package
const express = require('express');

// require(import) orders.controller 
const ordersController = require('../controllers/orders.controller');

// construct a router object 
const router = express.Router();

router.post('/', ordersController.addOrder);

router.get('/', ordersController.getOrders);

module.exports = router;