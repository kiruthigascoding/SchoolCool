import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminComponent from '../components/AdminComponent';
import TeacherComponent from '../components/TeacherComponent';
import StudentComponent from '../components/StudentComponent';
import ParentComponent from '../components/ParentComponent';
import '../css/Dashboard.css';  

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // If no token is found, redirect to login page
      setLoading(false);
      return <Navigate to="/login" />;
    }

    try {
      // Decode the JWT token to retrieve role
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setRole(decodedToken.role);
    } catch (error) {
      console.error('Invalid token or failed to decode the token', error);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
  

      <div className="role-section">
        {role === 'admin' && <AdminComponent />}
        {role === 'teacher' && <TeacherComponent />}
        {role === 'student' && <StudentComponent />}
        {role === 'parent' && <ParentComponent />}

        {/* If role is not found, show a message */}
        {!role && <div className="error">No valid role found. Please contact support.</div>}
      </div>
    </div>
  );
};

export default Dashboard;
