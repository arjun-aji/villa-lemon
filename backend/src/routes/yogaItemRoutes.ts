import { Router } from "express";
import {
  getAllYogaItems,
  getYogaItemBySlug,
  createYogaItem,
  updateYogaItem,
  deleteYogaItem,
} from "../controllers/yogaItemController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllYogaItems);
router.get("/:slug", getYogaItemBySlug);

// Protected routes (require token and handle cover + about image files)
router.post(
  "/",
  protect as any,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
  ]),
  createYogaItem
);

router.put(
  "/:id",
  protect as any,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
  ]),
  updateYogaItem
);

router.delete("/:id", protect as any, deleteYogaItem);

export default router;
