// controllers/dashboardController.js
const db = require('../models');
const { User, Order, Product, Dealer } = require('../models');

// Create User
const getDashboardData = async (req, res) => {
  try {
    // Use Promise.all for parallel execution of queries
    const [
      totalOrders,
      totalClients,
      totalProducts,
      totalDealers,
      ordersByStatus
    ] = await Promise.all([
      db.Order.count(), // Total orders
      db.User.count(), // Total clients
      db.Product.count(), // Total products
      db.Dealer.count(), // Total dealers
      // Orders grouped by status
      db.Order.findAll({
        attributes: ['status', [db.Sequelize.fn('COUNT', db.Sequelize.col('status')), 'count']],
        group: ['status'],
      }),
    ]);

    // Format ordersByStatus to a cleaner structure
    const formattedOrdersByStatus = ordersByStatus.map((status) => ({
      status: status.status,
      count: status.dataValues.count,
    }));

    // Respond with aggregated data
    res.status(200).json({
      orders: { total: totalOrders, byStatus: formattedOrdersByStatus },
      clients: { total: totalClients },
      products: { total: totalProducts },
      dealers: { total: totalDealers },
    });
  } catch (error) {
    // console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ error: 'Failed to fetch dashboard data. Please try again later.', text: error });
  }
};


module.exports = { getDashboardData };
