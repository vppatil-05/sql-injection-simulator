const express = require('express');
const router = express.Router();
const { detectorMiddleware } = require('../middleware/detector');
const productController = require('../controllers/productController');

router.post('/search', detectorMiddleware, productController.search);
router.get('/search', detectorMiddleware, productController.search);
router.get('/', productController.getAll);

module.exports = router;
