import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/ManageStudents.css';

const ManageStudents = () => {
  const [students, setStudents] = useState([]); // All students
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered students
  const [error, setError] = useState('');
  
  const [gradeFilter, setGradeFilter] = useState('');
  const [classAssignedFilter, setClassAssignedFilter] = useState('');
  
  const [selectedStudent, setSelectedStudent] = useState(null); // Selected student for edit
  const [showEditForm, setShowEditForm] = useState(false); // State to show/hide edit form

  // Fetch all students
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }

    axios
      .get('http://localhost:5000/api/student/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setStudents(response.data);
        setFilteredStudents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
        setError('Failed to fetch students');
      });
  }, []);

  // Filter students based on grade and class assigned
  const handleFilter = () => {
    let filtered = students;
    if (gradeFilter) {
      filtered = filtered.filter(student => student.grade.toLowerCase().includes(gradeFilter.toLowerCase()));
    }
    if (classAssignedFilter) {
      filtered = filtered.filter(student => student.classAssigned.toLowerCase().includes(classAssignedFilter.toLowerCase()));
    }
    setFilteredStudents(filtered);
  };

  // Handle Edit button click
  const handleEdit = (student) => {
    setSelectedStudent(student); // Set the selected student for editing
    setShowEditForm(true); // Show the edit form
  };

  // Handle Delete button click
  const handleDelete = (studentId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }

    axios
      .delete(`http://localhost:5000/api/student/delete/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        // Remove the deleted student from the local state
        setStudents(students.filter((student) => student.studentId !== studentId));
        setFilteredStudents(filteredStudents.filter((student) => student.studentId !== studentId));
        alert('Student deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
        setError('Failed to delete student');
      });
  };

  // Handle student detail update
  // Handle student detail update
  const handleUpdate = (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }
  
    // Ensure dates are in the correct format
    const updatedStudentData = {
      firstName: selectedStudent.firstName,
      lastName: selectedStudent.lastName,
      grade: selectedStudent.grade,
      dob: selectedStudent.dob,  // Assumes the date is already in yyyy-MM-dd format
      parentName: selectedStudent.parentName,
      parentEmail: selectedStudent.parentEmail,
      parentPhone: selectedStudent.parentPhone,
      classAssigned: selectedStudent.classAssigned,
      admissionDate: selectedStudent.admissionDate,  // Assumes the date is already in yyyy-MM-dd format
      teachersAssigned: selectedStudent.teachersAssigned,
    };
  
    // Send the PUT request to the backend to update the student
    axios
      .put(`http://localhost:5000/api/student/update/${selectedStudent.studentId}`, updatedStudentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const updatedStudent = response.data.student;
  
        // Update the state with the updated student information
        setStudents(students.map(student => student.studentId === updatedStudent.studentId ? updatedStudent : student));
        setFilteredStudents(filteredStudents.map(student => student.studentId === updatedStudent.studentId ? updatedStudent : student));
  
        alert('Student details updated successfully!');
  
        // Close the edit form after updating
        setShowEditForm(false);
        setSelectedStudent(null); // Clear the selected student
      })
      .catch((error) => {
        console.error('Error updating student:', error);
        setError('Failed to update student');
      });
  };
  

  // Close the edit form without saving
  const handleCloseEditForm = () => {
    setShowEditForm(false); // Hide the edit form
    setSelectedStudent(null); // Clear selected student
  };

  return (
    <div>
      {error && <div>{error}</div>}
      
      {/* Filter Section */}
      {!showEditForm && (
        <div className="filter-section">
          <label>
            Grade:
            <input
              type="text"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              placeholder="Filter by Grade"
            />
          </label>

          <label>
            Class Assigned:
            <input
              type="text"
              value={classAssignedFilter}
              onChange={(e) => setClassAssignedFilter(e.target.value)}
              placeholder="Filter by Class"
            />
          </label>

          <button onClick={handleFilter}>Apply Filters</button>
        </div>
      )}

      {/* Student Table */}
      {!showEditForm && (
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Grade</th>
              <th>Class Assigned</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentId}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>{student.grade}</td>
                  <td>{student.classAssigned}</td>
                  <td>
                    <button onClick={() => handleEdit(student)}>Edit</button>
                    <button onClick={() => handleDelete(student.studentId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No students available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      
{showEditForm && (
  <div className="edit-form">
    <h3>Edit Student Details</h3>
    <button className="close-button" onClick={handleCloseEditForm}>X</button>
    <form onSubmit={handleUpdate}>
      <label>First Name:</label>
      <input
        type="text"
        value={selectedStudent.firstName}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, firstName: e.target.value })}
      />
      <label>Last Name:</label>
      <input
        type="text"
        value={selectedStudent.lastName}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, lastName: e.target.value })}
      />
      <label>Grade:</label>
      <input
        type="text"
        value={selectedStudent.grade}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, grade: e.target.value })}
      />
      <label>Class Assigned:</label>
      <input
        type="text"
        value={selectedStudent.classAssigned}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, classAssigned: e.target.value })}
      />
      <label>Date of Birth (DOB):</label>
      <input
         type="date"
         value={selectedStudent.dob ? selectedStudent.dob.split('T')[0] : ''}  // Convert to yyyy-MM-dd
        onChange={(e) => setSelectedStudent({ ...selectedStudent, dob: e.target.value })}
      />

      <label>Parent Name:</label>
      <input
        type="text"
        value={selectedStudent.parentName}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, parentName: e.target.value })}
      />
      <label>Parent Email:</label>
      <input
        type="email"
        value={selectedStudent.parentEmail}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, parentEmail: e.target.value })}
      />
      <label>Parent Phone:</label>
      <input
        type="text"
        value={selectedStudent.parentPhone}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, parentPhone: e.target.value })}
      />
      <label>Admission Date:</label>
      <input
         type="date"
         value={selectedStudent.admissionDate ? selectedStudent.admissionDate.split('T')[0] : ''}  // Convert to yyyy-MM-dd
         onChange={(e) => setSelectedStudent({ ...selectedStudent, admissionDate: e.target.value })}
      />
      <label>Teachers Assigned (comma separated):</label>
      <input
        type="text"
        value={selectedStudent.teachersAssigned.join(', ')}
        onChange={(e) => setSelectedStudent({ ...selectedStudent, teachersAssigned: e.target.value.split(', ') })}
      />
      <button type="submit">Update Details</button>
    </form>
  </div>
)}

    </div>
  );
};

export default ManageStudents;
