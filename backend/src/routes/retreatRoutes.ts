import { Router } from "express";
import {
  getAllRetreats,
  getRetreatBySlug,
  createRetreat,
  updateRetreat,
  deleteRetreat,
  uploadRetreatImage,
  reorderRetreats,
} from "../controllers/retreatController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Public routes
router.get("/", getAllRetreats);
router.get("/:slug", getRetreatBySlug);

// Protected routes
const retreatUpload = upload.fields([
  { name: "heroImage", maxCount: 1 },
  { name: "teacherPhotos", maxCount: 10 },
  { name: "roomImages", maxCount: 20 },
  { name: "galleryYoga", maxCount: 20 },
  { name: "galleryAccommodation", maxCount: 20 },
  { name: "galleryExcursions", maxCount: 20 },
  { name: "galleryFood", maxCount: 20 },
  { name: "galleryTeachers", maxCount: 10 },
  { name: "galleryBeach", maxCount: 10 },
  { name: "galleryStudents", maxCount: 10 },
  { name: "galleryCampus", maxCount: 10 },
  { name: "ogImage", maxCount: 1 },
]);

router.post("/upload-image", protect as any, upload.single("image"), uploadRetreatImage);
router.post("/", protect as any, retreatUpload, createRetreat);
router.put("/reorder", protect as any, reorderRetreats);
router.put("/:id", protect as any, retreatUpload, updateRetreat);
router.delete("/:id", protect as any, deleteRetreat);

export default router;

