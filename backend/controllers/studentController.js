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

    // Validate required fields
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
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(parentEmail)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    // Validate phone number format
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(parentPhone)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid phone number format" });
    }

    // Check if the student already exists with the same email or phone
    const existingStudent = await StudentRegistration.findOne({
      $or: [{ parentEmail }, { parentPhone }],
    });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          "A student with the same email or phone number already exists.",
      });
    }

    // Create new student registration
    const newStudent = new StudentRegistration({
      firstName,
      lastName,
      grade,
      dob,
      gender,
      parentName,
      parentEmail,
      parentPhone,
      status: "pending", // default status is pending
    });

    await newStudent.save();

    // Respond with success message
    res.status(201).json({
      success: true,
      message: "Student registered successfully, awaiting admin approval.",
      studentId: newStudent._id,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during student registration.",
      error: error.message,
    });
  }
};

const approveStudent = async (req, res) => {
  const studentId = req.params.id;  // studentId from the URL
  const {
    firstName,
    lastName,
    grade,
    dob,
    parentName,
    parentEmail,
    parentPhone,
    classAssigned,
    admissionYear,
    teachersAssigned,
    studentId: generatedStudentId, // studentId passed in request body
  } = req.body;

  // Check if all required fields are present
  if (
    !studentId ||
    !classAssigned ||
    !admissionYear ||
    !teachersAssigned ||
    !firstName ||
    !lastName ||
    !generatedStudentId
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  console.log("Received studentId:", studentId);
  console.log("Received request body:", req.body);

  try {
    // Check if the student already exists with the generated student ID
    const existingStudent = await StudentDetails.findOne({
      studentId: generatedStudentId,
    });
    if (existingStudent) {
      return res.status(400).json({
        message: `Student with ID ${generatedStudentId} already exists.`,
      });
    }

    // Create the student details record
    const studentDetails = new StudentDetails({
      studentId: generatedStudentId,  // Use the passed studentId
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

    // Save the student details to the database
    await studentDetails.save();

    // Delete the student from the registration list
    const deletedStudent = await StudentRegistration.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res
        .status(404)
        .json({ message: "Student not found in registration list" });
    }

    // Respond with success
    res.status(200).json({ message: "Student Approved " });
  } catch (error) {
    console.error("Error during approval process:", error);
    res.status(500).json({ message: "Internal server error during student approval" });
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



// Function to generate student ID based on the admission year
const generateStudentIdForYear = async (admissionYear) => {
  try {
    // Assuming the format of the generated student ID is 'YYYYXXX', 
    // where 'YYYY' is the admission year and 'XXX' is the student number
    const lastStudent = await StudentDetails.findOne({
      admissionDate: { $gte: new Date(`${admissionYear}-01-01`), $lt: new Date(`${admissionYear + 1}-01-01`) },
    }).sort({ studentId: -1 }); // Sort by studentId in descending order

    let nextId = 1;
    if (lastStudent) {
      const lastGeneratedId = lastStudent.studentId;
      const yearPart = lastGeneratedId.slice(0, 4); // Extract the year part of the ID
      const numericPart = parseInt(lastGeneratedId.slice(4), 10); // Extract the numeric part
      if (yearPart === admissionYear.toString()) {
        nextId = numericPart + 1;
      }
    }

    // Generate the new student ID
    const newStudentId = `${admissionYear}${String(nextId).padStart(3, '0')}`;
    return newStudentId;
  } catch (error) {
    console.error("Error generating student ID:", error);
    throw new Error("Error generating student ID");
  }
};

// API to get generated student ID
const getGeneratedStudentId = async (req, res) => {
  const { admissionYear } = req.params;

  if (!admissionYear) {
    return res.status(400).json({ message: "Admission year is required" });
  }

  try {
    const studentId = await generateStudentIdForYear(admissionYear);
    res.status(200).json({ studentId });
  } catch (error) {
    res.status(500).json({ message: "Error generating student ID" });
  }
};


// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await StudentDetails.find();  // Assuming you're using Mongoose or similar ORM
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await StudentDetails.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching student' });
  }
};

// Update student details
const updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { firstName, lastName, grade, dob, parentName, parentEmail, parentPhone, classAssigned, admissionDate, teachersAssigned } = req.body;

  try {
    const student = await StudentDetails.findOneAndUpdate(
      { studentId },
      { firstName, lastName, grade, dob, parentName, parentEmail, parentPhone, classAssigned, admissionDate, teachersAssigned },
      { new: true } // Return the updated document
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating student' });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await StudentDetails.findOneAndDelete({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting student' });
  }
};


module.exports = {
  registerStudent,
  approveStudent,
  rejectStudent,
  getPendingStudents,
  updateStudent,
  getGeneratedStudentId,
  getAllStudents,
  deleteStudent,
  getStudentById,
};
