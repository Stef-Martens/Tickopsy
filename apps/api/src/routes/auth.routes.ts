import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { rateLimit } from "../middleware/rateLimit";

const router = Router();

router.post(
  "/signup",
  rateLimit({ windowMs: 60_000, max: 10 }),
  authController.signup,
);
router.get("/me", requireAuth, authController.me);
router.post(
  "/forgot-password",
  rateLimit({ windowMs: 60_000, max: 5 }),
  authController.forgotPassword,
);

export default router;
