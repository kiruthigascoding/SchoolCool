
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; 
import Home from './pages/Home'; 
import Login from './pages/Login';
import Signup from './pages/Signup';
import Enrollment from './pages/Enrollment';
import Dashboard from './pages/Dashboard';
const App = () => {
  return (
    <Router>
      <Layout> 
        <Routes>
          <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
         <Route path="/enrollment" element={<Enrollment />} />
         <Route path="/dashboard" element={<Dashboard/>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
