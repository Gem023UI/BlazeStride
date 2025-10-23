import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import "./Header.css";

const Header = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-left">
        <FontAwesomeIcon icon={faBars} onClick={onMenuClick} />
        <img
          src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189861/logo_sy4dgl.png"
          alt="BlazeStride Logo"
          className="logo"
        />
        <a href="./lessons">TypeVenture</a>
      </div>

      <div className="header-right">
        <ul className="header-links">
          <li className="purple"><Link to="/about">Pioneers</Link></li>
          <li className="green"><Link to="/games">Citations</Link></li>
          <li className="orange"><Link to="/contact">About Us</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
