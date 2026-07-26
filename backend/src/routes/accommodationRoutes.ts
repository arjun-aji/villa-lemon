import { Router } from "express";
import {
  getAllAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} from "../controllers/accommodationController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllAccommodations);

// Protected routes (require token verification and handle file upload)
router.post("/", protect as any, upload.single("image"), createAccommodation);
router.put("/:id", protect as any, upload.single("image"), updateAccommodation);
router.delete("/:id", protect as any, deleteAccommodation);

export default router;
