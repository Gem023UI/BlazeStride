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
  brand: {
    type: String,
    enum: ['adidas', 'asics', 'brooks', 'hoka', 'nike', 'new balance', 'saucony'],
    required: [true, 'Brand is required'],
    lowercase: true,
    trim: true
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
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;