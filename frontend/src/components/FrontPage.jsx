import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faClock, 
  faPersonRunning, 
  faShoePrints, 
  faCircleInfo, 
  faCartPlus,
  faMoneyCheckDollar,
  faUsers
   } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "../components/layout/SearchBar"
import MainLayout from "./layout/MainLayout";
import "../styles/FrontPage.css";

export default function LandingSection({ logoUrl }) {
  const navigate = useNavigate();

  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    if (showProductModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showProductModal]);

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
              <h2><FontAwesomeIcon icon={faCalendarCheck}/> DAILY</h2>
              <p>Stay on track with our daily running essentials.</p>
            </div>
            <div className="front-product-card" onClick={() => setShowProductModal(true)}>
              <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="Sample Product Image" />
              <div className="front-product-details">
                <h3>Brooks Ghost 14</h3>
                <p>$120.00</p>
                <div className="front-product-btn">
                  <button className="info-btn"  onClick={() => setShowProductModal(true)}><FontAwesomeIcon icon={faCircleInfo} /></button>
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

        {/* View Product Modal */}
        {showProductModal && (
        <div className="product-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-image">
              <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="Product" />
            </div>
            <div className="product-modal-details">
              <div className="product-modal-info">
                <h2>Brooks Ghost 14</h2>
                <p className="product-category">DAILY</p>
                <p>The Brooks Ghost 14 is a versatile running shoe designed for neutral runners seeking a balance of cushioning and responsiveness. Featuring DNA Loft cushioning for a soft ride, BioMoGo DNA midsole for adaptive support, and a segmented crash pad for smooth heel-to-toe transitions, this shoe is perfect for daily training and long runs. The engineered mesh upper provides breathability and a secure fit, while the durable outsole ensures traction on various surfaces. Ideal for runners looking to enhance their performance with comfort and style.</p>
                <div className="product-rate">
                  <p className="product-price">PRICE: $120.00</p>
                  <p className="product-ratings">RATING: <span>★★★★☆</span></p>
                </div>
                <div className="product-modal-actions">
                  <button className="modal-info-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faMoneyCheckDollar} /> BUY NOW</button>
                  <button className="modal-cart-btn" onClick={() => navigate('/products')}><FontAwesomeIcon icon={faCartPlus} /> ADD TO CART</button>
                </div>
              </div>
              <div className="product-modal-reviews">
                <div className="review-header">
                  <h3>CUSTOMER</h3>
                  <FontAwesomeIcon className="customerIcon" icon={faUsers} />
                  <h3>REVIEWS</h3>
                </div>
                <div className="review-section">
                  <div className="review-items">
                    <div className="review-avatar">
                      <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761398407/pioneer1_uvhbaj.png" alt="review-avatar" />
                    </div>
                    <div className="review-info">
                      <h4 className="reviewer-name">Alex M.</h4>
                      <div className="review-rating">★★★★☆</div>
                      <p className="review-text">"The Brooks Ghost 14 has transformed my daily runs! The cushioning is perfect, providing just the right amount of support without feeling bulky. I've noticed a significant improvement in my pace and overall comfort. Highly recommend for any runner looking for a reliable shoe!"</p>
                      <div className="review-media">
                        <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="review-1" />
                        <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="review-2" />
                        <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761345062/brooks_qkbdxd.png" alt="review-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

      </section>
    </MainLayout>
  );
}