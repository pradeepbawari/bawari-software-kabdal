// controllers/userController.js
const db = require('../models');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken } = require('../utiles/auth');

// Create User
const createUser = async (req, res) => {
  try {
    const { name, email, mobile_number, address, client_status='fake', company, gstin, password, role='user' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!name || !email || !mobile_number || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
	const user = await db.User.create({ name, email, mobile_number, address, client_status, company, gstin, password: hashedPassword, role });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch All Users
const getUsers = async (req, res) => {
	const {limit, offset, orderBy, filters} = req.body;
  try {
    const users = await db.User.findAndCountAll({
	  where: filters, // Apply filters
      limit: parseInt(limit), // Apply limit
      offset: parseInt(offset), // Apply offset
      //order: orderBy.sort
	}); // Fetch all users
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Single User
const getUser = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id); // Find user by ID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { id, name, email, mobile_number, address, client_status, company, gstin } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile_number = mobile_number || user.mobile_number;
    user.address = address || user.address;
    user.client_status = client_status || user.client_status;
    user.company = company || user.company;
    user.gstin = gstin || user.gstin;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // const companyDetails = await db.Setting.findOne({ where: { id: user.id } });
    const token = generateToken(user.id);
    return res.status(200).json({ token: token, companyDetails: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error user', error: err });
  }
}

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser, loginUser };
