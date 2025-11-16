import express from "express";
import upload from "../utils/multer.js";
import { 
  getAllProducts, 
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/products.js";

const router = express.Router();

// Get all products (with filters)
router.get("/", getAllProducts);

// Get product by ID
router.get("/:id", getProductById);

// Create new product (with multiple images)
router.post("/", upload.array("productimages", 10), createProduct);

// Update product (with multiple images)
router.put("/:id", upload.array("productimages", 10), updateProduct);

// Delete product
router.delete("/:id", deleteProduct);

export default router;