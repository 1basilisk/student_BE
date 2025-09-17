// routes/student.js
const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();



// Student: Get own profile
router.get('/me', auth, async (req, res) => {
  const student = await Student.findOne({ email: req.user.id });

  res.json(student);
});

// Student: Update own profile
router.put('/me', auth, async (req, res) => {
  const student = await Student.findOneAndUpdate({ email: req.user.id }, req.body, { new: true });
  res.json(student);
})

// Admin: Get all students
router.get('/', auth, adminOnly, async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Admin: Add student
router.post('/', auth, adminOnly, async (req, res) => {
  const { name, email, course } = req.body;
  const student = new Student({ name, email, course });
  await student.save();
  password = `${name.split(' ')[0]}@123`; // Default password
  const hashed = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashed, student });
  await user.save();


  res.status(201).json(student);
});

// Admin: Edit student
router.put('/:id', auth, adminOnly, async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(student);
});

// Admin: Delete student
router.delete('/:id', auth, adminOnly, async (req, res) => {

  try {
    const email = (await Student.findById(req.params.id)).email;
    await Student.findByIdAndDelete(req.params.id);
    await User.deleteOne({ email: email });
    res.json({ msg: 'Deleted' });


  }
  catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

;

module.exports = router;
