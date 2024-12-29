import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/AdminComponent.css";


const Admission = ({ setError }) => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [admissionYear, setAdmissionYear] = useState('');
  const [teachersAssigned, setTeachersAssigned] = useState('');
  const [classAssigned, setClassAssigned] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // Fetch Pending Students when Admission tab is active
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('No authentication token found.');
      return;
    }

    axios
      .get('http://localhost:5000/api/student/pending-students', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        setPendingStudents(response.data);
      })
      .catch(error => {
        console.error('Error fetching pending students:', error);
        setError('Error fetching pending students.');
      });
  }, []); // Fetch once when component is mounted

  const handleViewClick = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    const token = localStorage.getItem('authToken');

    if (!admissionYear || !teachersAssigned || !classAssigned) {
      setError('Please provide all the required details: admission year, class assigned, and teachers assigned.');
      return;
    }

    try {
      // Fetch the generated student ID
      const response = await axios.get(`http://localhost:5000/api/student/generate-student-id/${admissionYear}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newStudentId = response.data.studentId;
     // setGeneratedStudentId(newStudentId);

      // Approve the student
      const approveResponse = await axios.put(
        `http://localhost:5000/api/student/approve-student/${selectedStudent._id}`,
        {
          studentId: newStudentId,
          firstName: selectedStudent.firstName,
          lastName: selectedStudent.lastName,
          grade: selectedStudent.grade,
          dob: selectedStudent.dob,
          parentName: selectedStudent.parentName,
          parentEmail: selectedStudent.parentEmail,
          parentPhone: selectedStudent.parentPhone,
          classAssigned,
          admissionYear,
          teachersAssigned,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (approveResponse.data && approveResponse.data.message) {
        alert(approveResponse.data.message); // Show alert with success message
      }
    } catch (error) {
      console.error('Error approving student:', error);
      alert('There was an error approving the student.');
    }
  };

  const handleReject = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(
        `http://localhost:5000/api/student/reject-student/${selectedStudent._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error rejecting student:', error);
      setError('Failed to reject student.');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Show Pending Students in the Admission Tab */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingStudents.length > 0 ? (
            pendingStudents.map((student, index) => (
              <tr key={student._id}>
                <td>{index + 1}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>
                  <button onClick={() => handleViewClick(student)}>View</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No pending students</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Student Details */}
      {isModalOpen && selectedStudent && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={handleClose}>X</button>
            <h3>Student Details</h3>
            <form className="student-form">
              <div className="form-group">
                <label>First Name:</label>
                <input type="text" value={selectedStudent.firstName} disabled />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input type="text" value={selectedStudent.lastName} disabled />
              </div>
              <div className="form-group">
                <label>Grade:</label>
                <input type="text" value={selectedStudent.grade} disabled />
              </div>
              <div className="form-group">
                <label>Date of Birth:</label>
                <input type="text" value={selectedStudent.dob} disabled />
              </div>
              <div className="form-group">
                <label>Parent Name:</label>
                <input type="text" value={selectedStudent.parentName} disabled />
              </div>
              <div className="form-group">
                <label>Parent Email:</label>
                <input type="text" value={selectedStudent.parentEmail} disabled />
              </div>
              <div className="form-group">
                <label>Parent Phone:</label>
                <input type="text" value={selectedStudent.parentPhone} disabled />
              </div>

              {/* Additional Fields for Approval */}
              <div className="form-group">
                <label>Class Assigned:</label>
                <input
                  type="text"
                  value={classAssigned}
                  onChange={(e) => setClassAssigned(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Admission Year:</label>
                <input
                  type="text"
                  value={admissionYear}
                  onChange={(e) => setAdmissionYear(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teachers Assigned:</label>
                <input
                  type="text"
                  value={teachersAssigned}
                  onChange={(e) => setTeachersAssigned(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleApprove}>Approve</button>
                <button type="button" onClick={handleReject}>Reject</button>
                <button type="button" onClick={handleClose}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admission;
