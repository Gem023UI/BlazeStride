import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { uploadToCloudinary } from "../utils/multer.js";
import User from "../models/users.js";

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
      useravatar
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
    if (!user.password) {
      return res.status(400).json({ error: "Account has no password set" });
    }

    if (!user) {
      return res.status(400).json({ error: "No existing email" });
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
        address: user.address
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