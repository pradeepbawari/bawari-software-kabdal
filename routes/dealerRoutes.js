// routes/dealerRoutes.js
const express = require('express');
const { createDealer, getDealers, getDealer, updateDealer, deleteDealer, getListDealersCompanies } = require('../controllers/dealerController');
const router = express.Router();

// POST: Create a new Dealer
router.post('/create', createDealer);

// GET: Fetch all Dealers
router.post('/all', getDealers);

router.post('/list', getListDealersCompanies);

// GET: Fetch a single Dealer by ID
router.get('/dealers/:id', getDealer);

// PUT: Update a Dealer by ID
router.put('/update/:id', updateDealer);

// DELETE: Delete a Dealer by ID
router.delete('/delete/:id', deleteDealer);

module.exports = router;
