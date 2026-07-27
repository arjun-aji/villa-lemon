import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { Accommodation } from "../models/Accommodation";
import { Package } from "../models/Package";
import { YogaProgram } from "../models/Yoga";

dotenv.config();

const listCategories = async () => {
  await connectDB();
  
  console.log("=== ACCOMMODATION CATEGORIES ===");
  const stays = await Accommodation.find({});
  stays.forEach((s: any) => console.log(`- [${s.type}] ${s.title.en} (href: ${s.href})`));

  console.log("\n=== PACKAGE CATEGORIES ===");
  const pkgs = await Package.find({});
  pkgs.forEach((p: any) => console.log(`- ${p.title.en} (category: ${p.category})`));

  console.log("\n=== YOGA CATEGORIES ===");
  const yogas = await YogaProgram.find({});
  yogas.forEach((y: any) => console.log(`- ${y.title.en} (type: ${y.type})`));

  process.exit(0);
};

listCategories();
