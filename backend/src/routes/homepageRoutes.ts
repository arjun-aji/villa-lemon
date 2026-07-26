import { Router } from "express";
import { getHomepage, updateHomepage } from "../controllers/homepageController";
import { protect } from "../middleware/auth";

const router = Router();

// Public route to fetch landing text content
router.get("/", getHomepage);

// Protected admin editing route
router.put("/", protect as any, updateHomepage);

export default router;
