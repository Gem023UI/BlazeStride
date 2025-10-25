import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/products";
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
  const [dailyProducts, setDailyProducts] = useState([]);
  const [tempoProducts, setTempoProducts] = useState([]);
  const [marathonProducts, setMarathonProducts] = useState([]);
  const [raceProducts, setRaceProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    if (showProductModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showProductModal]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setDailyProducts(await fetchProducts("daily"));
        setTempoProducts(await fetchProducts("tempo"));
        setMarathonProducts(await fetchProducts("marathon"));
        setRaceProducts(await fetchProducts("race"));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        (prev + 1) % selectedProduct.productimage.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedProduct]);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      (prev + 1) % selectedProduct.productimage.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      (prev - 1 + selectedProduct.productimage.length) %
      selectedProduct.productimage.length
    );
  };

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

          {/* DAILY PRODUCTS */}
          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faCalendarCheck}/> DAILY</h2>
              <p>Stay on track with our daily running essentials.</p>
            </div>
            <div className="front-product-grid">
              {dailyProducts.map((product) => (
                <div 
                  key={product._id}
                  className="front-product-card"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                >
                  <img src={product.productimage[0]} alt={product.productname} />
                  <div className="front-product-details">
                    <h3>{product.productname}</h3>
                    <p>${product.price}</p>
                    <div className="front-product-btn">
                      <button className="info-btn" onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}>
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </button>
                      <button className="cart-btn" onClick={() => navigate('/products')}>
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TEMPO PRODUCTS */}
          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faCalendarCheck}/> TEMPO</h2>
              <p>Ensure consistent tempo during your runs.</p>
            </div>
            <div className="front-product-grid">
              {tempoProducts.map((product) => (
                <div 
                  key={product._id}
                  className="front-product-card"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                >
                  <img src={product.productimage[0]} alt={product.productname} />
                  <div className="front-product-details">
                    <h3>{product.productname}</h3>
                    <p>${product.price}</p>
                    <div className="front-product-btn">
                      <button className="info-btn" onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}>
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </button>
                      <button className="cart-btn" onClick={() => navigate('/products')}>
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MARATHON PRODUCTS */}
          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faCalendarCheck}/> MARATHON</h2>
              <p>Finish strong with our marathon essentials.</p>
            </div>
            <div className="front-product-grid">
              {marathonProducts.map((product) => (
                <div 
                  key={product._id}
                  className="front-product-card"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                >
                  <img src={product.productimage[0]} alt={product.productname} />
                  <div className="front-product-details">
                    <h3>{product.productname}</h3>
                    <p>${product.price}</p>
                    <div className="front-product-btn">
                      <button className="info-btn" onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}>
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </button>
                      <button className="cart-btn" onClick={() => navigate('/products')}>
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* RACE PRODUCTS */}
          <div className="front-product-section">
            <div className="front-product-info">
              <h2><FontAwesomeIcon icon={faCalendarCheck}/> RACE</h2>
              <p>Sprint to the finish line with our race-day gears</p>
            </div>
            <div className="front-product-grid">
              {raceProducts.map((product) => (
                <div 
                  key={product._id}
                  className="front-product-card"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductModal(true);
                  }}
                >
                  <img src={product.productimage[0]} alt={product.productname} />
                  <div className="front-product-details">
                    <h3>{product.productname}</h3>
                    <p>${product.price}</p>
                    <div className="front-product-btn">
                      <button className="info-btn" onClick={() => {
                        setSelectedProduct(product);
                        setShowProductModal(true);
                      }}>
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </button>
                      <button className="cart-btn" onClick={() => navigate('/products')}>
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Product Modal */}
        {showProductModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="product-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-image">
               <div className="carousel">
                <button className="carousel-btn left" onClick={prevImage}>‹</button>
                <img src={selectedProduct.productimage[currentImageIndex]} alt="product" />
                <button className="carousel-btn right" onClick={nextImage}>›</button>
              </div>
            </div>
            <div className="product-modal-details">
              <div className="product-modal-info">
                 <h2>{selectedProduct.productname}</h2>
                <p className="product-category">{selectedProduct.category.join(", ").toUpperCase()}</p>
                <p>{selectedProduct.description}</p>
                <div className="product-rate">
                  <p className="product-price">PRICE: ${selectedProduct.price}</p>
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
                        <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks1_kyngav.png" alt="review-2" />
                        <img src="https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761408863/brooks2_h0xpex.png" alt="review-3" />
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