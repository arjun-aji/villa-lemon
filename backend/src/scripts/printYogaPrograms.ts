import dotenv from "dotenv";
import { connectDB } from "../config/db";
import { YogaProgram } from "../models/Yoga";

dotenv.config();

const printYoga = async () => {
  await connectDB();
  const programs = await YogaProgram.find({});
  console.log(JSON.stringify(programs, null, 2));
  process.exit(0);
};

printYoga();
