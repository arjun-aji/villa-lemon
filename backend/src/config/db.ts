import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error("[database]: MONGODB_URI environment variable is missing.");
      process.exit(1);
    }

    // Set connection options
    const options: mongoose.ConnectOptions = {
      autoIndex: process.env.NODE_ENV !== "production", // Build indexes in dev, skip in prod
    };

    console.log("[database]: Connecting to MongoDB...");
    const conn = await mongoose.connect(mongoURI, options);

    console.log(`[database]: MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[database]: Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on("error", (err) => {
  console.error(`[database]: Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[database]: Mongoose connection disconnected.");
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("[database]: Mongoose connection closed due to application termination.");
    process.exit(0);
  } catch (err: any) {
    console.error(`[database]: Error closing Mongoose connection: ${err.message}`);
    process.exit(1);
  }
});
