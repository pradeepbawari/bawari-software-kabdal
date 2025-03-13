const express = require('express');
const { createOrder, updateOrder, deleteOrder, getOrder, getAllOrders, getUserOrders, createUserOrder, updateUserOrder } = require('../controllers/orderController');
const router = express.Router();

// POST endpoint to create an order
router.post('/create', createOrder);
router.post('/userCreate', createUserOrder);

// Update an existing order
router.put('/update/:order_id', updateOrder);

// Delete an order
router.delete('/delete/:order_id', deleteOrder);

// Get order(s)
router.get('/orders/:order_id?', getOrder);

router.post('/all', getAllOrders);
router.post('/userOrders/', getUserOrders);
router.put('/updateUserOrders/:order_id', updateUserOrder);
 
module.exports = router;
