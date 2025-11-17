import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import MainLayout from "./layout/MainLayout";
import { orderValidationSchema } from "../validations/orderSchema";
import { createOrder } from "../api/orders";
import "../styles/SubmitOrder.css";

export default function SubmitOrder() {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(orderValidationSchema),
  });

  useEffect(() => {
    // Load checkout items
    const items = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    if (items.length === 0) {
      navigate("/cart");
      return;
    }
    setOrderItems(items);

    // Get user info
    const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userInfo);
  }, [navigate]);

  const calculateItemTotal = (item) => {
    return (item.price * item.quantity).toFixed(2);
  };

  const calculateGrandTotal = () => {
    return orderItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const onSubmit = (data) => {
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    const formData = getValues();

    try {
      const orderData = {
        shippingInfo: {
          address: formData.address,
          city: formData.city,
          phoneNo: formData.phoneNumber,
          postalCode: formData.zipCode,
          country: "Philippines",
        },
        user: user._id || localStorage.getItem("userId"),
        orderItems: orderItems.map((item) => ({
          name: item.productname,
          quantity: item.quantity,
          image: item.productimage,
          price: item.price,
          product: item._id,
        })),
        paymentInfo: {
          status: "Pending",
        },
        itemsPrice: parseFloat(calculateGrandTotal()),
        taxPrice: 0.0,
        shippingPrice: 0.0,
        totalPrice: parseFloat(calculateGrandTotal()),
        orderStatus: "To Confirm",
        receiverName: formData.fullName,
      };

      // Submit order to backend
      const result = await createOrder(orderData);

      // Remove ordered items from cart
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const orderedIds = orderItems.map((item) => item._id);
      const updatedCart = cart.filter((item) => !orderedIds.includes(item._id));
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      localStorage.removeItem("checkoutItems");
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { count: updatedCart.length } })
      );

      alert("Order placed successfully! Check your email for confirmation.");
      navigate("/myorders");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  return (
    <MainLayout>
      <section className="submit-order-page-wrapper">
        <div className="submit-order-container">
          <h1 className="page-title">Submit Order</h1>

          <div className="order-content">
            {/* Products Section */}
            <div className="order-products">
              <h2>Order Items</h2>
              <div className="products-list">
                {orderItems.map((item) => (
                  <div key={item._id} className="order-product-item">
                    <img
                      src={item.productimage}
                      alt={item.productname}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h3>{item.productname}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p className="product-price">
                        ${calculateItemTotal(item)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grand-total">
                <h3>Total Amount:</h3>
                <h3>${calculateGrandTotal()}</h3>
              </div>
            </div>

            {/* Order Details Form */}
            <div className="order-details">
              <h2>Shipping Details</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="order-form">
                <div className="form-group">
                  <label htmlFor="fullName">Receiver's Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                    className={errors.fullName ? "error" : ""}
                  />
                  {errors.fullName && (
                    <span className="error-message">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address *</label>
                  <textarea
                    id="address"
                    {...register("address")}
                    className={errors.address ? "error" : ""}
                    rows="3"
                  />
                  {errors.address && (
                    <span className="error-message">
                      {errors.address.message}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">Zip Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      {...register("zipCode")}
                      className={errors.zipCode ? "error" : ""}
                      maxLength="4"
                    />
                    {errors.zipCode && (
                      <span className="error-message">
                        {errors.zipCode.message}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">City/Province *</label>
                    <select
                      id="city"
                      {...register("city")}
                      className={errors.city ? "error" : ""}
                    >
                      <option value="">Select City/Province</option>
                      {/* Add your options here later */}
                      <option value="Metro Manila">Metro Manila</option>
                      <option value="Cebu">Cebu</option>
                      <option value="Davao">Davao</option>
                    </select>
                    {errors.city && (
                      <span className="error-message">{errors.city.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Phone Number *</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    {...register("phoneNumber")}
                    className={errors.phoneNumber ? "error" : ""}
                    maxLength="11"
                    placeholder="09XXXXXXXXX"
                  />
                  {errors.phoneNumber && (
                    <span className="error-message">
                      {errors.phoneNumber.message}
                    </span>
                  )}
                </div>

                <button type="submit" className="place-order-btn">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Confirm Order Details</h3>
              <div className="modal-details">
                <p>
                  <strong>Receiver:</strong> {getValues("fullName")}
                </p>
                <p>
                  <strong>Address:</strong> {getValues("address")}
                </p>
                <p>
                  <strong>City:</strong> {getValues("city")}
                </p>
                <p>
                  <strong>Zip Code:</strong> {getValues("zipCode")}
                </p>
                <p>
                  <strong>Phone:</strong> {getValues("phoneNumber")}
                </p>
                <p>
                  <strong>Total Amount:</strong> ${calculateGrandTotal()}
                </p>
              </div>
              <div className="modal-buttons">
                <button
                  onClick={handleConfirmOrder}
                  className="confirm-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm Order"}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="cancel-btn"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}