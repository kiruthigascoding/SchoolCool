const mongoose = require('mongoose');

const studentDetailsSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },  // To store the custom student ID
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  grade: { type: String, required: true },
  dob: { type: Date, required: true },
  parentName: { type: String, required: true },
  parentEmail: { type: String, required: true },
  parentPhone: { type: String, required: true },
  classAssigned: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  teachersAssigned: [{ type: String }],  // Teachers assigned to the student
});

const StudentDetails = mongoose.model('StudentDetails', studentDetailsSchema);

module.exports = StudentDetails;
