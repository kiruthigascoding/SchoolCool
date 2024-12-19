// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import the Layout component
import Home from './pages/Home'; // Your Home page
import Login from './pages/Login'; // Your Login page
import Signup from './pages/Signup'; // Your Signup page

const App = () => {
  return (
    <Router>
      <Layout> {/* Wrap all routes inside Layout */}
        <Routes>
          <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
