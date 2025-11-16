import Product from "../models/products.js";
import upload, { uploadToCloudinary } from "../utils/multer.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: category } : {};
    
    const products = await Product.find(filter);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: error.message });
  }
};