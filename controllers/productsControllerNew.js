// controllers/productsController.js
const db = require("../models");
const { Product, Dealer, Category, Color, Weight, Variant } = require("../models");
const { Op } = require('sequelize');
const companyNew = require("../models/companyNew");


const getAllProducts = async (req, res) => {
  const { limit, offset, orderBy, filters } = req.body;
  const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    // const orderByCondition = [['createdAt', 'DESC']];
    const orderByCondition = [[orderBy[0].colId, orderBy[0].sort]];
    const whereCondition = filters || {}; 
  try {
    // Step 1: Fetch all products with associations
    const products = await db.productNew.findAndCountAll({
      include: [
        { model: db.companyNew, attributes: ["name"] },
        { model: db.productAttribute, attributes: ["attribute_name", "attribute_value"] },
      ],
      // order: orderByCondition, // Apply the ordering condition
      where: whereCondition, // Apply the filters (or no filter if filters is null)
      limit: parsedLimit, // Apply pagination limit
      offset: parsedOffset, // Apply pagination offset
    });
    
    // Post-process each product to fetch dealers based on dealer_id string
    // const productWithDealers = await Promise.all(
    //   products.rows.map(async (product) => {
    //     const dealerIds = product.dealer_id.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id)); // Parse dealer_id string
    //     const dealers = await db.Dealer.findAll({
    //       where: {
    //         id: {
    //           [Op.in]: dealerIds, // Fetch all dealers with parsed IDs
    //         },
    //       },
    //       attributes: ['id', 'name', 'company', 'email', 'mobile_number', 'dealer_status'],
    //     });
    //     return { ...product.toJSON(), dealers }; // Add dealers to product
    //   })
    // );

    res.json({ products: {
        count: products.count,
        rows: products.rows
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};



module.exports = {
  getAllProducts,
};
