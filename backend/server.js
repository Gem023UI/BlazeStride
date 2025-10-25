import app from './app.js';
import connectDatabase from "./config/database.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDatabase();

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  console.log(`Connected to Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);
} else {
  console.log("Cloudinary configuration missing or invalid.");
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server Running on Port: ${PORT} in ${process.env.NODE_ENV} mode`
  );
});