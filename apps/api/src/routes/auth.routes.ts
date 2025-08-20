import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public auth routes
router.post("/signup", authController.signup);
router.get("/me", requireAuth, authController.me);
router.post("/forgot-password", authController.forgotPassword);

export default router;
