import React from "react";
import "./navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="logo">
        <div className="nav-item">
          <img src="/Frame.jpg" alt="" />
        </div>
      </div>
      <div className="links">
        <NavLink to="/" className="nav-item">
          Pocetna
        </NavLink>
        <NavLink to="/oprema" className="nav-item">
          Oprema
        </NavLink>
      </div>
      <div></div>
    </div>
  );
}

export default Navbar;
