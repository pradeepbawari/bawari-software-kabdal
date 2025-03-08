// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {createCategory, getAllCategories, getCategoriesAndSubcategories, updateCategory, deleteCategory, createCategoryWithSubcategories} = require("../controllers/categoryController");

// router.post("/create", createCategory);
router.post("/create", createCategoryWithSubcategories);
// router.get("/all", getAllCategories);
router.get("/all", getCategoriesAndSubcategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

module.exports = router;
