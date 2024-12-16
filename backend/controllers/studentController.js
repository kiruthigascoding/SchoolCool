const StudentRegistration = require("../models/StudentRegistration");
const StudentDetails = require("../models/StudentDetails");
const validator = require("validator");


const registerStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      grade,
      dob,
      gender,
      parentName,
      parentEmail,
      parentPhone,
    } = req.body;

    
    if (
      !firstName ||
      !lastName ||
      !grade ||
      !dob ||
      !gender ||
      !parentName ||
      !parentEmail ||
      !parentPhone
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(parentEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(parentPhone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    
    const existingStudent = await StudentRegistration.findOne({
      $or: [{ parentEmail }, { parentPhone }],
    });
    if (existingStudent) {
      return res
        .status(400)
        .json({
          message:
            "A student with the same email or phone number already exists.",
        });
    }

    
    const newStudent = new StudentRegistration({
      firstName,
      lastName,
      grade,
      dob,
      gender,
      parentName,
      parentEmail,
      parentPhone,
      status: "pending",
    });
    await newStudent.save();
    res
      .status(201)
      .json({
        message: "Student registered successfully, awaiting admin approval.",
        studentId: newStudent._id,
      });
  } catch (error) {
    console.error("Error during registration:", error);
    res
      .status(500)
      .json({
        message: "An error occurred during student registration",
        error: error.message,
      });
  }
};
const generateStudentIdForYear = async (admissionYear) => {
    try {
      
      const latestStudent = await StudentDetails.findOne({ studentId: new RegExp(`^${admissionYear}`, 'i') })
        .sort({ studentId: -1 }) 
        .limit(1);
  
      let nextId = 1; 
  
      if (latestStudent) {
        
        const lastIdNumber = parseInt(latestStudent.studentId.slice(admissionYear.length), 10);
        nextId = lastIdNumber + 1;
      }
  
      
      const studentId = `${admissionYear}${String(nextId).padStart(3, '0')}`;
  
      return studentId;
    } catch (error) {
      console.error("Error generating student ID:", error);
      throw new Error("Error generating student ID.");
    }
  };
  
  
  const approveStudent = async (req, res) => {
    const studentId = req.params.id; 
    const { firstName, lastName, grade, dob, parentName, parentEmail, parentPhone, classAssigned, admissionYear, teachersAssigned } = req.body;
  
    
    if (!studentId || !classAssigned || !admissionYear || !teachersAssigned || !firstName || !lastName) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    try {
      
      const generatedStudentId = await generateStudentIdForYear(admissionYear);
  
      
      const existingStudent = await StudentDetails.findOne({ studentId: generatedStudentId });
      if (existingStudent) {
        return res.status(400).json({ message: `Student with ID ${generatedStudentId} already exists.` });
      }
  
      
      const studentDetails = new StudentDetails({
        studentId: generatedStudentId,
        firstName,
        lastName,
        grade,
        dob,
        parentName,
        parentEmail,
        parentPhone,
        classAssigned,
        admissionDate: new Date(`${admissionYear}-01-01`), 
        teachersAssigned,
      });
  
      await studentDetails.save();
  
      const deletedStudent = await StudentRegistration.findByIdAndDelete(studentId);

      if (!deletedStudent) {
        return res.status(404).json({ message: "Student not found in registration list" });
      }
  
      res.status(200).json({ message: "Student approved and removed from registration list" });
    } catch (error) {
      console.error("Error saving student:", error);
      res.status(500).json({ message: "Failed to approve student" });
    }
  };

const rejectStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await StudentRegistration.findByIdAndUpdate(studentId, {
      status: "rejected",
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student rejected" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting student", error: error.message });
  }
};


const getApprovedStudents = async (req, res) => {
  try {
    const approvedStudents = await StudentDetails.find();
    if (!approvedStudents || approvedStudents.length === 0) {
      return res.status(404).json({ message: "No approved students found" });
    }
    res.status(200).json(approvedStudents);
  } catch (error) {
    console.error("Error fetching approved students:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch approved students." });
  }
};


const getPendingStudents = async (req, res) => {
  try {
    const pendingStudents = await StudentRegistration.find({
      status: "pending",
    });
    res.status(200).json(pendingStudents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending students" });
  }
};

const updateStudent = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const student = await StudentDetails.findByIdAndUpdate(id, updatedData, { new: true });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      return res.status(200).json(student);
    } catch (error) {
      console.error('Error updating student:', error);
      return res.status(500).json({ message: 'Error updating student' });
    }
  };

module.exports = {
  registerStudent,
  approveStudent,
  rejectStudent,
  getApprovedStudents,
  getPendingStudents,
  updateStudent,
};
