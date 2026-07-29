import { Router } from "express";
import {
  getAllAccommodationItems,
  getAccommodationItemBySlug,
  createAccommodationItem,
  updateAccommodationItem,
  deleteAccommodationItem,
  reorderAccommodationItems,
} from "../controllers/accommodationItemController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllAccommodationItems);
router.get("/:slug", getAccommodationItemBySlug);

// Protected routes (require token and handle cover + about image files)
router.post(
  "/",
  protect as any,
  upload.any(),
  createAccommodationItem
);

router.put("/reorder", protect as any, reorderAccommodationItems);

router.put(
  "/:id",
  protect as any,
  upload.any(),
  updateAccommodationItem
);

router.delete("/:id", protect as any, deleteAccommodationItem);

export default router;
