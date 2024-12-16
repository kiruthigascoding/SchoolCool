const mongoose = require('mongoose');

// Define the AttendanceRecord schema
const attendanceRecordSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentDetails', // Reference to the Student model
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, 
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'], 
    required: true,
  },
});


const AttendanceRecord = mongoose.model('AttendanceRecord', attendanceRecordSchema);

module.exports = AttendanceRecord;
