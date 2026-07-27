import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const listAll = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI in env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if (!db) {
    console.error("No active DB connection");
    process.exit(1);
  }

  console.log("Connected database:", db.databaseName);
  
  const collections = await db.listCollections().toArray();
  console.log("Collections:");
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments();
    console.log(`- ${col.name}: ${count} docs`);
  }

  process.exit(0);
};

listAll();
