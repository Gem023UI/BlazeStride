import React, { useState, useEffect } from "react";
import MainLayout from "./layout/MainLayout";
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from "../api/products";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { productSchema } from '../validations/productSchema';
import Swal from "sweetalert2";
import "../styles/Products.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, minPrice, maxPrice, selectedCategory, products]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch products",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search by product name
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category.includes(selectedCategory)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsCreating(false);
    setImagePreviews(product.productimage || []);
    setImageFiles([]);
    setShowModal(true);
  };

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsCreating(true);
    setImagePreviews([]);
    setImageFiles([]);
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prevFiles => [...prevFiles, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const formData = new FormData();
      formData.append("productname", values.productname);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stock", values.stock);
      
      // Handle multiple categories - append each one separately
      values.category.forEach(cat => {
        formData.append("category", cat);
      });

      // Handle images
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          formData.append("productimages", file);
        });
      } else if (!isCreating && selectedProduct?.productimage) {
        // If updating and no new images, keep existing ones
        selectedProduct.productimage.forEach(img => {
          formData.append("existingImages", img);
        });
      }

      // Debug: Log FormData contents
      console.log("📤 Submitting FormData:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      let response;
      if (isCreating) {
        response = await createProduct(formData);
        Swal.fire({
          icon: "success",
          title: "Product Created",
          text: "Product has been created successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        response = await updateProduct(selectedProduct._id, formData);
        Swal.fire({
          icon: "success",
          title: "Product Updated",
          text: "Product has been updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      }

      setShowModal(false);
      fetchAllProducts();
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: isCreating ? "Creation Failed" : "Update Failed",
        text: error.response?.data?.message || error.message || "Operation failed",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product and all its images!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(productId);
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Product has been deleted successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setShowModal(false);
        fetchAllProducts();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: error.response?.data?.message || "Failed to delete product",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setIsCreating(false);
    setImagePreviews([]);
    setImageFiles([]);
  };

  if (loading) {
    return (
      <MainLayout>
        <section className="products-page-wrapper">
          <div className="loading">Loading products...</div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="products-page-wrapper">
        <div className="products-header">
          <div className="header-left">
            <h1>Product Management</h1>
            <div className="product-stats">
              <span className="stat-label">Total Products:</span>
              <span className="stat-value">{products.length}</span>
            </div>
          </div>
          <button className="create-product-btn" onClick={handleCreateProduct}>
            + Create Product
          </button>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="daily">Daily</option>
              <option value="tempo">Tempo</option>
              <option value="marathon">Marathon</option>
              <option value="race">Race</option>
            </select>
          </div>

          <div className="filter-group price-filter">
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="filter-input price-input"
            />
            <span className="price-separator">-</span>
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="filter-input price-input"
            />
          </div>

          <button
            className="clear-filters-btn"
            onClick={() => {
              setSearchTerm("");
              setMinPrice("");
              setMaxPrice("");
              setSelectedCategory("");
            }}
          >
            Clear Filters
          </button>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-products">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img
                        src={product.productimage[0]}
                        alt={product.productname}
                        className="product-thumbnail"
                      />
                    </td>
                    <td>{product.productname}</td>
                    <td>
                      <div className="category-badges">
                        {product.category.map((cat, idx) => (
                          <span key={idx} className={`category-badge ${cat}`}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>₱{product.price.toFixed(2)}</td>
                    <td>
                      <span className={`stock-badge ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => handleViewDetails(product)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{isCreating ? "Create New Product" : "Edit Product Details"}</h2>
                <button className="close-btn" onClick={closeModal}>
                  &times;
                </button>
              </div>

              <Formik
                initialValues={{
                  productname: selectedProduct?.productname || "",
                  description: selectedProduct?.description || "",
                  category: selectedProduct?.category || [],
                  price: selectedProduct?.price || "",
                  stock: selectedProduct?.stock || "",
                }}
                validationSchema={productSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="product-edit-form">
                    {/* Images Section */}
                    <div className="images-section">
                      <label>Product Images *</label>
                      <div className="image-previews">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                        <label className="add-image-btn">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                          />
                          <span>+ Add Images</span>
                        </label>
                      </div>
                      {imagePreviews.length === 0 && (
                        <div className="error-message">At least one image is required</div>
                      )}
                    </div>

                    {/* Product Name */}
                    <div className="form-group">
                      <label>Product Name *</label>
                      <Field
                        type="text"
                        name="productname"
                        placeholder="Enter product name"
                      />
                      <ErrorMessage
                        name="productname"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                      <label>Description *</label>
                      <Field
                        as="textarea"
                        name="description"
                        placeholder="Enter product description"
                        rows="4"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label>Category * (Select multiple)</label>
                      <div className="checkbox-group">
                        {['daily', 'tempo', 'marathon', 'race'].map(cat => (
                          <label key={cat} className="checkbox-label">
                            <Field
                              type="checkbox"
                              name="category"
                              value={cat}
                              checked={values.category.includes(cat)}
                              onChange={(e) => {
                                const set = new Set(values.category);
                                if (e.target.checked) {
                                  set.add(cat);
                                } else {
                                  set.delete(cat);
                                }
                                setFieldValue('category', Array.from(set));
                              }}
                            />
                            <span className="checkbox-text">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                          </label>
                        ))}
                      </div>
                      <ErrorMessage
                        name="category"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    {/* Price and Stock */}
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price (₱) *</label>
                        <Field
                          type="number"
                          name="price"
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="error-message"
                        />
                      </div>

                      <div className="form-group">
                        <label>Stock *</label>
                        <Field
                          type="number"
                          name="stock"
                          placeholder="0"
                          min="0"
                        />
                        <ErrorMessage
                          name="stock"
                          component="div"
                          className="error-message"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="form-actions">
                      {!isCreating && (
                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() => handleDelete(selectedProduct._id)}
                        >
                          Delete Product
                        </button>
                      )}
                      <div className="right-actions">
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="submit-btn"
                          disabled={isSubmitting || imagePreviews.length === 0}
                        >
                          {isSubmitting 
                            ? (isCreating ? "Creating..." : "Updating...") 
                            : (isCreating ? "Create Product" : "Update Product")
                          }
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
}