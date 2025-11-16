import express from "express";
import multer from "multer";
import upload from "../utils/multer.js";
import { 
  registerUser, 
  loginUser,
  socialAuth,
  editProfile,
  getUserById,
  deleteAccount,
  getAllUsers,
  updateUserByAdmin
} from "../controllers/users.js";

const router = express.Router();

// Multer error handler middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("❌ Multer error:", err);
    return res.status(400).json({ 
      error: `File upload error: ${err.message}` 
    });
  } else if (err) {
    console.error("❌ File filter error:", err);
    return res.status(400).json({ 
      error: err.message 
    });
  }
  next();
};

// Auth routes
router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/social-auth", socialAuth);

router.get("/profile/:id", getUserById);

router.put("/edit-profile", 
  upload.single("avatar"), 
  handleMulterError,
  editProfile
);

router.delete("/delete-account", deleteAccount);

// Admin routes
router.get("/all", getAllUsers);

router.put("/update-user", 
  upload.single("avatar"), 
  handleMulterError,
  updateUserByAdmin
);

export default router;