import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, fetchFilteredProducts } from "../api/products";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchProductReviews } from "../api/reviews";
import { Rating } from '@mui/material';
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

  const [productReviews, setProductReviews] = useState([]);
  const [productAverageRating, setProductAverageRating] = useState(0);

  const [filterActive, setFilterActive] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

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
        const allProducts = await fetchProducts();
        
        setDailyProducts(allProducts.filter(p => p.category.includes("daily")));
        setTempoProducts(allProducts.filter(p => p.category.includes("tempo")));
        setMarathonProducts(allProducts.filter(p => p.category.includes("marathon")));
        setRaceProducts(allProducts.filter(p => p.category.includes("race")));
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = async (page = 1) => {
    try {
      const filterParams = { page, limit: 12 };
      
      if (filters.searchTerm) filterParams.searchTerm = filters.searchTerm;
      if (filters.category) filterParams.category = filters.category;
      if (filters.minPrice) filterParams.minPrice = filters.minPrice;
      if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;
      
      const response = await fetchFilteredProducts(filterParams);
      setFilteredProducts(response.products);
      setPagination(response.pagination);
      setCurrentPage(page);
      setFilterActive(true);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const clearFilters = async () => {
    setFilters({
      searchTerm: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    setFilterActive(false);
    setFilteredProducts([]);
    setCurrentPage(1);
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      hasNextPage: false,
      hasPrevPage: false
    });
  };

  const handlePageChange = (newPage) => {
    applyFilters(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      const currentQuantity = cart[existingItemIndex].quantity || 1;
      if (currentQuantity >= product.stock) {
        setToastMessage('Cannot add more items. Stock limit reached.');
        setToastType('alert-error');
        setTimeout(() => setToastMessage(''), 2000);
        return;
      }
      cart[existingItemIndex].quantity = currentQuantity + 1;
      setToastMessage('Increased product quantity in your cart.');
      setToastType('alert-info');
    } else {
      if (product.stock < 1) {
        setToastMessage('This product is out of stock.');
        setToastType('alert-error');
        setTimeout(() => setToastMessage(''), 2000);
        return;
      }
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
    
    setTimeout(() => setToastMessage(''), 5000);
  };

  const loadProductReviews = async (productId) => {
    try {
      const reviews = await fetchProductReviews(productId);
      setProductReviews(reviews);
      
      // Calculate average rating
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
        setProductAverageRating(avgRating);
      } else {
        setProductAverageRating(0);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      setProductReviews([]);
      setProductAverageRating(0);
    }
  };
    
  return (
    <MainLayout>
      <section className="front-page-wrapper">

        <div className="front-page">
          <div className="front-info-1">
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

          {/* FILTER SECTION */}
          <div className="filter-section">
            <div className="filter-container">
              <h2 className="filter-title">FILTER PRODUCTS</h2>
              <div className="filter-inputs">
                <input
                  type="text"
                  name="searchTerm"
                  placeholder="Search product name..."
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  className="filter-input"
                />
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  <option value="daily">Daily</option>
                  <option value="tempo">Tempo</option>
                  <option value="marathon">Marathon</option>
                  <option value="race">Race</option>
                </select>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min Price"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="filter-input filter-price"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max Price"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="filter-input filter-price"
                />
                <div className="filter-buttons">
                  <button onClick={() => applyFilters(1)} className="filter-apply-btn">
                    Apply Filters
                  </button>
                  <button onClick={clearFilters} className="filter-clear-btn">
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filterActive ? (
            /* FILTERED RESULTS */
          <div className="front-product-section">
            <div className="front-product-info">
              <h2>FILTERED RESULTS</h2>
              <p>{pagination.totalProducts} product{pagination.totalProducts !== 1 ? 's' : ''} found</p>
            </div>
            <div className="front-product-grid">
              {filteredProducts.length === 0 ? (
                <p className="no-products">No products match your filters.</p>
              ) : (
                filteredProducts.map((product) => (
                  <div 
                    key={product._id}
                    className="front-product-card"
                    onClick={async () => {
                      setSelectedProduct(product);
                      await loadProductReviews(product._id);
                      setShowProductModal(true);
                    }}
                  >
                    <img src={product.productimage[0]} alt={product.productname} />
                    <div className="front-product-details">
                      <h3>{product.productname}</h3>
                      <div className="product-rating-display">
                        <Rating 
                          value={product.averageRating || 0} 
                          readOnly 
                          size="small" 
                          precision={0.5}
                        />
                        <span className="rating-count">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                      <p>${product.price}</p>
                      <div className="front-product-btn">
                        <button className="info-btn" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                          loadProductReviews(product._id);
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
                ))
              )}
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pagination-container">
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>
                
                <div className="pagination-pages">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 || 
                      pageNum === pagination.totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 || 
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button 
                  className="pagination-btn" 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </div>
          ) : (
            <>
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
                      onClick={async () => {
                        setSelectedProduct(product);
                        await loadProductReviews(product._id);
                        setShowProductModal(true);
                      }}
                    >
                      <img src={product.productimage[0]} alt={product.productname} />
                      <div className="front-product-details">
                        <h3>{product.productname}</h3>
                        <div className="product-rating-display">
                          <Rating 
                            value={product.averageRating || 0} 
                            readOnly 
                            size="small" 
                            precision={0.5}
                          />
                          <span className="rating-count">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                        <p>${product.price}</p>
                        <div className="front-product-btn">
                          <button className="info-btn" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            loadProductReviews(product._id);
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
                      onClick={async () => {
                        setSelectedProduct(product);
                        await loadProductReviews(product._id);
                        setShowProductModal(true);
                      }}
                    >
                      <img src={product.productimage[0]} alt={product.productname} />
                      <div className="front-product-details">
                        <h3>{product.productname}</h3>
                        <div className="product-rating-display">
                          <Rating 
                            value={product.averageRating || 0} 
                            readOnly 
                            size="small" 
                            precision={0.5}
                          />
                          <span className="rating-count">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                        <p>${product.price}</p>
                        <div className="front-product-btn">
                          <button className="info-btn" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            loadProductReviews(product._id);
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
                      onClick={async () => {
                        setSelectedProduct(product);
                        await loadProductReviews(product._id);
                        setShowProductModal(true);
                      }}
                    >
                      <img src={product.productimage[0]} alt={product.productname} />
                      <div className="front-product-details">
                        <h3>{product.productname}</h3>
                        <div className="product-rating-display">
                          <Rating 
                            value={product.averageRating || 0} 
                            readOnly 
                            size="small" 
                            precision={0.5}
                          />
                          <span className="rating-count">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                        <p>${product.price}</p>
                        <div className="front-product-btn">
                          <button className="info-btn" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            loadProductReviews(product._id);
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
                      onClick={async () => {
                        setSelectedProduct(product);
                        await loadProductReviews(product._id);
                        setShowProductModal(true);
                      }}
                    >
                      <img src={product.productimage[0]} alt={product.productname} />
                      <div className="front-product-details">
                        <h3>{product.productname}</h3>
                        <div className="product-rating-display">
                          <Rating 
                            value={product.averageRating || 0} 
                            readOnly 
                            size="small" 
                            precision={0.5}
                          />
                          <span className="rating-count">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                        <p>${product.price}</p>
                        <div className="front-product-btn">
                          <button className="info-btn" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                            loadProductReviews(product._id);
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
            </>
          )}
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
                
                <div className="review-summary">
                  <div className="average-rating">
                    <h2>{productAverageRating.toFixed(1)}</h2>
                    <Rating value={productAverageRating} readOnly precision={0.1} size="large" />
                    <p>{productReviews.length} {productReviews.length === 1 ? 'review' : 'reviews'}</p>
                  </div>
                </div>

                <div className="review-section">
                  {productReviews.length === 0 ? (
                    <div className="no-reviews">
                      <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    productReviews.slice(0, 3).map((review) => (
                      <div key={review._id} className="review-items">
                        <div className="review-avatar">
                          <img 
                            src={review.user?.useravatar || "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1761398407/pioneer1_uvhbaj.png"} 
                            alt="reviewer" 
                          />
                        </div>
                        <div className="review-info">
                          <h4 className="reviewer-name">
                            {review.firstname} {review.lastname.charAt(0)}.
                          </h4>
                          <Rating value={review.rating} readOnly size="small" />
                          <p className="review-text">{review.reviewDescription}</p>
                          {review.reviewImages && review.reviewImages.length > 0 && (
                            <div className="review-media">
                              {review.reviewImages.slice(0, 3).map((img, index) => (
                                <img key={index} src={img} alt={`review-${index}`} />
                              ))}
                            </div>
                          )}
                          <p className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {productReviews.length > 3 && (
                    <p className="more-reviews">
                      + {productReviews.length - 3} more {productReviews.length - 3 === 1 ? 'review' : 'reviews'}
                    </p>
                  )}
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