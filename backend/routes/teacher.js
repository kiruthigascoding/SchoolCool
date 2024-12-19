const express = require('express');
const router = express.Router();
const StaffDetails = require('../models/StaffDetails');
const StudentDetails = require('../models/StudentDetails');

router.get('/dashboard/:email', async (req, res) => {
    try {
      const { email } = req.params;
      
      const teacher = await StaffDetails.findOne({ email });
  
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      res.json({
        teacher: {
          fullName: `${teacher.firstName} ${teacher.lastName}`,
          staffId: teacher.staffId,
          employmentStatus: teacher.employmentStatus,
          department: teacher.department,
          position: teacher.position,
          teachingSubjects: teacher.teachingSubjects,
        },
        students: [], 
      });
    } catch (error) {
      console.error('Error fetching teacher dashboard data:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  
  

module.exports = router;
