import React, { useState } from 'react';
import axios from 'axios';
import '../css/Signup.css'; 

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: '',
    role: 'student', 
  });

  const [error, setError] = useState(null);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(null); 

    setFormData({
      ...formData,
      [name]: value, 
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, role } = formData;

    if (!username || !email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username, 
        email,
        password,
        role,
      });
      console.log(response.data); 
      alert('Registration successful');
      setError(null);
    } catch (err) {
      setError(err.response.data.message || 'Something went wrong');
      console.error(err);
    }
  };

  
  const getUserNameLabel = () => {
    switch (formData.role) {
      case 'student':
        return 'Student ID';
      case 'parent':
        return 'Parent Name';
      case 'teacher':
        return 'Staff ID';
      default:
        return 'Username';
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="signup-form">
        
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="parent">Parent</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>


        <div className="input-group">
          <label htmlFor="username">{getUserNameLabel()}</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username} 
            onChange={handleChange}
            required
          />
        </div>

    
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

    
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
