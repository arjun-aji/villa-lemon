import { Router } from "express";
import {
  getAllAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  reorderAccommodations,
} from "../controllers/accommodationController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllAccommodations);

// Protected routes (require token verification and handle file upload)
router.post("/", protect as any, upload.any(), createAccommodation);
router.put("/reorder", protect as any, reorderAccommodations);
router.put("/:id", protect as any, upload.any(), updateAccommodation);
router.delete("/:id", protect as any, deleteAccommodation);

export default router;
