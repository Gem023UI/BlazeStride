import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['customer', 'admin'],
    required: [true, 'Role is required'],
    default: 'customer'
  },
  firstname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastname: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: true
  },
  phoneNumber: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: null
  },
  useravatar: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'deactivated'],
    default: 'active'
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;