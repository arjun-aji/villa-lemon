import { Router } from "express";
import {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packageController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllPackages);

// Protected routes (require token verification and handle file upload)
router.post("/", protect as any, upload.single("image"), createPackage);
router.put("/:id", protect as any, upload.single("image"), updatePackage);
router.delete("/:id", protect as any, deletePackage);

export default router;
