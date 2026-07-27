import { Router } from "express";
import {
  getAllPackageItems,
  getPackageItemBySlug,
  createPackageItem,
  updatePackageItem,
  deletePackageItem,
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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
    { name: "ogImage", maxCount: 1 },
  ]),
  createPackageItem
);

router.put(
  "/:id",
  protect as any,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
    { name: "ogImage", maxCount: 1 },
  ]),
  updatePackageItem
);

router.delete("/:id", protect as any, deletePackageItem);

export default router;
