import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import homepageRoutes from "./routes/homepageRoutes";
import accommodationRoutes from "./routes/accommodationRoutes";
import packageRoutes from "./routes/packageRoutes";
import yogaRoutes from "./routes/yogaRoutes";
import accommodationItemRoutes from "./routes/accommodationItemRoutes";
import packageItemRoutes from "./routes/packageItemRoutes";
import yogaItemRoutes from "./routes/yogaItemRoutes";
import retreatRoutes from "./routes/retreatRoutes";
import enquiryRoutes from "./routes/enquiryRoutes";
import galleryRoutes from "./routes/galleryRoutes";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000").split(",").map(o => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Logging middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Request parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/homepage", homepageRoutes);
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/accommodations/items", accommodationItemRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/packages/items", packageItemRoutes);
app.use("/api/yoga", yogaRoutes);
app.use("/api/yoga/items", yogaItemRoutes);
app.use("/api/retreats", retreatRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/gallery", galleryRoutes);

// Base health check route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Villa Lemon Backend Service is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Fallback 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found on this server.`,
  });
});

// Global error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`[server]: Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error("UNHANDLED REJECTION! Shutting down server gracefully...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
