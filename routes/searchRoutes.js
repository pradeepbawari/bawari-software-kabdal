// routes/searchRoutes.js
const express = require('express');
const { searchUsers, searchProduct, searchDealers, searchOrder, searchUserProduct } = require('../controllers/searchController');
const router = express.Router();

router.post('/searchUsers', searchUsers);
router.post('/searchProduct', searchProduct);
router.post('/searchDealers', searchDealers);
router.post('/searchOrder', searchOrder);

router.post('/user-product', searchUserProduct);

module.exports = router;