import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  role: {
    type: [String],
    enum: [ 'customer', 'admin'],
    required: [true, 'At least one role is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'User should have a role'
    }
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
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  token: {
    type: String,
    default: null
  },
  useravatar: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;