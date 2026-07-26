import { Router } from "express";
import {
  getAllAccommodationItems,
  getAccommodationItemBySlug,
  createAccommodationItem,
  updateAccommodationItem,
  deleteAccommodationItem,
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
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  createAccommodationItem
);

router.put(
  "/:id",
  protect as any,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  updateAccommodationItem
);

router.delete("/:id", protect as any, deleteAccommodationItem);

export default router;
