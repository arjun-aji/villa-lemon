import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { PackageItem } from "../models/PackageItem";

dotenv.config();

const migrate = async () => {
  try {
    await connectDB();
    console.log("[migration]: Connected to DB. Scanning packages...");

    const items = await PackageItem.find({});
    console.log(`[migration]: Found ${items.length} package items.`);

    let updatedCount = 0;
    for (const item of items) {
      // Force Mongoose to mark the field as modified so it saves the array type to DB
      item.markModified("packageCategory");
      await item.save();
      console.log(`[migration]: Force-saved package "${item.title.en}" with categories:`, item.packageCategory);
      updatedCount++;
    }

    console.log(`[migration]: Migration complete. Force-saved ${updatedCount} packages.`);
    process.exit(0);
  } catch (err) {
    console.error("[migration]: Migration failed", err);
    process.exit(1);
  }
};

migrate();
