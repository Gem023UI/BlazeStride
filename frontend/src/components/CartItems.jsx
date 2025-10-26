import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import MainLayout from "./layout/MainLayout";
import "../styles/CartItems.css";

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    
    // Initialize selectedItems with all items checked by default
    const selected = {};
    cart.forEach(item => {
      selected[item._id] = true;
    });
    setSelectedItems(selected);
  };

  const updateCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: updatedCart.length } }));
  };

  const handleCheckboxChange = (productId) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const handleQuantityChange = (productId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const handleDeleteClick = (productId) => {
    setItemToDelete(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedCart = cartItems.filter(item => item._id !== itemToDelete);
    updateCart(updatedCart);
    
    // Remove from selectedItems
    const newSelectedItems = { ...selectedItems };
    delete newSelectedItems[itemToDelete];
    setSelectedItems(newSelectedItems);
    
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const getSelectedItems = () => {
    return cartItems.filter(item => selectedItems[item._id]);
  };

  const calculateTotal = () => {
    return getSelectedItems().reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleProceedToPayment = () => {
    const selected = getSelectedItems();
    if (selected.length === 0) {
      alert('Please select at least one item to proceed');
      return;
    }
    // Navigate to payment or checkout page
    navigate('/checkout');
  };

  return (
    <MainLayout>
        <section className="cart-page-wrapper">
            <div className="cart-page">
                <div className="cart-container">
                    {/* Cart Table */}
                    <div className="cart-table-container">
                        <div className="cart-table-section">
                            <div className="cart-header">
                                <h2>Cart Items</h2>
                            </div>
                            {cartItems.length === 0 ? (
                            <div className="empty-cart">
                                <p>Your cart is empty</p>
                                <button onClick={() => navigate('/products')} className="shop-now-btn">
                                Shop Now
                                </button>
                            </div>
                            ) : (
                            <table className="cart-table">
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item._id}>
                                    <td>
                                        <input
                                        type="checkbox"
                                        checked={selectedItems[item._id] || false}
                                        onChange={() => handleCheckboxChange(item._id)}
                                        className="cart-checkbox"
                                        />
                                    </td>
                                    <td className="product-cell">
                                        <img src={item.productimage} alt={item.productname} />
                                        <span>{item.productname}</span>
                                    </td>
                                    <td className="quantity-cell">
                                        <button 
                                        onClick={() => handleQuantityChange(item._id, -1)}
                                        className="quantity-btn"
                                        >
                                        <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button 
                                        onClick={() => handleQuantityChange(item._id, 1)}
                                        className="quantity-btn"
                                        >
                                        <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </td>
                                    <td className="price-cell">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                        onClick={() => handleDeleteClick(item._id)}
                                        className="delete-btn"
                                        >
                                        <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            )}
                        </div>
                    </div>

                    <div className="order-section">
                        {/* Order Summary - 40% */}
                        {cartItems.length > 0 && (
                        <div className="order-summary-section">
                            <div className="order-summary">
                                <h2>Order Summary</h2>
                                <div className="summary-items">
                                {getSelectedItems().length === 0 ? (
                                    <p className="no-selection">No items selected</p>
                                ) : (
                                    getSelectedItems().map((item) => (
                                    <div key={item._id} className="summary-item">
                                        <div className="summary-item-info">
                                        <p className="summary-item-name">{item.productname}</p>
                                        <p className="summary-item-quantity">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="summary-item-price">
                                        ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    ))
                                )}
                                </div>
                                <div className="summary-total">
                                <h3>Total</h3>
                                <h3>${calculateTotal().toFixed(2)}</h3>
                                </div>
                                <button 
                                onClick={handleProceedToPayment}
                                className="proceed-btn"
                                disabled={getSelectedItems().length === 0}
                                >
                                Proceed to Payment
                                </button>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                <div className="delete-modal-overlay" onClick={cancelDelete}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Are you sure you want to remove this item from your cart?</h3>
                    <div className="delete-modal-buttons">
                        <button onClick={confirmDelete} className="confirm-btn">Yes, Remove</button>
                        <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                    </div>
                    </div>
                </div>
                )}
            </div>     
        </section>
    </MainLayout>
  );
}