import express from "express";
import upload from "../utils/multer.js";
import {
  createOrUpdateReview,
  getReviewByOrderAndProduct,
  getProductReviews,
  getUserReviews,
  deleteReview
} from "../controllers/reviews.js";

const router = express.Router();

// Create or update review (with image upload)
router.post("/", upload.array('reviewImages', 5), createOrUpdateReview);

// Get review by order and product
router.get("/order/:orderId/product/:productId", getReviewByOrderAndProduct);

// Get all reviews for a product
router.get("/product/:productId", getProductReviews);

// Get all reviews by user
router.get("/user", getUserReviews);

// Delete review
router.delete("/:reviewId", deleteReview);

export default router;