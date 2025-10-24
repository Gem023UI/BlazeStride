import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { uploadToCloudinary } from "../utils/multer.js";
import User from "../models/user.js";

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password -token');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("📦 USER FETCHED:", user); // just for debugging

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        hobbies: user.hobbies,
        createdAt: user.createdAt ? user.createdAt.toISOString() : null, // ✅ ensure it's sent
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
    let { username, email, password, profilePicture, hobbies } = req.body;

    // ✅ Basic username validation
    if (!username || username.length < 5) {
      return res.status(400).json({ error: "Username must be at least 5 characters long" });
    }

    // ✅ No spaces allowed
    if (/\s/.test(username)) {
      return res.status(400).json({ error: "Username cannot contain spaces" });
    }

    // ✅ Check if username already exists (case-insensitive)
    const existingUserByUsername = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });
    if (existingUserByUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultProfilePicture = "https://res.cloudinary.com/dxnb2ozgw/image/upload/v1759649430/user_icon_ze74ys.jpg";
    const defaultHobbies = ["None yet."];

    profilePicture = defaultProfilePicture;

    if (typeof hobbies === "string") {
      try {
        hobbies = JSON.parse(hobbies);
      } catch (e) {
        hobbies = defaultHobbies;
      }
    }

    if (!hobbies || !Array.isArray(hobbies) || hobbies.length === 0) {
      hobbies = defaultHobbies;
    }

    console.log("🔍 FINAL VALUES BEFORE SAVING:");
    console.log("  username:", username);
    console.log("  email:", email);
    console.log("  profilePicture:", profilePicture);
    console.log("  hobbies:", hobbies);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture,
      hobbies,
    });

    await newUser.save();
      console.log("✅ User registered successfully:", username);

      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
          hobbies: newUser.hobbies,
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

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Incorrect Password" });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
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
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        hobbies: user.hobbies,
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
    const { userId, currentPassword, newPassword, hobbies, username, email } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update username if provided and changed
    if (username && username !== user.username) {
      // Check if new username is taken
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      user.username = username;
      console.log("✅ Username updated to:", username);
    }

    if (req.body.email && req.body.email !== user.email) {
      // Check if the new email is already in use
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
      console.log("✅ Email updated to:", email);
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

    // Update hobbies if provided
    if (hobbies !== undefined) {
      try {
        const parsedHobbies = typeof hobbies === "string" ? JSON.parse(hobbies) : hobbies;
        user.hobbies = Array.isArray(parsedHobbies) ? parsedHobbies : [];
        console.log("✅ Hobbies updated:", user.hobbies);
      } catch (e) {
        console.error("Error parsing hobbies:", e);
      }
    }

    // Update profile picture if provided
    if (req.file && req.file.buffer) {
      try {
        user.profilePicture = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype,
          "typeventure/profile pictures"
        );
        console.log("✅ Profile picture updated:", user.profilePicture);
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          error: "Failed to upload profile picture",
          details: uploadError.message,
        });
      }
    }

    await user.save();
    console.log("✅ Profile updated successfully:", user.username);

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        hobbies: user.hobbies,
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
    const { userId, username, password } = req.body;

    if (!userId || !username || !password) {
      return res.status(400).json({ 
        error: "User ID, username, and password are required" 
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify username matches
    if (user.username !== username) {
      return res.status(400).json({ error: "Username does not match" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Password is incorrect" });
    };
    
    await Score.deleteMany({ userId: userId });
    console.log("✅ Deleted user scores");
    
    await UserAchievement.deleteMany({ userId: userId });
    console.log("✅ Deleted user achievements");
    
    await User.findByIdAndDelete(userId);
    console.log("✅ Deleted user account");

    res.json({
      success: true,
      message: "Account and all related data deleted successfully"
    });

  } catch (err) {
    console.error("❌ Delete account error:", err);
    res.status(500).json({
      error: "Account deletion failed",
      details: err.message,
    });
  }
};