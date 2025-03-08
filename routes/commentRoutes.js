// routes/commentsRoutes.js
const express = require('express');
const { createComments, getComments } = require('../controllers/commentController');
const router = express.Router();

// POST: Create a new user
router.post('/create', createComments);

// GET: Fetch a single user by ID
router.post('/all', getComments);

module.exports = router;
