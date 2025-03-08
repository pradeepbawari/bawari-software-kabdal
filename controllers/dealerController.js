// controllers/dealerController.js
const db = require('../models');
const { Dealer } = require('../models');

// Create Dealer
const createDealer = async (req, res) => {
  try {
    const { name, email, mobile_number, address, dealer_status, company } = req.body;

    if (!name || !email || !mobile_number) {
      return res.status(400).json({ error: 'All fields are required' });
    }
	const dealer = await db.Dealer.create({ name, email, mobile_number, address, dealer_status, company });
    res.status(201).json({ message: 'Dealer created successfully', dealer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch All Dealers
const getDealers = async (req, res) => {
	const {limit, offset, orderBy, filters} = req.body;
  try {
    const dealers = await db.Dealer.findAndCountAll({
	  where: filters, // Apply filters
      limit: parseInt(limit), // Apply limit
      offset: parseInt(offset), // Apply offset
      //order: orderBy.sort
	}); // Fetch all Dealers
    res.status(200).json({ dealers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListDealersCompanies = async (req, res) => {
	const {limit, offset, orderBy, filters} = req.body;
  try {
    const dealers = await db.Dealer.findAll({
      attributes: ['id', 'name', 'email', 'mobile_number', 'address', 'dealer_status', 'company'],
	}); // Fetch all Dealers
  
  const companies = await db.companyNew.findAll({
    attributes: ['company_id', 'name']
  })

  const dimensions = await db.Weight.findAll({
    attributes: ['unit']    
  })

  const uniqueValuesDiamension = await [...new Set(dimensions?.map(item => item.unit))];

    res.status(200).json({ dealerList: dealers, companyList: companies, dimensionList: uniqueValuesDiamension ?? [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Single Dealer
const getDealer = async (req, res) => {
  try {
    const dealer = await db.Dealer.findByPk(req.params.id); // Find Dealer by ID

    if (!dealer) {
      return res.status(404).json({ error: 'Dealer not found' });
    }

    res.status(200).json({ dealer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Dealer
const updateDealer = async (req, res) => {
  const { id, name, email, mobile_number, address, client_status, company } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Dealer ID is required' });
  }

  try {
    // Find the Dealer by ID
    const dealer = await Dealer.findByPk(id);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    // Update Dealer details
    dealer.name = name || dealer.name;
    dealer.email = email || dealer.email;
    dealer.mobile_number = mobile_number || dealer.mobile_number;
    dealer.address = address || dealer.address;
    dealer.client_status = client_status || dealer.client_status;
	dealer.company = company || dealer.company;

    // Save the updated Dealer
    await dealer.save();

    return res.status(200).json({ message: 'Dealer updated successfully', dealer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete Dealer
const deleteDealer = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the Dealer by ID
    const dealer = await Dealer.findByPk(id);
    if (!dealer) {
      return res.status(404).json({ message: 'Dealer not found' });
    }

    // Delete the Dealer
    await dealer.destroy();

    return res.status(200).json({ message: 'Dealer deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createDealer, getDealers, getDealer, updateDealer, deleteDealer, getListDealersCompanies };
