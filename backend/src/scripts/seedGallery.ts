import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";

dotenv.config();

const run = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully.");

    // Update Phase 1
    const p1 = await AccommodationItem.findOne({ slug: "villa-lemon-phase-1" });
    if (p1) {
      p1.gallery = [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", // Terrace Balcony
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0", // Bedroom
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c"  // Interior Hammock
      ];
      await p1.save();
      console.log("Seeded gallery for Villa Lemon - Phase 1");
    }

    // Update Phase 2
    const p2 = await AccommodationItem.findOne({ slug: "villa-lemon-phase-2" });
    if (p2) {
      p2.gallery = [
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", // Villa Exterior
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", // Terrace Balcony
        "https://images.unsplash.com/photo-1616594039964-ae9021a400a0", // Bedroom
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c"  // Interior
      ];
      await p2.save();
      console.log("Seeded gallery for Villa Lemon - Phase 2");
    }

    process.exit(0);
  } catch (error) {
    console.error("Gallery seed error:", error);
    process.exit(1);
  }
};

run();
