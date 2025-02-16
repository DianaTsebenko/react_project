import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar";

const Header = ({ setSearchQuery }) => {
  return (
    <header className="header">
      <nav className="header-nav">
        <p className="logo"><span className="logo-yellow">New</span>Movie</p>
        <ul className="navigation">
          <li className="nav-item">
            <NavLink to="/react_project" end className={({ isActive }) => (isActive ? "active" : "")}>
              New Movie
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/react_project/genre" className={({ isActive }) => (isActive ? "active" : "")}>
              Genre
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/react_project/country" className={({ isActive }) => (isActive ? "active" : "")}>
              Country
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/react_project/movie" className={({ isActive }) => (isActive ? "active" : "")}>
              Movie
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/react_project/tv-series" className={({ isActive }) => (isActive ? "active" : "")}>
              TV series
            </NavLink>
          </li>
          <li><SearchBar setSearchQuery={setSearchQuery} /></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
