import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
  productname: {
    type: String,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  reviewDescription: {
    type: String,
    required: [true, 'Review description is required'],
    trim: true,
    maxlength: [1000, 'Review description cannot exceed 1000 characters']
  },
  reviewImages: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 5;
      },
      message: 'Cannot upload more than 5 images'
    },
    default: []
  }
}, {
  timestamps: true
});

reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;