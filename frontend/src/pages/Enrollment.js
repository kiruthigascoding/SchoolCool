import React, { useState } from 'react';
import axios from 'axios';
import '../css/Enrollment.css'

const Enrollment = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    dob: '',
    gender: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
  });

  const [status, setStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/student/student-register', formData);
      if (response.data.success) {
        setStatus(response.data.message);
        setErrorMessage('');
      }
    } catch (error) {
      setStatus('');
      setErrorMessage((error.response?.data?.message || "An error occurred"));
    }
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); 
  };

  return (
    <>
      {isFormVisible && (
        <div className="enrollment-form">
          <div className="enroll-head">
          <h2>Student Enrollment</h2>
          <button className="close-btn" onClick={handleCloseForm}>X</button> 
          </div>
          {status && <div className="success-message">{status}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Grade:</label>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Parent's Name:</label>
              <input
                type="text"
                name="parentName"
                value={formData.parentName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Parent's Email:</label>
              <input
                type="email"
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Parent's Phone:</label>
              <input
                type="text"
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Submit Registration</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Enrollment;
