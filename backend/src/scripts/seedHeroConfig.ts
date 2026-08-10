import mongoose from "mongoose";
import dotenv from "dotenv";
import { YogaProgram } from "../models/Yoga";

dotenv.config();

const HERO_DEFAULTS: Record<string, Record<string, string>> = {
  retreatVenue: {
    en: "Exclusive Group Retreat Venue",
    de: "",
    fr: "",
    ru: ""
  },
  hostTitle: {
    en: "Host Your Retreat at Villa Lemon",
    de: "",
    fr: "",
    ru: ""
  },
  hostIntro: {
    en: "We provide private, premium homestay accommodation combined with a tranquil rooftop yoga hall, homely catering services, and reliable airport transfers. Use our interactive dashboard below to plan your room layout, customize meals, select logistics, and draft a proposal request.",
    de: "",
    fr: "",
    ru: ""
  }
};

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found in env file.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected successfully.");

  const programs = await YogaProgram.find({});
  console.log(`Found ${programs.length} total yoga programs.`);

  let updatedCount = 0;

  for (const prog of programs) {
    // Only update programs with a hostRetreatConfig
    if (!prog.hostRetreatConfig) continue;

    console.log(`Processing: ${prog.title?.en || prog._id}`);

    const config = prog.hostRetreatConfig as Record<string, any>;
    let changed = false;

    for (const [key, value] of Object.entries(HERO_DEFAULTS)) {
      // Only set if the key is missing or empty in the DB
      if (!config[key] || !config[key].en) {
        config[key] = value;
        changed = true;
        console.log(`  → Setting ${key}.en = "${value.en.slice(0, 60)}..."`);
      } else {
        console.log(`  ✓ ${key} already set, skipping`);
      }
    }

    if (changed) {
      prog.hostRetreatConfig = config;
      prog.markModified("hostRetreatConfig");
      await prog.save();
      updatedCount++;
      console.log(`  Saved.`);
    }
  }

  console.log(`\nDone. Updated ${updatedCount} programs.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
