// routes/productsController.js
const express = require("express");
const router = express.Router();
const { createProducts, getAllProducts, updateProducts, deleteProducts, filterProducts, filterUserProducts, fetchSingleProduct } = require("../controllers/productsController");
// const { getAllProducts} = require("../controllers/productsControllerNew");

router.post("/filterProducts", filterProducts);
router.post("/filterUserProducts", filterUserProducts);

module.exports = router;
 