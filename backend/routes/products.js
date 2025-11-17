import express from "express";
import upload from "../utils/multer.js";
import { 
  getAllProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts, // Add this line
  getFilteredProducts,
} from "../controllers/products.js";

const router = express.Router();

// Get all products (with filters)
router.get("/", getAllProducts);

// Get filtered products for front page
router.get("/filter/search", getFilteredProducts);

// Get product by ID
router.get("/:id", getProductById);

// Create new product (with multiple images)
router.post("/", upload.array("productimages", 10), createProduct);

// Update product (with multiple images)
router.put("/:id", upload.array("productimages", 10), updateProduct);

// Bulk delete products
router.post("/bulk-delete", bulkDeleteProducts);

// Delete product
router.delete("/:id", deleteProduct);

export default router;