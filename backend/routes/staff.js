const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const StaffDetails = require('../models/StaffDetails');

router.get('/all-staff', auth(['admin']),async (req, res) => {
  try {
    const staff = await StaffDetails.find();
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/add-staff', auth(['admin']),async (req, res) => {
  const { staffId, firstName, lastName, email, phone, employmentStatus, department, position,teachingSubjects } = req.body;
  
  try {
    const newStaff = new StaffDetails({
      staffId,  
      firstName,
      lastName,
      email,
      phone,
      employmentStatus,
      department,
      position,
      teachingSubjects
    });

    await newStaff.save();
    res.status(201).json(newStaff);
  } catch (err) {
    console.error('Error adding staff:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.put('/update-staff/:staffId',auth(['admin']),async (req, res) => {
  try {
    const { staffId } = req.params;
    const updateData = req.body;

  
    const updatedStaff = await StaffDetails.findOneAndUpdate(
      { staffId: staffId }, 
      { $set: updateData }, 
      { new: true }           
    );

    if (!updatedStaff) {
      return res.status(404).send('Staff member not found');
    }

    res.status(200).json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/last-staff-id',auth(['admin']), async (req, res) => {
  try {
    const lastStaff = await StaffDetails.findOne().sort({ staffId: -1 }).limit(1);
    if (lastStaff) {
      return res.json({ staffId: lastStaff.staffId });
    } else {
      return res.json({ staffId: 's202400' }); 
    }
  } catch (error) {
    console.error('Error fetching last staff ID:', error);
    res.status(500).send('Internal Server Error');
  }
});


router.delete('/delete-staff/:staffId',auth(['admin']), async (req, res) => {
  try {
    
    const deletedStaff = await StaffDetails.findOneAndDelete({ staffId: req.params.staffId });

    
    if (!deletedStaff) {
      return res.status(404).send('Staff member not found');
    }

    
    res.status(200).send('Staff member deleted');
  } catch (error) {
    console.error('Error deleting staff:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
