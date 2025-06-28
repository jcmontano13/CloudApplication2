// require express / import express package
const express = require('express');

// require products controller
const productsController = require('../controllers/products.controller');

// construct a router object 
const router = express.Router();

router.get('/products', productsController.getAllproducts);

router.get('/products/:id', productsController.getProductDetails);
// features objects that should be expose to other file
module.exports = router;