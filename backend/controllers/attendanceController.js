const AttendanceRecord = require('../models/AttendanceRecord');
const StudentDetails = require('../models/StudentDetails');


async function createAttendance(req, res) {
  try {
    const { studentId, status } = req.body; 

    
    const student = await StudentDetails.findOne({ studentId });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    
    const attendanceRecord = new AttendanceRecord({
      studentId: student._id,
      studentName: `${student.firstName} ${student.lastName}`,
      status,
    });

   
    await attendanceRecord.save();
    res.status(201).json({ message: 'Attendance record created', attendanceRecord });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ message: 'Failed to create attendance record' });
  }
}


module.exports = { createAttendance };