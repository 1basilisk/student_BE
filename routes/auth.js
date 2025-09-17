// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  const { name, email, password,course, role } = req.body;
  

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed, role });
    await user.save();

    if (role === 'student') {
    
      const student = new Student({ name, email, course});
      await student.save();
    }


    res.status(201).json({ msg: 'User created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//password change
router.put('/change-password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: req.user.id });
   
    const isMatch = await bcrypt.compare(currentPassword, user.password);
   
    if (!isMatch) return res.status(400).json({ msg: 'Old password is incorrect' });
   
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();
    res.json({ msg: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
