import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import path from "path";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log("📁 Multer checking file:", file.originalname);

  if (!file) {
    console.log("ℹ️ No file uploaded");
    return cb(null, false);
  }

  let ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    console.log("❌ Unsupported file type:", ext);
    return cb(new Error("Only .jpg, .jpeg, and .png files are allowed!"), false);
  }

  console.log("✅ File accepted:", file.originalname);
  cb(null, true);
};

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  storage,
  fileFilter,
});

// Function to upload to Cloudinary with configurable folder
export const uploadToCloudinary = async (fileBuffer, mimetype, folderName = 'uploads') => {
  try {
    console.log(`📤 Uploading to Cloudinary folder: ${folderName}`);
    
    // Convert buffer to base64
    const b64 = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${mimetype};base64,${b64}`;
    
    // Upload to Cloudinary with specified folder
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: folderName,
      resource_type: 'auto',
    });
    
    console.log(`✅ Upload successful to folder: ${folderName}`);
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary upload error:", error);
    throw error;
  }
};

export { cloudinary };
export default upload;