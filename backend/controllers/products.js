import Product from "../models/products.js";
import Review from "../models/reviews.js"; // Add this line
import upload, { uploadToCloudinary, deleteFromCloudinary } from "../utils/multer.js";

// Get all products with filters
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let filter = {};
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Search filter (product name)
    if (search) {
      filter.productname = { $regex: search, $options: 'i' };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get filtered products for front page with pagination
export const getFilteredProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let filter = {};
    
    // Category filter - support array of categories
    if (category) {
      filter.category = { $in: Array.isArray(category) ? category : [category] };
    }
    
    // Search filter (product name)
    if (search) {
      filter.productname = { $regex: search, $options: 'i' };
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
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

// Create new product
export const createProduct = async (req, res) => {
  console.log("🟢 Create product endpoint hit");
  console.log("📦 Request body:", req.body);
  console.log("📦 Request files:", req.files);

  try {
    const { productname, description, price, stock } = req.body;

    // Get categories from form data - handle different possible formats
    let categories = [];
    if (req.body.category) {
      categories = Array.isArray(req.body.category) 
        ? req.body.category 
        : [req.body.category];
    } else if (req.body['category[]']) {
      categories = Array.isArray(req.body['category[]']) 
        ? req.body['category[]'] 
        : [req.body['category[]']];
    }

    console.log("📋 Parsed data:", {
      productname,
      description,
      categories,
      price,
      stock,
      filesCount: req.files?.length || 0
    });

    // Validate required fields
    if (!productname) {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!price) {
      return res.status(400).json({ message: "Price is required" });
    }
    if (stock === undefined || stock === null) {
      return res.status(400).json({ message: "Stock is required" });
    }
    if (categories.length === 0) {
      return res.status(400).json({ message: "At least one category is required" });
    }

    // Upload images to Cloudinary
    let productImages = [];
    if (req.files && req.files.length > 0) {
      console.log("📤 Uploading images to Cloudinary...");
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(
          file.buffer,
          file.mimetype,
          "typeventure/products"
        );
        productImages.push(imageUrl);
      }
      console.log("✅ Images uploaded:", productImages.length);
    } else {
      return res.status(400).json({ 
        message: "At least one product image is required" 
      });
    }

    // Create new product
    const newProduct = new Product({
      productname,
      description,
      category: categories,
      price: parseFloat(price),
      stock: parseInt(stock),
      productimage: productImages,
    });

    await newProduct.save();
    console.log("✅ Product created successfully:", productname);

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Create product error:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  console.log("🟡 Update product endpoint hit");
  console.log("📦 Request body:", req.body);
  console.log("📦 Request files:", req.files);

  try {
    const { id } = req.params;
    const { productname, description, price, stock } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get categories from form data - handle different possible formats
    let categories = [];
    if (req.body.category) {
      categories = Array.isArray(req.body.category) 
        ? req.body.category 
        : [req.body.category];
    } else if (req.body['category[]']) {
      categories = Array.isArray(req.body['category[]']) 
        ? req.body['category[]'] 
        : [req.body['category[]']];
    }

    console.log("📋 Parsed data:", {
      productname,
      description,
      categories,
      price,
      stock,
      filesCount: req.files?.length || 0
    });

    // Update basic fields
    if (productname) product.productname = productname;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (categories.length > 0) product.category = categories;

    // Handle image updates
    if (req.files && req.files.length > 0) {
      console.log("📤 Uploading new images to Cloudinary...");
      
      // Delete old images from Cloudinary
      for (const oldImage of product.productimage) {
        try {
          await deleteFromCloudinary(oldImage);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      // Upload new images
      let newImages = [];
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(
          file.buffer,
          file.mimetype,
          "typeventure/products"
        );
        newImages.push(imageUrl);
      }
      
      product.productimage = newImages;
      console.log("✅ New images uploaded:", newImages.length);
    } else if (req.body.existingImages) {
      // Keep existing images if no new ones uploaded
      let existingImages = req.body.existingImages;
      if (!Array.isArray(existingImages)) {
        existingImages = [existingImages];
      }
      product.productimage = existingImages;
      console.log("📌 Keeping existing images:", existingImages.length);
    }

    await product.save();
    console.log("✅ Product updated successfully");

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Update product error:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  console.log("🔴 Delete product endpoint hit");

  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete all images from Cloudinary
    console.log("🗑️ Deleting images from Cloudinary...");
    for (const image of product.productimage) {
      try {
        await deleteFromCloudinary(image);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

          // Delete all reviews associated with this product
      await Review.deleteMany({ product: id });
      console.log("🗑️ Associated reviews deleted");

      // Delete product from database
      await Product.findByIdAndDelete(id);
      console.log("✅ Product deleted successfully");

    res.json({
      message: "Product and all associated images deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete product error:", error);
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

// Bulk delete products
export const bulkDeleteProducts = async (req, res) => {
  console.log("🔴 Bulk delete endpoint hit");
  
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs array is required" });
    }

    let deletedCount = 0;
    let errors = [];

    for (const id of productIds) {
      try {
        const product = await Product.findById(id);
        if (!product) {
          errors.push({ id, error: "Product not found" });
          continue;
        }

        // Delete all images from Cloudinary
        for (const image of product.productimage) {
          try {
            await deleteFromCloudinary(image);
          } catch (err) {
            console.error("Error deleting image:", err);
          }
        }

        // Delete all reviews associated with this product
        await Review.deleteMany({ product: id });

        // Delete product from database
        await Product.findByIdAndDelete(id);
        deletedCount++;
      } catch (err) {
        errors.push({ id, error: err.message });
      }
    }

    console.log(`✅ Bulk delete completed: ${deletedCount} products deleted`);

    res.json({
      message: `Successfully deleted ${deletedCount} product(s)`,
      deletedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("❌ Bulk delete error:", error);
    res.status(500).json({
      message: "Failed to bulk delete products",
      error: error.message,
    });
  }
};