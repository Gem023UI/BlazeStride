import axios from "axios";

const API_URL = "http://localhost:5000/api/reviews";

// Create or update review
export const createOrUpdateReview = async (reviewData) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id || localStorage.getItem("userId");

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("orderId", reviewData.orderId);
    formData.append("productId", reviewData.productId);
    formData.append("rating", reviewData.rating);
    formData.append("reviewDescription", reviewData.reviewDescription);

    // Append images
    if (reviewData.reviewImages && reviewData.reviewImages.length > 0) {
      reviewData.reviewImages.forEach((image) => {
        formData.append("reviewImages", image);
      });
    }

    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating/updating review:", error);
    throw error;
  }
};

// Get review by order and product
export const fetchReviewByOrderAndProduct = async (orderId, productId) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id || localStorage.getItem("userId");

    const response = await axios.get(
      `${API_URL}/order/${orderId}/product/${productId}`,
      {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching review:", error);
    throw error;
  }
};

// Get all reviews for a product
export const fetchProductReviews = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

// Get all reviews by user
export const fetchUserReviews = async () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id || localStorage.getItem("userId");

    const response = await axios.get(`${API_URL}/user`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};

// Delete review
export const deleteReview = async (reviewId) => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user._id || user.id || localStorage.getItem("userId");

    const response = await axios.delete(`${API_URL}/${reviewId}`, {
      data: { userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
};