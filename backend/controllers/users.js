import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { uploadToCloudinary } from "../utils/multer.js";
import User from "../models/users.js";
import { auth } from '../config/firebase.js';

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -token');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("📦 USER FETCHED:", user);

    res.json({
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        useravatar: user.useravatar,
      },
    });
  } catch (err) {
    console.error("❌ Get user error:", err);
    res.status(500).json({
      error: "Failed to fetch user",
      details: err.message,
    });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -token').sort({ createdAt: -1 });

    console.log("📦 FETCHED ALL USERS:", users.length);

    res.json({
      users: users.map(user => ({
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        useravatar: user.useravatar,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }))
    });
  } catch (err) {
    console.error("❌ Get all users error:", err);
    res.status(500).json({
      error: "Failed to fetch users",
      details: err.message,
    });
  }
};

// UPDATE USER
export const updateUserByAdmin = async (req, res) => {
  console.log("🟡 Update user by admin endpoint hit");

  try {
    const { userId, firstname, lastname, email, phoneNumber, address, role, status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update fields
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;
    
    // Check if email is being changed and if it's already in use
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }

    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber || null;
    if (address !== undefined) user.address = address || null;
    if (role) user.role = role;
    if (status) user.status = status;

    // Update profile picture if provided
    if (req.file && req.file.buffer) {
      try {
        user.useravatar = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype,
          "typeventure/profile pictures"
        );
        console.log("✅ Profile picture updated:", user.useravatar);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          error: "Failed to upload profile picture",
          details: uploadError.message,
        });
      }
    }

    await user.save();
    console.log("✅ User updated successfully by admin");

    res.json({
      message: "User updated successfully",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        useravatar: user.useravatar,
        role: user.role,
        status: user.status
      },
    });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({
      error: "User update failed",
      details: err.message,
    });
  }
};

// REGISTER
export const registerUser = async (req, res) => {
  console.log("🔵 Register endpoint hit");

  try {
    let { role, firstname, lastname, email, password, phoneNumber, address, useravatar } = req.body;

    // ✅ Normalize & validate email
    email = validator.normalizeEmail(email);
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // ✅ Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // ✅ Password validation
    const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long and contain at least 1 symbol",
      });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const defaultRole = 'customer';
    if (!role) role = defaultRole;

    const defaultUserAvatar = "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1759649430/user_icon_ze74ys.jpg";
    if (!useravatar) useravatar = defaultUserAvatar;

    if (!phoneNumber) phoneNumber = null;
    if (!address) address = null;

    console.log("🔍 FINAL VALUES BEFORE SAVING:");
    console.log("  role:", role);
    console.log("  firstname:", firstname);
    console.log("  lastname:", lastname);
    console.log("  email:", email);
    console.log("  address:", address);
    console.log("  phoneNumber:", phoneNumber);
    console.log("  useravatar:", useravatar);

    const newUser = new User({
      role,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phoneNumber,
      address,
      useravatar,
      status: 'active'
    });

    await newUser.save();
      console.log("✅ User registered successfully:", firstname + " " + lastname);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          email: newUser.email,
          role: newUser.role,
          useravatar: newUser.useravatar,
          phoneNumber: newUser.phoneNumber,
          address: newUser.address
        },
      });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({
      error: "Registration failed",
      details: err.message,
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  console.log("🔵 Login endpoint hit");

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ error: "No existing email" });
    }

    // ✅ Check if account is deactivated
    if (user.status === 'deactivated') {
      return res.status(403).json({ 
        error: "Account Deactivated",
        message: "Your account has been deactivated. Please contact support for assistance." 
      });
    }

    if (!user.password) {
      return res.status(400).json({ error: "Account has no password set" });
    }

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    // ✅ Store JWT in user document
    user.token = token;
    await user.save();

    // ✅ Send token and user info to front-end
    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        useravatar: user.useravatar,
        phoneNumber: user.phoneNumber,
        address: user.address,
        status: user.status
      },
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({
      error: "Login failed",
      details: err.message,
    });
  }
};

