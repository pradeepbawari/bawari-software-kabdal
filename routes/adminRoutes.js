const express = require('express');
const bcrypt = require('bcrypt');
const db = require("../models");
const { generateToken } = require('../utiles/auth');
const { Admin } = require('../models'); // Adjust to your actual User model

const router = express.Router(); 

router.post('/login', async (req, res) => {
  const { email, password, first_name, last_name, role, company } = req.body;

  try {
    const user = await db.Admin.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/signup', async (req, res) => {
    const { email, password, first_name, last_name, role, company } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await db.Admin.create({ email, password: hashedPassword, first_name, last_name, role, company });
  
      const token = generateToken(newUser.id);
      res.status(201).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

module.exports = router;