const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/products', productController.getAll);
router.post('/products', productController.add);
router.delete('/products/:id', productController.delete);

module.exports = router;
