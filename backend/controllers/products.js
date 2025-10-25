import Product from "../models/products.js";

export const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const query = category ? { category: category.toLowerCase() } : {};
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching products", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching product", error });
  }
};
