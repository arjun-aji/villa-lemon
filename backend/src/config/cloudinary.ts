import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "[cloudinary]: Warning: Cloudinary configuration variables are missing. File uploads will fail."
  );
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log("[cloudinary]: Cloudinary SDK configured successfully");
}

export default cloudinary;
