import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { fetchAllOrdersAdmin, updateOrderStatus } from "../api/orders";
import "../styles/orders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, dateFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const filters = {
        search: searchTerm,
        status: statusFilter,
        date: dateFilter
      };
      const data = await fetchAllOrdersAdmin(filters);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, newStatus);
      setSuccessMessage("Order status updated and email sent to customer!");
      setTimeout(() => setSuccessMessage(""), 3000);
      await fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const getStatusClass = (status) => {
    return status.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <MainLayout>
      <section className="admin-orders-page-wrapper">
        <div className="admin-orders-container">
          <div className="admin-header">
            <h1>Order Management</h1>
            <p className="admin-subtitle">Manage all customer orders</p>
          </div>

          {successMessage && (
            <div className="success-banner">
              {successMessage}
            </div>
          )}

          {/* Filter Section */}
          <div className="filter-section">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search by Order No. or Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Status</option>
                <option value="To Confirm">To Confirm</option>
                <option value="To Ship">To Ship</option>
                <option value="To Deliver">To Deliver</option>
                <option value="Received">Received</option>
              </select>
            </div>
            
            <div className="filter-group">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="date-input"
              />
            </div>
            
            <button
              className="clear-filters-btn"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
            >
              Clear Filters
            </button>
          </div>

          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="no-orders">
              <p>No orders found.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-orders-table">
                <thead>
                  <tr>
                    <th>Order No.</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="order-row">
                      <td className="order-id">
                        {order._id.substring(0, 8).toUpperCase()}
                      </td>
                      <td>
                        <div className="customer-info">
                          <p className="customer-name">
                            {order.user?.firstname} {order.user?.lastname}
                          </p>
                          <p className="customer-email">{order.user?.email}</p>
                        </div>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="items-count">{order.orderItems.length} item(s)</td>
                      <td className="price">${order.totalPrice.toFixed(2)}</td>
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`status-dropdown ${getStatusClass(order.orderStatus)}`}
                          disabled={loading}
                        >
                          <option value="To Confirm">To Confirm</option>
                          <option value="To Ship">To Ship</option>
                          <option value="To Deliver">To Deliver</option>
                          <option value="Received">Received</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="view-details-btn"
                          onClick={() => handleRowClick(order)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="admin-order-modal" onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                ×
              </button>

              <h2>Order Details</h2>

              <div className="modal-grid">
                <div className="modal-section">
                  <h3>Order Information</h3>
                  <div className="info-row">
                    <span className="label">Order No:</span>
                    <span className="value">{selectedOrder._id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Date:</span>
                    <span className="value">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className={`status-badge ${getStatusClass(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Customer Information</h3>
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">
                      {selectedOrder.user?.firstname} {selectedOrder.user?.lastname}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedOrder.user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Shipping Information</h3>
                <div className="info-row">
                  <span className="label">Receiver:</span>
                  <span className="value">{selectedOrder.receiverName}</span>
                </div>
                <div className="info-row">
                  <span className="label">Address:</span>
                  <span className="value">{selectedOrder.shippingInfo.address}</span>
                </div>
                <div className="info-row">
                  <span className="label">City:</span>
                  <span className="value">{selectedOrder.shippingInfo.city}</span>
                </div>
                <div className="info-row">
                  <span className="label">Postal Code:</span>
                  <span className="value">{selectedOrder.shippingInfo.postalCode}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedOrder.shippingInfo.phoneNo}</span>
                </div>
              </div>

              <div className="modal-section">
                <h3>Order Items</h3>
                <div className="items-list">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="modal-order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <p className="item-name">{item.name}</p>
                        <p className="item-quantity">Qty: {item.quantity}</p>
                        <p className="item-price">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="item-total">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section total-section">
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Items Price:</span>
                    <span>${selectedOrder.itemsPrice.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Shipping:</span>
                    <span>${selectedOrder.shippingPrice.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Tax:</span>
                    <span>${selectedOrder.taxPrice.toFixed(2)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total:</span>
                    <span>${selectedOrder.totalPrice.toFixed(2)}</span>
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