// SOCIAL AUTH
export const socialAuth = async (req, res) => {
  console.log("🔵 Social auth endpoint hit");

  try {
    const { idToken, provider } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "ID token is required" });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
    } catch (verifyError) {
      console.error("❌ Token verification failed:", verifyError);
      return res.status(401).json({ error: "Invalid authentication token" });
    }

    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({ error: "Email not found in token" });
    }

    // Split name into firstname and lastname
    const nameParts = (name || '').split(' ');
    const firstname = nameParts[0] || 'User';
    const lastname = nameParts.slice(1).join(' ') || '';

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // ✅ Check if account is deactivated
      if (user.status === 'deactivated') {
        return res.status(403).json({ 
          error: "Account Deactivated",
          message: "Your account has been deactivated. Please contact support for assistance." 
        });
      }

      // User exists, log them in
      const token = jwt.sign(
        { id: user._id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role },
        process.env.JWT_SECRET || "defaultsecret",
        { expiresIn: "1d" }
      );

      user.token = token;
      
      // Update avatar if provided and user doesn't have one
      if (picture && !user.useravatar) {
        user.useravatar = picture;
      }
      
      await user.save();

      console.log("✅ Existing user logged in via", provider);

      return res.json({
        message: "Login successful",
        token,
        user: {
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
          useravatar: user.useravatar,
          phoneNumber: user.phoneNumber,
          address: user.address,
          status: user.status
        },
      });
    }

    // User doesn't exist, create new account
    const newUser = new User({
      role: 'customer',
      firstname,
      lastname,
      email,
      password: await bcrypt.hash(uid + Math.random().toString(36), 10),
      useravatar: picture || "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1759649430/user_icon_ze74ys.jpg",
      phoneNumber: null,
      address: null,
      status: 'active' // Add this line
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, firstname: newUser.firstname, lastname: newUser.lastname, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    newUser.token = token;
    await newUser.save();

    console.log("✅ New user registered via", provider, ":", firstname, lastname);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        role: newUser.role,
        useravatar: newUser.useravatar,
        phoneNumber: newUser.phoneNumber,
        address: newUser.address,
        status: newUser.status
      },
    });

  } catch (err) {
    console.error("❌ Social auth error:", err);
    res.status(500).json({
      error: "Authentication failed",
      details: err.message,
    });
  }
};

// EDIT PROFILE
export const editProfile = async (req, res) => {
  console.log("🟡 Incoming body fields:", req.body);

  try {
    const { userId, currentPassword, newPassword, firstname, lastname, email, phoneNumber, address } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update firstname if provided
    if (firstname && firstname !== user.firstname) {
      user.firstname = firstname;
      console.log("✅ First name updated to:", firstname);
    }

    // Update lastname if provided
    if (lastname && lastname !== user.lastname) {
      user.lastname = lastname;
      console.log("✅ Last name updated to:", lastname);
    }

    // Update email if provided and changed
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
      console.log("✅ Email updated to:", email);
    }

    // Update phone number
    if (phoneNumber !== undefined) {
      user.phoneNumber = phoneNumber || null;
      console.log("✅ Phone number updated to:", phoneNumber);
    }

    // Update address
    if (address !== undefined) {
      user.address = address || null;
      console.log("✅ Address updated to:", address);
    }

    // Change password if newPassword provided
    if (newPassword && newPassword.trim() !== "") {
      if (!currentPassword || currentPassword.trim() === "") {
        return res.status(400).json({ error: "Current password is required to set new password" });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      const passwordRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          error: "New password must be at least 6 characters long and contain at least 1 symbol",
        });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      console.log("✅ Password updated");
    }

    // Update profile picture if provided
    if (req.file && req.file.buffer) {
      try {
        user.useravatar = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype,
          "typeventure/profile pictures"
        );
        console.log("✅ Profile picture updated:", user.useravatar);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          error: "Failed to upload profile picture",
          details: uploadError.message,
        });
      }
    }

    await user.save();
    console.log("✅ Profile updated successfully");

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        useravatar: user.useravatar,
      },
    });
  } catch (err) {
    console.error("❌ Edit profile error:", err);
    res.status(500).json({
      error: "Profile update failed",
      details: err.message,
    });
  }
};

// DELETE ACCOUNT
export const deleteAccount = async (req, res) => {
  console.log("🔴 Delete account endpoint hit");

  try {
    const { userId, email, password } = req.body;

    if (!userId || !email || !password) {
      return res.status(400).json({ 
        error: "User ID, email, and password are required" 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify email matches
    if (user.email !== email) {
      return res.status(400).json({ error: "Email does not match" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    }
    
    // Delete user account
    await User.findByIdAndDelete(userId);
    console.log("✅ Deleted user account");

    res.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (err) {
    console.error("❌ Delete account error:", err);
    res.status(500).json({
      error: "Account deletion failed",
      details: err.message,
    });
  }
};