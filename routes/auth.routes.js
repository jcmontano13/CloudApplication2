// require express / import express package
const express = require('express'); 

// require(import) auth.control.js 
const authController = require('../controllers/auth.controller');

// construct a router object 
const router = express.Router();

// serve signup page
router.get('/signup', authController.getSignup);

// post 
router.post('/signup', authController.signup);

// serve login page
router.get('/login', authController.getLogin);

// post / trigger login
router.post('/login',authController.login);

// post / trigger logout
router.post('/logout', authController.logout);

// features objects that should be expose to other file
module.exports = router;