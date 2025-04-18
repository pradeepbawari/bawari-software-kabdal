const express = require('express');
const { createOrder, updateOrder, deleteOrder, getOrder, getAllOrders, getUserOrders, createUserOrder, updateUserOrder, getSingleOrder, getAllOrdersAdmin, getSingleOrderAdmin, quotationUpdate } = require('../controllers/orderController');
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

// router.post('/all', getAllOrders);
router.post('/ordersAll', getAllOrdersAdmin);
router.post('/adminOrdersById/', getSingleOrderAdmin);
router.post('/userOrders/', getUserOrders);
router.post('/userOrdersById/', getSingleOrder);
router.put('/updateUserOrders/:order_id', updateUserOrder);
router.put('/quotation/:order_id', quotationUpdate);
 
module.exports = router;
