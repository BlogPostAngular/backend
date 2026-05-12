const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Import routes
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const blogsRoutes = require("./routes/blogs");
const categoriesRoutes = require("./routes/categories");
const uploadRoutes = require("./routes/upload");

const app = express();

// HTTP Request Logger Middleware
app.use(morgan("dev")); // Logs requests to the console (e.g., GET /health 200 15ms)

// ── Security Middleware ──

// Helmet — sets 11 security HTTP headers (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// CORS — only allow your own frontend origins (set ALLOWED_ORIGINS in .env)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting — general (100 req / 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

// Rate limiting — strict for auth routes (10 req / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts, please try again later." },
});

app.use(generalLimiter);

// Body parsing — with size limits to prevent payload attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// MongoDB Connection
const uri = process.env.MONGODB_URI;
if (uri) {
  const safeUri = uri.replace(/:([^:@]{8,})@/, ':****@');
  console.log("Connecting to MongoDB:", safeUri);
} else {
  console.error("❌ MONGODB_URI is not defined in environment variables");
}

mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  });

// Swagger API docs — available at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Blog Post API — Swagger Docs",
}));

// Routes — auth routes get the stricter rate limiter
app.use("/v1/auth", authLimiter, authRoutes);
app.use("/v1/users", usersRoutes);
app.use("/v1/blogs", blogsRoutes);
app.use("/v1/categories", categoriesRoutes);
app.use("/v1/upload", uploadRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running and ci cd is working ",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler — don't leak stack traces or internal details in production
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const isProd = process.env.NODE_ENV === "production";
  res.status(err.status || 500).json({
    success: false,
    message: isProd ? "Internal server error" : (err.message || "Internal server error"),
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
});
