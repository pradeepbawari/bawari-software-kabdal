// routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const {createCategory, getAllCategories, getCategoriesAndSubcategories, updateCategory, deleteCategory, createCategoryWithSubcategories} = require("../controllers/categoryController");

// router.post("/create", createCategory);
router.get("/all", getCategoriesAndSubcategories);

module.exports = router;
