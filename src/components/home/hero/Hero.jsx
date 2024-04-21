import React from "react";
import "./hero.scss";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

function Hero() {
  return (
    <div className="hero-section">
      <div className="main-hero">
        <div className="left-hero">
          <div className="hero-heading">
            <h1>Evidentiranje Opreme</h1>
          </div>
          <div className="hero-text">
            Lorem ipsum dolor sit amet,consectetuer adipiscing elsdh, sed diam
            nonummy nib euismod tincidunt ut laoreet dolore magna.
          </div>
          <div className="hero-buttons">
            <Link to="/oprema">
              <button className="button btn-dodaj-opremu">DODAJ OPREMU</button>
            </Link>
            <HashLink to="#zaduziNavigate">
              <button className="button btn-full btn-zaduzi">ZADUZI</button>
            </HashLink>
          </div>
        </div>
        <div className="right-hero">
          <img src="/Hero.jpg" alt="" />
        </div>
      </div>
      <div className="notch"></div>
    </div>
  );
}

export default Hero;
