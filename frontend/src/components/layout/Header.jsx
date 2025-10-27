import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCartShopping, faShoppingBag, faUser } from '@fortawesome/free-solid-svg-icons';
import "../../styles/Header.css";

const Header = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    setIsLoggedIn(token && userId);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log('Header - Cart from localStorage:', cart);
      console.log('Header - Cart count:', cart.length);
      setCartCount(cart.length);
    };
    
    // Initial count
    updateCartCount();
    
    // Listen for custom cart update event
    const handleCartUpdate = (e) => {
      console.log('Header - cartUpdated event received:', e.detail);
      if (e.detail && e.detail.count !== undefined) {
        setCartCount(e.detail.count);
      } else {
        updateCartCount();
      }
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setShowLogoutModal(true);
    } else {
      navigate('/login');
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    localStorage.removeItem('avatar');
    setIsLoggedIn(false);
    setShowLogoutModal(false);
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-left">
        <FontAwesomeIcon icon={faBars} onClick={onMenuClick} />
        <img
          src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189861/logo_sy4dgl.png"
          alt="BlazeStride Logo"
          className="logo"
        />
        <a href="./">BlazeStride</a>
      </div>

      <div className="header-right">
        <ul className="header-links">
          <li><Link to="/profile"><FontAwesomeIcon icon={faUser} onClick={onMenuClick} /></Link></li>
          <li><Link to="/orders"><FontAwesomeIcon icon={faShoppingBag} onClick={onMenuClick} /></Link></li>
          <li style={{ position: 'relative' }}>
            <Link to="/cart">
              <FontAwesomeIcon icon={faCartShopping} onClick={onMenuClick} />
            </Link>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: '#fe42b9',
                color: 'black',
                borderRadius: '50%',
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '0 4px',
                zIndex: 1000,
                pointerEvents: 'none'
              }}>
                {cartCount}
              </span>
            )}
          </li>
          <li className="orange">
            <a onClick={handleAuthClick} style={{ cursor: 'pointer' }}>
              {isLoggedIn ? 'Log Out' : 'Log In'}
            </a>
          </li>
        </ul>
      </div>

      {showLogoutModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="logout-modal-buttons">
              <button onClick={confirmLogout} className="confirm-btn">Yes</button>
              <button onClick={cancelLogout} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;