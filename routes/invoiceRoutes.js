// routes/invoiceRoutes.js
const express = require("express");
const router = express.Router();
const {generateInvoice} = require("../controllers/invoiceController");

router.post("/generate/:orderId", generateInvoice);

module.exports = router;
