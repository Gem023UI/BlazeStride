import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock, faPersonRunning, faShoePrints, faCircleInfo, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "../components/layout/SearchBar"
import MainLayout from "./layout/MainLayout";
import "../styles/FrontPage.css";

export default function LandingSection({ logoUrl }) {
  const navigate = useNavigate();

  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleSearch = (query) => {
    console.log("Searching for:", query);
  };

  const imageLogos = [
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189870/adidas_hvbm6y.png", 
    alt: "adidas"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189870/asics_dtf6dv.png", 
    alt: "asics"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189870/mizuno_ja8u5w.png", 
    alt: "mizuno"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/newbalance_hagivu.png", 
    alt: "newbalance"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/nike_pupp9s.png", 
    alt: "nike"
  },
  { 
    src: "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761189871/underarmour_znxoio.png", 
    alt: "underarmour"
  },
];
    
  return (
    <MainLayout>
      <section className="front-page-wrapper">

        <div className="front-page">
          <div className="front-info-1">
            <div className="front-searchbar">
              <SearchBar onSearch={handleSearch} placeholder="Running gears, apparel.." />
            </div>
            <div className="front-logo-container">
              <img src={logoUrl} alt="BlazeStride-Logo" className="front-logo" />
              <div className="front-logo-text">
                <h2 className="front-blaze">BLAZE</h2>
                <h2 className="front-stride">STRIDE</h2>
              </div>
            </div>
            <div className="front-description">
              <p className="description-1">Ignite your run. Outpace your limits — without burning your wallet.</p>
            </div>
          </div>

          <div className="front-info-2">
            <div className="front-info-2-texts">
              <h2 className="tagline-1">BROWSE VARIOUS BRANDS</h2>
              <p className="front-description">
                Discover several running and outdoor gear brands all in one place.
              </p>
            </div>
            <div className="front-logoloop">
              <div className="brand-grid">
                {imageLogos.map((logo, index) => (
                  <div key={index} className="brand-item">
                    <img src={logo.src} alt={logo.alt} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faCalendar}/> DAILY</h2>
              <p>Stay on track with our daily running essentials.</p>
            </div>
            <div className="front-product-card">
              <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="Sample Product Image" />
              <div className="front-product-details">
                <h3>Brooks Ghost 14</h3>
                <p>$120.00</p>
                <div className="front-product-btn">
                  <button className="info-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCircleInfo} /></button>
                  <button className="cart-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCartPlus} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faClock}/> TEMPO</h2>
              <p>Ensure consistent tempo during your runs.</p>
            </div>
            <div className="front-product-card">
              <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="Sample Product Image" />
              <div className="front-product-details">
                <h3>Brooks Ghost 14</h3>
                <p>$120.00</p>
                <div className="front-product-btn">
                  <button className="info-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCircleInfo} /></button>
                  <button className="cart-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCartPlus} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faPersonRunning}/> MARATHON</h2>
              <p>Finish strong with our marathon essentials.</p>
            </div>
            <div className="front-product-card">
              <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="Sample Product Image" />
              <div className="front-product-details">
                <h3>Brooks Ghost 14</h3>
                <p>$120.00</p>
                <div className="front-product-btn">
                  <button className="info-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCircleInfo} /></button>
                  <button className="cart-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCartPlus} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faShoePrints}/> RACE</h2>
              <p>Sprint to the finish line with our race-day essentials.</p>
            </div>
            <div className="front-product-card">
              <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="Sample Product Image" />
              <div className="front-product-details">
                <h3>Brooks Ghost 14</h3>
                <p>$120.00</p>
                <div className="front-product-btn">
                  <button className="info-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCircleInfo} /></button>
                  <button className="cart-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCartPlus} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </MainLayout>
  );
}