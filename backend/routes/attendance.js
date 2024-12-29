
const express = require('express');
const { createAttendance } = require('../controllers/attendanceController');
const router = express.Router();

router.post('/attendance', createAttendance);

module.exports = router;
