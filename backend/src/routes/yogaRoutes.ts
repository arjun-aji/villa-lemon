import { Router } from "express";
import {
  getAllYogaPrograms,
  createYogaProgram,
  updateYogaProgram,
  deleteYogaProgram,
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  reorderYogaPrograms,
} from "../controllers/yogaController";
import { protect } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// Program routes
router.get("/programs", getAllYogaPrograms);
router.post("/programs", protect as any, upload.any(), createYogaProgram);
router.put("/programs/reorder", protect as any, reorderYogaPrograms);
router.put("/programs/:id", protect as any, upload.any(), updateYogaProgram);
router.delete("/programs/:id", protect as any, deleteYogaProgram);

// Teacher routes
router.get("/teachers", getAllTeachers);
router.post("/teachers", protect as any, upload.single("image"), createTeacher);
router.put("/teachers/:id", protect as any, upload.single("image"), updateTeacher);
router.delete("/teachers/:id", protect as any, deleteTeacher);

export default router;
