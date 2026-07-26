import { Request } from "express";
import multer, { FileFilterCallback } from "multer";

// Use memory storage to upload directly to Cloudinary without writing to disk
const storage = multer.memoryStorage();

// Filter files by type
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image/")) {
    callback(null, true);
  } else {
    callback(new Error("Invalid file type. Only image files are allowed.") as any, false);
  }
};

const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "10485760", 10);

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});
