import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

// Public auth routes
router.post("/signup", authController.signup);
router.post("/forgot-password", authController.forgotPassword);

export default router;
