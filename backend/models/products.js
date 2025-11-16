import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: [String],
    enum: ['daily', 'tempo', 'marathon', 'race'],
    required: [true, 'At least one category is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Product must have at least one category'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  productimage: {
    type: [String],
    required: [true, 'At least one product image is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Product must have at least one image'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: [0, 'Review count cannot be negative']
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;