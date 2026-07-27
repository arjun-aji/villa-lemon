import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";
import { YogaItem } from "../models/YogaItem";
import mongoose from "mongoose";

dotenv.config();

const runSeedDefaults = async () => {
  try {
    await connectDB();

    console.log("[seed-defaults]: Updating Accommodation items...");
    const accResult = await AccommodationItem.updateMany(
      { relatedAccommodations: { $exists: false } },
      { $set: { relatedAccommodations: [] } }
    );
    console.log(`[seed-defaults]: Updated ${accResult.modifiedCount} accommodation items.`);

    console.log("[seed-defaults]: Updating Yoga items...");
    const yogaResult = await YogaItem.updateMany(
      { relatedYoga: { $exists: false } },
      { $set: { relatedYoga: [] } }
    );
    console.log(`[seed-defaults]: Updated ${yogaResult.modifiedCount} yoga items.`);

    console.log("[seed-defaults]: All related default seeds completed successfully.");
    process.exit(0);
  } catch (error: any) {
    console.error("[seed-defaults]: Error updating defaults:", error);
    process.exit(1);
  }
};

runSeedDefaults();
