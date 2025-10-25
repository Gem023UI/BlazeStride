import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/products.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://blaze-stride.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`📥 ${new Date().toISOString()}`);
  console.log(`${req.method} ${req.url}`);
  console.log(`Body:`, req.body);
  console.log(`Params:`, req.params);
  console.log(`${"=".repeat(50)}\n`);
  next();
});

// Routes - Order matters!
console.log("🔧 Registering routes...");
app.use("/api/user", userRoutes);
console.log("✅ User routes registered");

console.log("🔧 Registering routes...");
app.use("/api/products", productRoutes);
console.log("✅ Product routes registered");

// Test endpoint to verify server is running
app.get("/api/test", (req, res) => {
  res.json({ 
    success: true,
    message: "Server is responding",
    timestamp: new Date().toISOString()
  });
});

// 404 handler - This catches unmatched routes
app.use((req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: "Route not found",
    method: req.method,
    path: req.url,
    availableRoutes: [
      "POST /api/user/register",
      "POST /api/user/login"
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("💥 Error occurred:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
});

console.log("✨ App configuration complete");

export default app;