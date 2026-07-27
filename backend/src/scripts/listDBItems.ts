import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { AccommodationItem } from "../models/AccommodationItem";
import { PackageItem } from "../models/PackageItem";
import { YogaItem } from "../models/YogaItem";

dotenv.config();

const listItems = async () => {
  await connectDB();
  
  console.log("=== ACCOMMODATIONS ===");
  const stays = await AccommodationItem.find({}, "title slug accommodationType");
  stays.forEach(s => console.log(`- [${s.accommodationType}] ${s.title.en} (slug: ${s.slug})`));

  console.log("\n=== PACKAGES ===");
  const pkgs = await PackageItem.find({}, "title slug packageCategory");
  pkgs.forEach(p => console.log(`- [${p.packageCategory}] ${p.title.en} (slug: ${p.slug})`));

  console.log("\n=== YOGA ===");
  const yogas = await YogaItem.find({}, "title slug yogaType");
  yogas.forEach(y => console.log(`- [${y.yogaType}] ${y.title.en} (slug: ${y.slug})`));

  process.exit(0);
};

listItems();
