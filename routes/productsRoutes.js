// routes/productsController.js
const express = require("express");
const router = express.Router();
const { createProducts, getAllProducts, updateProducts, deleteProducts, filterProducts, filterUserProducts, fetchSingleProduct } = require("../controllers/productsController");
// const { getAllProducts} = require("../controllers/productsControllerNew");

router.post("/create", createProducts);
router.post("/all", getAllProducts);
router.post("/productbyid", fetchSingleProduct);
router.put("/update/:id", updateProducts);
router.delete("/delete/:id", deleteProducts);
router.post("/filterProducts", filterProducts);
router.post("/filterUserProducts", filterUserProducts);

module.exports = router;
 