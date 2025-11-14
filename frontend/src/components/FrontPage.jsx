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
  faUsers,
  faChevronLeft,
  faChevronRight,
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('alert-success');



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
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedProduct]);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.length);
    };
    
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

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

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    
    if (!token) {
      setShowLoginModal(true);
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Current cart before add:', cart);
    
    const existingItemIndex = cart.findIndex(item => item._id === product._id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
      setToastMessage('Increased product quantity in your cart.');
      setToastType('alert-info');
    } else {
      cart.push({
        _id: product._id,
        productname: product.productname,
        price: product.price,
        productimage: product.productimage[0],
        quantity: 1
      });
      setToastMessage('Product added to cart!');
      setToastType('alert-success');
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Cart after add:', cart);
    console.log('Cart length:', cart.length);
    setCartCount(cart.length);
    
    const event = new CustomEvent('cartUpdated', { detail: { count: cart.length } });
    console.log('Dispatching cartUpdated event with count:', cart.length);
    window.dispatchEvent(event);
    
    // alert('Product added to cart!');
    setTimeout(() => setToastMessage(''), 5000);
  };
    
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
              <p className="description-1">Ignite your run. Outpace your limits — all without burning your wallet.</p>
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
                      <button className="cart-btn" onClick={(e) => handleAddToCart(e, product)}>
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
              <h2><FontAwesomeIcon icon={faClock}/> TEMPO</h2>
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
                      <button className="cart-btn" onClick={(e) => handleAddToCart(e, product)}>
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
              <h2><FontAwesomeIcon icon={faPersonRunning}/> MARATHON</h2>
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
                      <button className="cart-btn" onClick={(e) => handleAddToCart(e, product)}>
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
              <h2><FontAwesomeIcon icon={faShoePrints}/> RACE</h2>
              <p>Sprint to the finish line with our race-day gears.</p>
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
                      <button className="cart-btn" onClick={(e) => handleAddToCart(e, product)}>
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
                {selectedProduct.productimage.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`product-${index}`}
                    className={index === currentImageIndex ? "active" : ""}
                  />
                ))}

                <button className="carousel-btn left" onClick={prevImage}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <button className="carousel-btn right" onClick={nextImage}><FontAwesomeIcon icon={faChevronRight} /></button>
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
                  <button className="modal-cart-btn" onClick={(e) => handleAddToCart(e, selectedProduct)}><FontAwesomeIcon icon={faCartPlus} /> ADD TO CART</button>
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

        {showLoginModal && (
          <div className="logout-modal-overlay" onClick={() => setShowLoginModal(false)}>
            <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Please log in to add items to your cart</h3>
              <div className="logout-modal-buttons">
                <button onClick={() => navigate('/login')} className="confirm-btn">Log In</button>
                <button onClick={() => setShowLoginModal(false)} className="cancel-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className={`custom-toast ${toastType}`}>
            <span>{toastMessage}</span>
          </div>
        )}

      </section>
    </MainLayout>
  );
}