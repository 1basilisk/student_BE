const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  course: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
