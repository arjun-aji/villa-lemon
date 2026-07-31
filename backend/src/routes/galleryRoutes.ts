import { Router } from "express";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getGalleryItems);

// Protected routes (admin only)
router.post("/", protect as any, upload.single("image"), createGalleryItem);
router.patch("/:id", protect as any, upload.single("image"), updateGalleryItem);
router.delete("/:id", protect as any, deleteGalleryItem);

export default router;
