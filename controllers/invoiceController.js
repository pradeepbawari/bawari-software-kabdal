// controllers/categoryController.js
const db = require("../models");
const { Order, Product, User, OrderItem } = require('../models');

// Create a new category
const generateInvoice = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Fetch the order details
    const order = await db.Order.findOne({
      where: { id: orderId },
      include: [
        {
          model: db.OrderItem,
          include: [{ model: db.Product }],
        },
        { model: db.User }, // Include client/user details
      ],
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Format invoice data
    const invoiceData = {
      orderId: order.id,
      client: {
        name: order.User.name,
        email: order.User.email,
		company: order.User.company,
    gstin: order.User.gstin,
        mobile: order.User.mobile_number,
        address: order.User.address,
      },
      items: order.OrderItems.map((item) => ({
        productName: item.Product.name,
        quantity: item.quantity,
        price: item.price,
        gst: item.gst,
        total: item.total,
      })),
      totals: {
        subTotal: order.total_amount,
        gst: order.gst_amount,
        grandTotal: order.grand_total,
      },
      createdAt: order.createdAt,
    };

    res.status(200).json({ invoice: invoiceData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateInvoice };
