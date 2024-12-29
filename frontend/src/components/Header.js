import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';

const Header = () => {
  return (
    <header>
      <div className="logo">
    
        <div className="icon">S</div>
        <div className="school-name">
          <div className="school">School</div>
          <hr className="divider" />
          <div className="cool">Cool</div>
          
        </div>
       
      </div>
      
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/enrollment">Enrollment</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
