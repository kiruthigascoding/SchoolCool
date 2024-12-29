const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const StudentController = require('../controllers/studentController');

router.post('/student-register', StudentController.registerStudent);




router.get('/pending-students', auth(['admin']), StudentController.getPendingStudents);

router.get('/generate-student-id/:admissionYear', auth(['admin']), StudentController.getGeneratedStudentId);


router.put('/approve-student/:id', auth(['admin', 'teacher']),StudentController.approveStudent);


router.put('/reject-student/:id',auth(['admin', 'teacher']), StudentController.rejectStudent);

router.put('/update/:studentId', auth(['admin', 'teacher']), StudentController.updateStudent);

router.get('/', auth(['admin', 'teacher']), StudentController.getAllStudents);

// Get a student by ID
router.get('/:studentId', auth(['admin', 'teacher']),StudentController.getStudentById);

// Update student details
//router.put('/:studentId', auth(['admin', 'teacher']),StudentController.updateStudent);

// Delete a student
router.delete('/delete/:studentId', auth(['admin', 'teacher']),StudentController.deleteStudent);


module.exports = router;
