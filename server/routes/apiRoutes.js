const express = require('express');
const router = express.Router();
const authController = rqeuire('../controllers/auth');
const homeController = require('../controllers/home');

router.get('/', homeController.test);
// /api/login
// /api/logout
// name, new order, new organization, get order...

module.exports = router;