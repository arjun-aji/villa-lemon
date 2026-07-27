import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";
import { YogaItem } from "../models/YogaItem";

dotenv.config();

const cleanup = async () => {
  try {
    await connectDB();
    console.log("Database connected.");

    // Delete sunset-terrace-floor and garden-view-room stays
    console.log("Deleting demo stays...");
    const staysResult = await AccommodationItem.deleteMany({
      slug: { $in: ["sunset-terrace-floor", "garden-view-room"] }
    });
    console.log(`Deleted ${staysResult.deletedCount} demo stays.`);

    // Deleting demo yoga retreats
    console.log("Deleting demo yoga retreats...");
    const yogaResult = await YogaItem.deleteMany({
      slug: "7-day-beach-meditation-retreat"
    });
    console.log(`Deleted ${yogaResult.deletedCount} demo yoga retreats.`);

    console.log("Cleanup completed successfully.");
    process.exit(0);
  } catch (err: any) {
    console.error("Cleanup failed:", err);
    process.exit(1);
  }
};

cleanup();
