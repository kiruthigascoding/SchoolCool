const mongoose = require('mongoose');

const staffDetailsSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },  // Use staffId here instead of _id
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  employmentStatus: { type: String, required: true },
  department: { type: String, required: true, enum: ['Maths', 'Science', 'Music', 'PE', 'Language/Arts', 'Social Studies', 'Technology', 'Cultural', 'Food', 'Health and Hygiene', 'Administration'] },
  position: { type: String, required: true, enum: ['Select','Teacher', 'Principal', 'Vice Principal', 'Counselor', 'Librarian', 'Curriculum Coordinator', 'Instructional Coach', 'School Secretary', 'Administrative Assistant', 'HR Manager', 'Accounts', 'Finance Officer', 'Receptionist', 'School Nurse', 'Facilities Manager', 'IT Technician'] },
  teachingSubjects: { type: String }
});

const StaffDetails = mongoose.model('StaffDetails', staffDetailsSchema);
module.exports = StaffDetails;
