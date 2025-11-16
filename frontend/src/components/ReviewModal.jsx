import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { reviewValidationSchema } from "../validations/reviewSchema";
import { createOrUpdateReview } from "../api/reviews";
import { Rating } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrash, faX } from '@fortawesome/free-solid-svg-icons';
import "../styles/ReviewModal.css";

export default function ReviewModal({ orderItem, existingReview, onClose, onSubmitSuccess }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      formik.setFieldValue("rating", existingReview.rating);
      formik.setFieldValue("reviewDescription", existingReview.reviewDescription);
      if (existingReview.reviewImages && existingReview.reviewImages.length > 0) {
        setImagePreviews(existingReview.reviewImages);
      }
    }
  }, [existingReview]);

  const formik = useFormik({
    initialValues: {
      rating: existingReview?.rating || 0,
      reviewDescription: existingReview?.reviewDescription || "",
    },
    validationSchema: reviewValidationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const reviewData = {
          orderId: orderItem.orderId,
          productId: orderItem.productId,
          rating: values.rating,
          reviewDescription: values.reviewDescription,
          reviewImages: imageFiles,
        };

        await createOrUpdateReview(reviewData);
        alert(existingReview ? "Review updated successfully!" : "Review submitted successfully!");
        onSubmitSuccess();
      } catch (error) {
        console.error("Error submitting review:", error);
        alert(error.response?.data?.message || "Failed to submit review");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (imageFiles.length + files.length > 5) {
      alert("You can only upload up to 5 images");
      return;
    }

    // Check file sizes
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds 5MB limit`);
        return;
      }
    }

    // Add new files
    setImageFiles([...imageFiles, ...files]);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  return (
    <div className="review-modal-overlay" onClick={onClose}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="review-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </button>

        <h2>{existingReview ? "Update Your Review" : "Write a Review"}</h2>

        <div className="review-product-info">
          <img src={orderItem.productImage} alt={orderItem.productName} />
          <h3>{orderItem.productName}</h3>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label>Rating *</label>
            <Rating
              name="rating"
              value={formik.values.rating}
              onChange={(event, newValue) => {
                formik.setFieldValue("rating", newValue);
              }}
              size="large"
            />
            {formik.touched.rating && formik.errors.rating && (
              <div className="error-message">{formik.errors.rating}</div>
            )}
          </div>

          <div className="form-group">
            <label>Review Description *</label>
            <textarea
              name="reviewDescription"
              value={formik.values.reviewDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Share your experience with this product..."
              rows="5"
            />
            <div className="char-count">
              {formik.values.reviewDescription.length}/1000 characters
            </div>
            {formik.touched.reviewDescription && formik.errors.reviewDescription && (
              <div className="error-message">{formik.errors.reviewDescription}</div>
            )}
          </div>

          <div className="form-group">
            <label>Upload Images (Optional - Max 5 images, 5MB each)</label>
            <div className="image-upload-section">
              {imagePreviews.length < 5 && (
                <label className="upload-btn">
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Choose Images</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    multiple
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}

              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="submit-review-btn"
            disabled={loading || !formik.isValid}
          >
            {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}