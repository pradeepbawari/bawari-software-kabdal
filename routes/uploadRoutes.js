// routes/uploadRoutes.js
const express = require('express');
const { createUpload, deleteUpload, getAllUpload } = require('../controllers/uploadController');
const router = express.Router();

router.post('/create', createUpload);
router.post('/getImages', getAllUpload);
router.post('/deleteImage', deleteUpload);

module.exports = router;