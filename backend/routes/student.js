const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const StudentController = require('../controllers/studentController');

router.post('/student-register', StudentController.registerStudent);


router.get('/approved-students', auth(['admin', 'teacher']), StudentController.getApprovedStudents);


router.get('/pending-students', auth(['admin']), StudentController.getPendingStudents);


router.put('/approve-student/:id', auth(['admin', 'teacher']),StudentController.approveStudent);


router.put('/reject-student/:id',auth(['admin', 'teacher']), StudentController.rejectStudent);

router.put('/update-student/:id', auth(['admin', 'teacher']),StudentController.updateStudent);

module.exports = router;
