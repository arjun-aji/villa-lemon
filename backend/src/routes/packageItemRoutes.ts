import { Router } from "express";
import {
  getAllPackageItems,
  getPackageItemBySlug,
  createPackageItem,
  updatePackageItem,
  deletePackageItem,
  reorderPackageItems,
} from "../controllers/packageItemController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllPackageItems);
router.get("/:slug", getPackageItemBySlug);

// Protected routes (require token and handle cover + details + gallery + SEO images)
router.post(
  "/",
  protect as any,
  upload.any(),
  createPackageItem
);

router.put("/reorder", protect as any, reorderPackageItems);

router.put(
  "/:id",
  protect as any,
  upload.any(),
  updatePackageItem
);

router.delete("/:id", protect as any, deletePackageItem);

export default router;
