const mongoose = require('mongoose');

const studentRegistrationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  grade: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }, // Added status field
  rejectionReason: { type: String }, // Optional field for rejection reason
  
});

module.exports = mongoose.model('StudentRegistration', studentRegistrationSchema);