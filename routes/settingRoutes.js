// routes/userRoutes.js
const express = require('express');
const { createSetting, getSetting, updateLogo } = require('../controllers/settingController');
const router = express.Router();

// POST: Create a new user
router.post('/create', createSetting);
router.post('/all', getSetting);
router.post('/logo', createSetting);

module.exports = router;
