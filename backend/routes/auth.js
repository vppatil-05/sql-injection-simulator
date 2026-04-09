const express = require('express');
const router = express.Router();
const { detectorMiddleware } = require('../middleware/detector');
const authController = require('../controllers/authController');

router.post('/login', detectorMiddleware, authController.login);

module.exports = router;
