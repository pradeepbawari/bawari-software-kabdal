// controllers/userController.js
const db = require('../models');
const { Comments } = require('../models');

// Create User
const createComments = async (req, res) => {
  try {
    const { order_id, comment_text } = req.body;

    if (!order_id && !comment_text) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  const commentsData = await db.Comments.create({ order_id, comment_text });
    res.status(201).json({ message: 'Comments created successfully', commentsData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { order_id } = req.body;

    // Check if order_id is provided
    if (!order_id) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    // Fetch all comments associated with the given order_id
    const comments = await db.Comments.findAll({
      where: { order_id },
      attributes: ['comment_id', 'comment_text', 'updatedAt'], // Optional: specify fields to return
      order: [['updatedAt', 'ASC']] // Optional: order by creation date
    });

    if (!comments || comments.length === 0) {
      return res.status(200).json({ message: 'No comments found for this order', comments});
    }

    res.status(200).json({message: 'Comments fetched successfully', comments}); // Return the fetched comments
  } catch (error) {
    console.error(error); // Debugging purpose
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createComments, getComments };
