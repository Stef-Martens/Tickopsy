import express, { Router } from "express";
import { handleWebhook } from "../controllers/stripe.controller";

const router = Router();

// Webhook endpoint
// Important: Do NOT use express.json() here because Stripe needs raw body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
