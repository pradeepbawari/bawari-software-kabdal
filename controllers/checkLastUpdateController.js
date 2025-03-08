// controllers/categoryController.js
const db = require("../models");
const { User, Product } = require('../models'); // Assuming you have models set up
const { Sequelize } = require('sequelize');

const getLastUpdatedTime = async () => {
  try {
    // Get the latest `last_updated` from Users
    const latestUser = await db.User.findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('updatedAt')), 'lastUpdated']],
      raw: true,
    });

    // Get the latest `last_updated` from Products
    const latestProduct = await db.Product.findOne({
      attributes: [[Sequelize.fn('max', Sequelize.col('updatedAt')), 'lastUpdated']],
      raw: true,
    });

    // Compare the two dates to find the most recent update time
    const userLastUpdated = latestUser ? new Date(latestUser.lastUpdated) : new Date(0); // Default to 0 if no result
    const productLastUpdated = latestProduct ? new Date(latestProduct.lastUpdated) : new Date(0);
	
	
    // Return the most recent timestamp
    //const lastUpdated = userLastUpdated > productLastUpdated ? userLastUpdated : productLastUpdated;
	const lastUpdated = {'user': userLastUpdated, 'product': productLastUpdated};

    //return lastUpdated.toISOString(); // Return ISO string format for consistency
	return lastUpdated; // Return ISO string format for consistency
  } catch (err) {
    console.error('Error fetching last updated time:', err);
    throw err; // You can handle the error based on your needs
  }
};

// Function to get the last updated timestamp for data
const getLastUpdatedTimestamp = async (req, res) => {
  try {
    const lastUpdated = await getLastUpdatedTime();
    res.json({ lastUpdated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch last updated time' });
  }
};

module.exports = { getLastUpdatedTimestamp };
