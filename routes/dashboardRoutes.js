// routes/dashboardRoutes.js
const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const router = express.Router();

// POST: Create a new user
router.post('/create', getDashboardData);
router.post('/getneworder', getDashboardData);
router.post('/getpipelineorder', getDashboardData);

module.exports = router;
