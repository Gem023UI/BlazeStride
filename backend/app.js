import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import lessonsRoutes from "./routes/lessons.js";
import quizRoutes from "./routes/quiz.js";
import scoreRoutes from "./routes/scores.js";
import typographyRoutes from "./routes/typography.js";
import achievementRoutes from "./routes/achievements.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://type-venture.vercel.app"
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

app.use("/api/lessons", lessonsRoutes);
console.log("✅ Lessons routes registered");

app.use("/api/quiz", quizRoutes);
console.log("✅ Quiz routes registered");

app.use("/api/typography", typographyRoutes);
console.log("✅ Typography routes registered");

app.use("/api/score", scoreRoutes);
console.log("✅ Score routes registered");

app.use("/api/achievements", achievementRoutes);
console.log("✅ Achievement routes registered");

// Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "running",
    message: "API is running...",
    endpoints: {
      user: "/api/user",
      lessons: "/api/lessons",
      quiz: "/api/quiz"
    }
  });
});

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
      "POST /api/user/login",
      "POST /api/score",
      "GET /api/test",
      "GET /api/lessons",
      "GET /api/quiz/test",
      "GET /api/quiz/all",
      "GET /api/quiz/lesson/:lessonId",
      "GET /api/score/user/:username",
      "GET /api/score/leaderboard",
      "GET /api/typography/all",
      "GET /api/typography/lesson/:lessonId",
      "GET /api/achievements/user/:userId",
      "GET /api/achievements/lesson/:lessonId"
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