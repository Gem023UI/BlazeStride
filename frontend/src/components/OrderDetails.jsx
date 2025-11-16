import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { fetchOrderById } from "../api/orders";
import "../styles/OrderDetails.css";

export default function OrderDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("id");
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      navigate("/myorders");
      return;
    }
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
        setLoading(true);
        
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id || user.id || localStorage.getItem("userId");
        
        if (!userId) {
        alert("Please login to view order details");
        navigate("/login");
        return;
        }

        const data = await fetchOrderById(orderId);
        setOrder(data);
    } catch (error) {
        console.error("Error loading order details:", error);
        if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
        } else {
        alert("Failed to load order details");
        navigate("/myorders");
        }
    } finally {
        setLoading(false);
    }
  };

  const calculateSubtotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateTotal = () => {
    if (!order) return "0.00";
    return order.orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "To Confirm":
        return "status-to-confirm";
      case "To Ship":
        return "status-to-ship";
      case "To Deliver":
        return "status-to-deliver";
      case "Received":
        return "status-received";
      default:
        return "status-processing";
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="order-details-wrapper">
          <div className="loading-state">Loading order details...</div>
        </section>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <section className="order-details-wrapper">
          <div className="error-state">Order not found</div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="order-details-wrapper">
        <div className="order-details-container">
          <button onClick={() => navigate("/myorders")} className="back-btn">
            ← Back to Orders
          </button>

          <div className="details-header">
            <div className="header-left">
              <h1>Order Details</h1>
              <p className="order-number">
                Order #{order._id.substring(0, 8).toUpperCase()}
              </p>
              <p className="order-date">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className={`order-status-badge ${getStatusClass(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="details-content">
            {/* Products Section */}
            <div className="section products-section">
              <h2>Order Items</h2>
              <div className="products-list">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="product-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <p className="product-quantity">Quantity: {item.quantity}</p>
                      <p className="product-price">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="product-subtotal">
                      <span>Subtotal</span>
                      <span className="subtotal-amount">
                        ${calculateSubtotal(item)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information Section */}
            <div className="section shipping-section">
              <h2>Shipping Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <label>Receiver Name:</label>
                  <p>{order.receiverName}</p>
                </div>
                <div className="info-item">
                  <label>Address:</label>
                  <p>{order.shippingInfo.address}</p>
                </div>
                <div className="info-item">
                  <label>City/Province:</label>
                  <p>{order.shippingInfo.city}</p>
                </div>
                <div className="info-item">
                  <label>Postal Code:</label>
                  <p>{order.shippingInfo.postalCode}</p>
                </div>
                <div className="info-item">
                  <label>Phone Number:</label>
                  <p>{order.shippingInfo.phoneNo}</p>
                </div>
                <div className="info-item">
                  <label>Country:</label>
                  <p>{order.shippingInfo.country}</p>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="section summary-section">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items Price:</span>
                  <span>${order.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${order.taxPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>${order.shippingPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span className="total-price">${calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}