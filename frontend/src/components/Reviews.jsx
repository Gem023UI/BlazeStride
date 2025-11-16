import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { fetchUserReviews, deleteReview } from "../api/reviews";
import { Rating } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import "../styles/Reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await fetchUserReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews:", error);
      alert("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteReview(selectedReview._id);
      alert("Review deleted successfully!");
      setShowDeleteModal(false);
      setSelectedReview(null);
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  return (
    <MainLayout>
      <section className="reviews-page-wrapper">
        <div className="reviews-container">
          <h1>My Reviews</h1>

          {loading ? (
            <div className="loading-state">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="empty-reviews">
              <p>You haven't written any reviews yet.</p>
            </div>
          ) : (
            <div className="reviews-table-container">
              <table className="reviews-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review._id}>
                      <td>
                        <img
                          src={review.product?.productimage?.[0]}
                          alt={review.productname}
                          className="product-thumbnail"
                        />
                      </td>
                      <td className="product-name">{review.productname}</td>
                      <td>
                        <Rating value={review.rating} readOnly size="small" />
                      </td>
                      <td>
                        <button
                          className="delete-review-btn"
                          onClick={() => handleDeleteClick(review)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedReview && (
          <div
            className="delete-modal-overlay"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="delete-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Delete Review</h3>
              <p>Are you sure you want to delete your review for "{selectedReview.productname}"?</p>
              <div className="delete-modal-buttons">
                <button
                  className="confirm-delete-btn"
                  onClick={handleConfirmDelete}
                >
                  Yes, Delete It
                </button>
                <button
                  className="cancel-delete-btn"
                  onClick={() => setShowDeleteModal(false)}
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