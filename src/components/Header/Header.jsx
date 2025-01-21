import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="navigation">
            <li className="nav-item"><Link to="/react_project/">New Movie</Link></li>
            <li className="nav-item"><Link to="/react_project/genre">Genre</Link></li>
            <li className="nav-item"><Link to="/react_project/country">Country</Link></li>
            <li className="nav-item"><Link to="/react_project/movie">Movie</Link></li>
            <li className="nav-item"><Link to="/react_project/tv-series">TV series</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;