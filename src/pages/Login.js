import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate is used for navigation in react-router-dom v6
import axios from 'axios';
import '../css/Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(''); // To store error message

  const navigate = useNavigate(); // Initialize useNavigate hook for redirection

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setShowForm(true);
    setFormData({
      id: '',
      password: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, password } = formData;
    
    if (!id || !password) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: id, // send the entered ID as the username
        password,
      });

      // On success, save the token to localStorage (or handle token as per your setup)
      localStorage.setItem('authToken', response.data.token);

      // Redirect to the Dashboard page
      navigate('/dashboard'); // Using navigate instead of useHistory
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again');
      console.error('Login error:', err);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false); // Close the form when the close button is clicked
  };

  return (
    <div className="login-container">
      <h2>Select Your Role to Log In</h2>
      {!showForm && (
        <div className="role-selection">
          <div className="role-box" onClick={() => handleRoleClick('student')}>
            Student
          </div>
          <div className="role-box" onClick={() => handleRoleClick('parent')}>
            Parent
          </div>
          <div className="role-box" onClick={() => handleRoleClick('teacher')}>
            Teacher
          </div>
          <div className="role-box" onClick={() => handleRoleClick('admin')}>
            Admin
          </div>
        </div>
      )}

      {showForm && (
        <div className="form-container">
          <h3>
            {selectedRole === 'student' && 'Enter your student ID (e.g., 2024001)'}
            {selectedRole === 'parent' && 'Enter your email ID'}
            {selectedRole === 'teacher' && 'Enter your staff ID'}
            {selectedRole === 'admin' && 'Enter your admin ID'}
          </h3>
          {error && <div className="error-message">{error}</div>} {/* Show error message */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="id"
              placeholder={`Enter your ${selectedRole} ID`}
              value={formData.id}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <div className="form-buttons">
              <button type="submit">Log In</button>
              <button type="button" onClick={handleCloseForm} className="close-btn">
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
