import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import '../css/Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate(); 
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
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: id, 
        password,
      });

      
      localStorage.setItem('authToken', response.data.token);

      
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong, please try again');
      console.error('Login error:', err);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false); 
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
          {error && <div className="error-message">{error}</div>} 
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
              <button type="button" onClick={handleCloseForm} className="close-button">
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
