// routes/commonRoutes.js
const express = require('express');
const { getAll, create, updateItem, deleteItem } = require('../controllers/commonDropdownController');
const router = express.Router();

router.get('/:type', getAll);
router.post('/:type', create);

router.put('/:type/:id', updateItem);
router.delete('/:type/:id', deleteItem);

module.exports = router;
