import Review from "../models/reviews.js";
import { validateReviewDescription } from "../validations/reviewSchema.js";
import Order from "../models/orders.js";
import Product from "../models/products.js";
import upload, { uploadToCloudinary } from "../utils/multer.js";

// Helper function to update product rating
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ product: productId });
    
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
    
    await Product.findByIdAndUpdate(productId, {
      averageRating: averageRating,
      reviewCount: reviews.length
    });
  } catch (error) {
    console.error("Error updating product rating:", error);
  }
};

// Create or Update Review
export const createOrUpdateReview = async (req, res) => {
  try {
    const { orderId, productId, rating, reviewDescription } = req.body;
    const userId = req.body.userId;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Validate review description (including bad words check)
    const validation = await validateReviewDescription(reviewDescription);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.message });
    }

    // Verify order exists and belongs to user
    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('user', 'firstname lastname');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify order status is "Received"
    if (order.orderStatus !== "Received") {
      return res.status(400).json({ 
        message: "Can only review orders with 'Received' status" 
      });
    }

    // Verify product is in the order
    const orderItem = order.orderItems.find(
      item => item.product.toString() === productId
    );

    if (!orderItem) {
      return res.status(400).json({ 
        message: "Product not found in this order" 
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle image uploads
    let reviewImages = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ message: "Cannot upload more than 5 images" });
      }

      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(
          file.buffer, 
          file.mimetype, 
          'blazestride/reviews'
        );
        reviewImages.push(imageUrl);
      }
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.reviewDescription = reviewDescription;
      if (reviewImages.length > 0) {
        existingReview.reviewImages = reviewImages;
      }
      await existingReview.save();
      
      // Update product rating
      await updateProductRating(productId);
      
      return res.status(200).json({ 
        message: "Review updated successfully",
        review: existingReview 
      });
    } else {
      // Create new review
      const newReview = new Review({
        user: userId,
        firstname: order.user.firstname,
        lastname: order.user.lastname,
        product: productId,
        productname: product.productname,
        order: orderId,
        rating,
        reviewDescription,
        reviewImages
      });

      await newReview.save();

      // Update product rating
      await updateProductRating(productId);

      return res.status(201).json({ 
        message: "Review created successfully",
        review: newReview 
      });
    }
  } catch (error) {
    console.error("Error creating/updating review:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get review by order and product
export const getReviewByOrderAndProduct = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const userId = req.query.userId || req.body.userId;

    const review = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate('user', 'firstname lastname useravatar')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all reviews by user
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const reviews = await Review.find({ user: userId })
      .populate('product', 'productname productimage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.body.userId;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;
    
    await Review.findByIdAndDelete(reviewId);

    // Update product rating after deletion
    await updateProductRating(productId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: error.message });
  }
};

