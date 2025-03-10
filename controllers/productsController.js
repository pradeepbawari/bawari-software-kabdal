// controllers/productsController.js
const db = require("../models");
const { Product, Dealer, Category, Color, Weight, Variant } = require("../models");
const { Op } = require('sequelize');
const subcategory = require("../models/subcategory");

const createProducts = async (req, res) => {
  try {
    const { 
      name, 
      stock, 
      gst_rate, 
      price, 
      sale_price, 
      category_id, 
      dealer_id, 
      company, 
      variants,
      subcategory_id
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Product name and at least one variant are required' });
    }

    // 1. Create the product
    const product = await db.Product.create({ 
      name, 
      stock, 
      gst_rate, 
      price, 
      sale_price, 
      category_id, 
      dealer_id, 
      company,
      subcategory_id 
    });
    const productId = product.id;

    // 2. Handle dealer associations
    if (dealer_id && dealer_id.length > 0) {
      const productDealerAssociations = dealer_id.map((dealerId) => ({
        product_id: productId,
        dealer_id: dealerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await db.ProductDealers.bulkCreate(productDealerAssociations);
    }

    // 3. Process variants
    if (productId &&variants || variants.length > 0) {
      const variantPromises = variants.map(async (variant) => {
        const { color, hex_code, weight, price, sale_price, stock, deleted, unit } = variant;
  
        // Find or create color
        let [colorRecord] = await db.Color.findOrCreate({
          where: { name: color },
          defaults: { hex_code },
        });
        const colorId = colorRecord.id;
  
        // Find or create weight
        let [weightRecord] = await db.Weight.findOrCreate({
          where: { weight, unit }, // Check for both weight and unit
        });
        console.log(weightRecord, "weightRecord");
        const weightId = weightRecord.id;
  
        // Create product variant
        return db.Variant.create({
          product_id: productId,
          color_id: colorId,
          weight_id: weightId,
          price,
          sale_price,
          stock,
          deleted
        });      
      });
  
      await Promise.all(variantPromises);  
    }
    
    const productWithDealers = await fetchAfterUpdate(productId);

    // Response
    res.status(201).json({ 
      message: 'Product created successfully', 
      productWithDealers,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const fetchAfterUpdate = async (productId) => {
  try {
    const fullProduct = await db.Product.findOne({
      where: { id: productId },
      include: [
        {
          model: db.Variant,
          as: 'variants',
          include: [
            { model: db.Color, as: 'color', attributes: ['name', 'hex_code'] },
            { model: db.Weight, as: 'weight', attributes: ['weight', 'unit'] },
          ],
        },
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    const productWithDealers = await Promise.all(
      [fullProduct].map(async (product) => {
        const dealerIds = product.dealer_id.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id)); // Parse dealer_id string
        const dealers = await db.Dealer.findAll({
          where: {
            id: {
              [Op.in]: dealerIds, // Fetch all dealers with parsed IDs
            },
          },
          attributes: ['id', 'name', 'company', 'email', 'mobile_number', 'dealer_status'],
        });
        return { ...product.toJSON(), dealers }; // Add dealers to product
      })
    );
    return productWithDealers;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const getAllProducts = async (req, res) => {
  const { limit, offset, orderBy, filters } = req.body;
  const parsedLimit = limit ? parseInt(limit, 10) : 10;
    const parsedOffset = offset ? parseInt(offset, 10) : 0;
    // const orderByCondition = [['createdAt', 'DESC']];
    const orderByCondition = [[orderBy[0].colId, orderBy[0].sort]];
    const whereCondition = filters || {}; 
  try {
    // Step 1: Fetch all products with associations
    const products = await db.Product.findAndCountAll({
      distinct: true,  // Ensure distinct count of products
      include: [
        {
          model: db.Variant,
          as: 'variants',
          include: [
            { model: db.Color, as: 'color', attributes: ['name', 'hex_code'] },
            { model: db.Weight, as: 'weight', attributes: ['weight','unit'] },
          ],
        },
        {
          model: db.ProductImage,
          as: 'imagesT',
          attributes: ['id', 'image_url', 'public_id', 'product_id'],
        },
        {
          model: db.Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: orderByCondition, // Apply the ordering condition
      where: whereCondition, // Apply the filters (or no filter if filters is null)
      limit: parsedLimit, // Apply pagination limit
      offset: parsedOffset, // Apply pagination offset
      distinct: true,  // Add this to fix duplicate count issue
      col: 'id' // Ensures distinct is applied correctly on primary key
    });
    
    // Post-process each product to fetch dealers based on dealer_id string
    const productWithDealers = await Promise.all(
      products.rows.map(async (product) => {
        const dealerIds = product.dealer_id.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id)); // Parse dealer_id string
        const dealers = await db.Dealer.findAll({
          where: {
            id: {
              [Op.in]: dealerIds, // Fetch all dealers with parsed IDs
            },
          },
          attributes: ['id', 'name', 'company', 'email', 'mobile_number', 'dealer_status'],
        });
        return { ...product.toJSON(), dealers }; // Add dealers to product
      })
    );

    res.json({ products: {
        count: products.count,
        rows: productWithDealers
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

const updateProducts = async (req, res) => {
  try {
    const { id, name, stock, gst_rate, price, sale_price, category_id, dealer_id, company, variants, subcategory_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required for updating.' });
    }

    // 1. Update the main product details
    const product = await db.Product.update(
      { name, stock, gst_rate, price, sale_price, category_id, dealer_id, company, subcategory_id },
      { where: { id } }
    );

    if (!product[0]) { // Sequelize returns an array, where [0] is the number of affected rows
      return res.status(404).json({ error: 'Product not found.' });
    }

    // 2. Update Variants
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        const { variant_id, color, hex_code, weight, price, sale_price, stock, deleted, weight_id, unit } = variant;

        // Find or create color
        const [colorRecord] = await db.Color.findOrCreate({
          where: { name: color },
          defaults: { hex_code },
        });
        const colorId = colorRecord.id;

        // Find or create the weight
        let weightRecord;
        if (weight_id) {
          // If weight_id is provided, we check for the existing weight.
          weightRecord = await db.Weight.findOne({ where: { id: weight_id } });
          if (weightRecord) {
            //console.log(`Updating existing weight record (ID: ${weightRecord.id}) with weight: ${weight}`);
            // Update the weight only if necessary (optional)
            await db.Weight.update(
              { weight, unit }, // Update the weight field
              { where: { id: weightRecord.id } }
            );
          } else {
            return res.status(400).json({ error: `Weight with ID ${weight_id} not found.` });
          }
        } else {
          // If weight_id is not provided, create a new weight record
          console.log(`Creating new weight record for weight: ${weight}`);
          weightRecord = await db.Weight.create({
            weight, unit
          });
        }

        const weightId = weightRecord.id;

        // Check if the variant exists
        if (variant_id) {
          if (deleted) {
            console.log(`Deleting variant with ID: ${variant_id}`);
            await db.Variant.destroy({ where: { id: variant_id } });
          } else {
            const existingVariant = await db.Variant.findOne({ where: { id: variant_id, product_id: id } });
            if (existingVariant) {
              // Update the existing variant
              console.log(`Updating variant with ID: ${variant_id}`);
              await db.Variant.update(
                { color_id: colorId, weight_id: weightId, price, sale_price, stock },
                { where: { id: variant_id } }
              );
            } else {
              return res.status(400).json({ error: `Variant with ID ${variant_id} not found for this product.` });
            }
          }
        } else {
          // Create a new variant if `variant_id` is not provided
          console.log(`Creating new variant for product ID: ${id}`);
          await db.Variant.create({
            product_id: id,
            color_id: colorId,
            weight_id: weightId,
            price,
            sale_price,
            stock,
            deleted
          });
        }
      }
    }
    const productWithDealers = await fetchAfterUpdate(id);
    res.status(200).json({ message: 'Product and variants updated successfully.', productWithDealers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const deleteProducts = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // 1. Delete Variants
    await db.Variant.destroy({ where: { product_id: id } });

    // 2. Delete Dealer Associations
    await db.ProductDealers.destroy({ where: { product_id: id } });

    // 3. Delete Product
    await db.Product.destroy({ where: { id } });

    const productWithDealers = [{id:parseInt(id)}]

    res.status(200).json({ message: 'Product deleted successfully', productWithDealers});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const filterProducts = async (req, res) => {
  const { limit, offset, orderBy, filters } = req.body;
  const parsedLimit = limit ? parseInt(limit, 10) : 10;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;
  const orderByCondition = orderBy?.length ? [[orderBy[0].colId, orderBy[0].sort]] : [['createdAt', 'DESC']];

  // Build the dynamic where condition based on filter priority
  let whereCondition = {};
  
  if (filters) {
    if (filters.parent_id === null) {
      if (filters.id) {
        whereCondition.subcategory_id = filters.id;
      } else if (filters.category_id) {
        whereCondition.category_id = filters.category_id;
      }
    } else {
      if (filters.parent_id !== null) {
        whereCondition['subcategory_id'] = filters.parent_id
        // whereCondition.parent_id = filters.parent_id;
      }else{
      // If parent_id is not null, use normal filters
      whereCondition = filters;
      }      
    }
  }

  try {
    const products = await db.Product.findAndCountAll({
      distinct: true,
      include: [
        {
          model: db.Variant,
          as: "variants",
          include: [
            { model: db.Color, as: "color", attributes: ["name", "hex_code"] },
            { model: db.Weight, as: "weight", attributes: ["weight", "unit"] },
          ],
        },
        {
          model: db.ProductImage,
          as: "imagesT",
          attributes: ["id", "image_url", "public_id", "product_id"],
        },
        {
          model: db.Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      order: orderByCondition,
      where: whereCondition, // Use dynamically constructed whereCondition
      limit: parsedLimit,
      offset: parsedOffset,
      distinct: true,
      col: "id",
    });

    // Process dealer information
    const productWithDealers = await Promise.all(
      products.rows.map(async (product) => {
        const dealerIds = product.dealer_id
          ? product.dealer_id.split(",").map((id) => parseInt(id.trim())).filter((id) => !isNaN(id))
          : [];
        
        const dealers = dealerIds.length
          ? await db.Dealer.findAll({
              where: { id: { [Op.in]: dealerIds } },
              attributes: ["id", "name", "company", "email", "mobile_number", "dealer_status"],
            })
          : [];

        return { ...product.toJSON(), dealers };
      })
    );

    res.json({
      products: {
        count: products.count,
        rows: productWithDealers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const filterUserProducts = async (req, res) => {
  // const { limit, offset, orderBy, filters } = req.body;
  // const orderByCondition = [[orderBy[0].colId, orderBy[0].sort]];
  // try {
  //   const products = await db.Product.findAll({
  //     attributes: ["id", "name", "company", "category_id", "subcategory_id", "updatedAt", "createdAt"],
  //     include: [
  //       {
  //         model: db.Variant,
  //         as: "variants",
  //         attributes: ["id", "product_id", "weight_id"],
  //         required: false,
  //         include: [{ model: db.Weight, as: "weight", attributes: ["weight", "unit"] }],
  //       },
  //       {
  //         model: db.Category,
  //         as: "category",
  //         attributes: ["id", "name"],
  //         required: false,
  //       },
  //     ],
  //     // order: [["updatedAt", "DESC"]], // Sort for faster retrieval
  //     order: ["product_id"],
  //     raw: true, // Fetch data as plain JSON (faster)
  //     nest: true, // Ensures nested JSON format
  //   });

  //   res.status(200).json({
  //     products: {
  //       message: "Products fetched successfully",
  //       count: products.length,
  //       rows: products,  
  //     }
  //   });
  // } catch (error) {
  //   console.error("Error fetching products:", error);
  //   res.status(500).json({ error: "Failed to fetch products" });
  // }

  const { limit, offset, orderBy, filters } = req.body;
    const orderByCondition = [[orderBy[0].colId, orderBy[0].sort]];
    const whereCondition = filters || {}; 
  try {
    // Step 1: Fetch all products with associations
    const products = await db.Product.findAll({
      distinct: true,  // Ensure distinct count of products
      include: [
        {
          model: db.Variant,
          as: 'variants',
          include: [
            { model: db.Color, as: 'color', attributes: ['name', 'hex_code'] },
            { model: db.Weight, as: 'weight', attributes: ['weight','unit'] },
          ],
        },
      ],
      order: orderByCondition, // Apply the ordering condition
      where: whereCondition, // Apply the filters (or no filter if filters is null)
      distinct: true,  // Add this to fix duplicate count issue
      col: 'id', // Ensures distinct is applied correctly on primary key
    });
    
    res.json({ products: {
        count: 0,
        rows: products
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};




module.exports = {
  createProducts,
  getAllProducts,
  updateProducts,
  deleteProducts,
  filterProducts,
  filterUserProducts
};
