// imageUpload.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const db = require("../models");
const path = require('path');
const fs = require('fs');
const { ProductImage, OrderImage } = require('../models'); // Adjust path if needed

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup (temporary file storage on server)
const upload = multer({ dest: 'uploads/' }); 

// Function to upload images to Cloudinary
const uploadImagesToCloudinary = async (files) => {
  const uploadedImages = [];
  
  for (const file of files) {
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
      folder: 'products', // You can adjust the folder name as needed
    });
    // console.log(cloudinaryResponse.public_id, 'fsdfdsfsdfdsk');
    
    uploadedImages.push({url: cloudinaryResponse.secure_url, key: cloudinaryResponse.public_id}); // Store the image URL
    // Optionally, delete the file from server after upload
    fs.unlinkSync(file.path);
  }

  return uploadedImages;
};

// Function to save the image URLs to the database
const saveImagesToDatabase = async (imageUrls, productId, productPage) => {
  
  if (productPage === 'productPage') {
    return db.ProductImage.bulkCreate(
      imageUrls.map((url) => ({
        image_url: url.url,
        product_id: productId, // Correct field
        public_id: url.key
      }))
    );
  } else {
    // Correct the typo: `roder_id` should be `order_id`
    return db.OrderImage.bulkCreate(
      imageUrls.map((url) => ({
        image_url: url.url,
        order_id: productId, // Corrected field
        public_id: url.key
      }))
    );
  }
};
const saveLogoToDatabase = async (imageUrls, id, email, mobile, address, gstin, company) => {
  try {
    // Check if a record with the same ID already exists
    const existingSetting = await db.Setting.findOne({ where: { id: id } });

    if (existingSetting) {
      // Update the existing record
      await existingSetting.update({
        company: company,
        address: address,
        gstin: gstin,
        email: email,
        logo: imageUrls[0].url,
        public_id: imageUrls[0].key,
        mobile: mobile
      });
      return existingSetting;
    }
    // Proceed with inserting new records
    const setting = imageUrls.map((url) => ({
      id: id,  // Assuming you want to manually set the ID
      company: company,
      address: address,
      gstin: gstin,
      email: email,
      logo: url.url,
      public_id: url.key,
    }));

    await db.Setting.bulkCreate(setting);
    return setting;
  } catch (error) {
    console.error('Error saving logo to database:', error);
    throw new Error('Failed to save logo to database');
  }
};



const deleteImagesFromCloudinary = async (imageIds) => {
  try {
    // Map through each imageId and call Cloudinary's destroy method
    const deletePromises = imageIds.map((imageId) =>
      cloudinary.uploader.destroy(imageId) // The public ID of the image to delete
    );

    // Wait for all deletion promises to complete
    const results = await Promise.all(deletePromises);

    // Check the results
    results.forEach((result, index) => {
      if (result.result === 'ok') {
        console.log(`Image with ID ${imageIds[index]} deleted successfully from Cloudinary`);
      } else {
        console.error(`Failed to delete image with ID ${imageIds[index]}`);
      }
    });

    return results; // Return the results (could be used for logging or further processing)
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error; // Rethrow the error for handling in the calling function
  }
};


// const publicId = 'product_images/sample_image'; // Public ID of the existing image
// const filePath = 'path/to/new/image.jpg';

const deleteImagesToDatabase = async (productId, imageId, publicId, page) => {
    const result = await deleteImagesFromCloudinary([publicId]);
    (page === 'productPage') ? await db.ProductImage.destroy({
        where: {
          product_id: productId, 
          id: imageId
        }}) : 
        await db.OrderImage.destroy({
          where: {
            order_id: productId, 
            id: imageId
        }});
  };

  const deleteLogoToDatabase = async (publicId) => {
    const result = await deleteImagesFromCloudinary([publicId]);   
  };


  const storagePDF = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'invoice/'); // Specify the upload directory
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Add unique suffix
    },
  });
  
  // Initialize the Multer upload middleware
  const uploadPDF = multer({
    storage: storagePDF,
    limits: { fileSize: 50 * 1024 * 1024 },  // Set file size limit (e.g., 50MB)
    fileFilter: (req, file, cb) => {
      // You can restrict file types here (PDF, Images, etc.)
      if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('pdf/')) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF and images are allowed.'));
      }
    },
  });  

// Export upload handler and image upload helper functions
module.exports = {
  upload, // For use in routes
  uploadImagesToCloudinary,
  deleteImagesToDatabase,
  saveLogoToDatabase,
  deleteLogoToDatabase,
  saveImagesToDatabase,
  uploadPDF
};
