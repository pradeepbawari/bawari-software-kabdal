//uploadPDFRoutes

const express = require('express');
const router = express.Router();
const { uploadPDF } = require('../controllers/uploadController'); // Import controller for handling uploaded files

// Route to handle PDF uploads
router.post('/uploadDoc', uploadPDF);

module.exports = router;
