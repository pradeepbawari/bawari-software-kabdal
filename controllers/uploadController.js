// controllers/uploadController.js
const db = require("../models");
const { ProductImage } = require('../models');
const { upload, uploadImagesToCloudinary, saveImagesToDatabase, updateImagesToDatabase, updateImage, deleteImagesToDatabase } = require('../uploadImages/imageUpload');

// Create a new category
const createUpload = async (req, res) => {
  try {
    const { id, page } = req.body;
    
    if (!id && !req.files) {
      return res.status(400).json({ error: 'field is required' });
    }
    const uploadedImageUrls = await uploadImagesToCloudinary(req.files);

    // Save the Cloudinary URLs to the database (ProductImages table)
    const images = await saveImagesToDatabase(uploadedImageUrls, id, page);

    res.status(200).json({
      message: 'Images uploaded and saved successfully!',
      images
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteUpload = async (req, res) => {
    try {
      const { productId, imageId, publicId, page } = req.body;
      if (!productId, !imageId, !publicId) {
        return res.status(400).json({ error: 'All fields are required' });
      }
      const images = await deleteImagesToDatabase(productId, imageId, publicId, page);
      res.status(201).json({ message: 'Image update successfully', images });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const getAllUpload = async (req, res) => {
  try {
    const { productId, page } = req.body;

      const images = (page === 'productPage') ? await db.ProductImage.findAll({
            where: { product_id: productId },
            attributes: ['id', 'image_url', 'public_id'],  // Return only the image data
          }) : await db.OrderImage.findAll({
            where: { order_id: productId },
            attributes: ['id', 'image_url', 'public_id'],  // Return only the image data
          });
    if (images.length === 0) {
    return res.status(200).json({ message: 'No images found for this product' });
    }

    // Send the images back as the response
    return res.status(200).json({
    message: 'Images fetched successfully',
    images: images,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const uploadPDF = async (req, res) => {
  try {
    const pdfUrl = `http://localhost:3000/invoice/${req.file.filename}`;
    res.status(200).json({ message: 'successfull', pdfUrl: pdfUrl});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createUpload, deleteUpload, getAllUpload, uploadPDF
};
