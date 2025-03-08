// controllers/userController.js
const db = require('../models');
const { User } = require('../models');
const { deleteImagesToDatabase, saveLogoToDatabase, deleteLogoToDatabase, uploadImagesToCloudinary } = require('../uploadImages/imageUpload');

// Create User
// const createSetting = async (req, res) => {
//   try {
//     const { email, mobile, address, gstin, logo, company } = req.body;

//     if (!email || !mobile || !address || !gstin || !logo || !company) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }
// 	const setting = await db.Setting.create({ email, mobile, address, gstin, logo, company });
//     res.status(201).json({ message: 'Setting created successfully', setting });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const createSetting = async (req, res) => {
  try {
    const { id, email, mobile, address, gstin, company, public_id, logupdate, logo } = req.body;
    
    // const uploadedImageUrls = await uploadImagesToCloudinary(req.files);
    // const uploadedImageUrls = await deleteImagesFromCloudinary(req.files);
    if(logupdate === 'Yes'){
      await deleteLogoToDatabase(public_id);
      const uploadedImageUrls = await uploadImagesToCloudinary(req.files);  
      const setting = await saveLogoToDatabase(uploadedImageUrls, id, email, mobile, address, gstin, company);
      res.status(200).json({
        message: 'Images uploaded and saved successfully!',
        setting
      });
    } else {   

    // Save the Cloudinary URLs to the database (ProductImages table)
    const setting = await saveLogoToDatabase([{url:logo, key: public_id}], id, email, mobile, address, gstin, company);

    res.status(200).json({
      message: 'Images uploaded and saved successfully!',
      setting
    });
  }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch All Users
const getSetting = async (req, res) => {
  try {
    const setting = await db.Setting.findAndCountAll(); // Fetch all users
    res.status(200).json({ setting });
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

const updateLogo = async (req, res) => {
  try {
    const { id, logo } = req.body;  
    const settingdata = await db.Setting.findByPk(id); // Find user by ID
    if (!settingdata) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    settingdata.logo = logo || settingdata.logo;
    await setting.save();
    res.status(200).json({ message: 'Logo updated successfully', settingdata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
    }
}

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

module.exports = { createSetting, getSetting, updateLogo };
