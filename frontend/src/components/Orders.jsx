import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { fetchUserOrders, updateOrderStatus } from "../api/orders";
import "../styles/Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userInfo);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
        const data = await fetchUserOrders();
        setOrders(data);
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
        await updateOrderStatus(orderId, newStatus);
        fetchOrders();
    } catch (error) {
        console.error("Error updating status:", error);
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <MainLayout>
      <section className="orders-page-wrapper">
        <div className="orders-container">
          <h1>My Orders</h1>

          {orders.length === 0 ? (
            <div className="no-orders">
              <p>You don't have any orders yet.</p>
            </div>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order No.</th>
                  <th>Date</th>
                  <th>Total Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order)}
                    className="order-row"
                  >
                    <td>{order._id.substring(0, 8).toUpperCase()}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(order._id, e.target.value);
                        }}
                        className={`status-dropdown ${order.orderStatus
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="To Confirm">To Confirm</option>
                        <option value="To Ship">To Ship</option>
                        <option value="To Deliver">To Deliver</option>
                        <option value="Received">Received</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="order-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

              <h2>Order Details</h2>

              <div className="modal-section">
                <h3>Order Information</h3>
                <p>
                  <strong>Order No:</strong>{" "}
                  {selectedOrder._id.substring(0, 8).toUpperCase()}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.orderStatus}
                </p>
              </div>

              <div className="modal-section">
                <h3>Shipping Information</h3>
                <p>
                  <strong>Receiver:</strong> {selectedOrder.receiverName}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.shippingInfo.address}
                </p>
                <p>
                  <strong>City:</strong> {selectedOrder.shippingInfo.city}
                </p>
                <p>
                  <strong>Postal Code:</strong>{" "}
                  {selectedOrder.shippingInfo.postalCode}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedOrder.shippingInfo.phoneNo}
                </p>
              </div>

              <div className="modal-section">
                <h3>Order Items</h3>
                {selectedOrder.orderItems.map((item, index) => (
                  <div key={index} className="modal-order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-info">
                      <p className="item-name">{item.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="modal-section total-section">
                <h3>Total Amount: ${selectedOrder.totalPrice.toFixed(2)}</h3>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}