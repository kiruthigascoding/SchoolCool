import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminComponent from './AdminComponent';
import TeacherComponent from './TeacherComponent';
import StudentComponent from './StudentComponent';
import ParentComponent from './ParentComponent';
import './Dashboard.css';

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated by checking localStorage for the token
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Redirect to login page if there's no token (unauthenticated user)
      return <Navigate to="/login" />;
    }

    // Decode the token to get the role
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding JWT token
      setRole(decodedToken.role); // Set the role based on the token
    } catch (error) {
      console.error('Invalid token or failed to decode the token', error);
    } finally {
      setLoading(false); // Stop loading after token check
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading until we check the role
  }

  // Conditional rendering based on the role
  return (
    <div className="dashboard-container">
      <h2>Welcome to the Dashboard</h2>
      {role === 'admin' && <AdminComponent />}
      {role === 'teacher' && <TeacherComponent />}
      {role === 'student' && <StudentComponent />}
      {role === 'parent' && <ParentComponent />}
      {/* If the role is undefined or invalid, render nothing or a message */}
      {!role && <div>No valid role found. Please contact support.</div>}
    </div>
  );
};

export default Dashboard;
