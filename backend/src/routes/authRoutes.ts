import { Router } from "express";
import { login, getMe } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/login", login);

// Protected routes (require token verification)
router.get("/me", protect as any, getMe);

export default router;
