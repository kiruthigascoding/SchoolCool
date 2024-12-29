import React, { useState } from 'react';
import Admission from './Admission'; // Import the new Admission component
import ManageStudents from './ManageStudents'; // Import ManageStudents if needed
import '../css/AdminComponent.css';

const AdminComponent = () => {
  const [activeTab, setActiveTab] = useState('Admission'); // State for active tab
  const [error, setError] = useState(''); // For error handling

  return (
    <div className="admin-container">
      <div className="sidebar">
        <button onClick={() => setActiveTab('Admission')}>Admission</button>
        <button onClick={() => setActiveTab('ManageStudents')}>Manage Students</button>
        <button onClick={() => setActiveTab('ManageStaffs')}>Manage Staffs</button>
        <button onClick={() => setActiveTab('ManageTeachers')}>Manage Teachers</button>
      </div>

      <div className="content">
        <h2>{activeTab} </h2>
        {error && <div>{error}</div>}

        {/* Conditional Rendering of Components */}
        {activeTab === 'Admission' && <Admission setError={setError} />}
        {activeTab === 'ManageStudents' && <ManageStudents />}
        {/* You can add other sections for 'ManageStaffs', etc. */}
      </div>
    </div>
  );
};

export default AdminComponent;
