import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { fetchUserOrders } from "../api/orders";
import "../styles/OrderHistory.css";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
        setLoading(true);
        
        // Check if user is logged in
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user._id || user.id || localStorage.getItem("userId");
        
        if (!userId) {
        alert("Please login to view your orders");
        navigate("/login");
        return;
        }

        const data = await fetchUserOrders();
        setOrders(data);
    } catch (error) {
        console.error("Error loading orders:", error);
        if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
        } else {
        alert("Failed to load orders. Please try again.");
        }
    } finally {
        setLoading(false);
    }
  };

  const calculateOrderTotal = (order) => {
    return order.orderItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orderdetails?id=${orderId}`);
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

  return (
    <MainLayout>
      <section className="order-history-wrapper">
        <div className="order-history-container">
          <h1>My Order History</h1>

          {loading ? (
            <div className="loading-state">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate("/")} className="shop-now-btn">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => handleOrderClick(order._id)}
                >
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order._id.substring(0, 8).toUpperCase()}</h3>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="order-items">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="order-item">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="item-image"
                        />
                        <div className="item-details">
                          <h4>{item.name}</h4>
                          <p className="item-quantity">Qty: {item.quantity}</p>
                        </div>
                        <div className="item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      <span>Total:</span>
                      <span className="total-amount">
                        ${calculateOrderTotal(order)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}