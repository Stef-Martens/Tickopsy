import { Router } from "express";
import { handleWebhook } from "../controllers/stripe.controller";

const router = Router();

// Webhook endpoint
// Important: Do NOT use express.json() here because Stripe needs raw body
router.post("/webhook", handleWebhook);

export default router;
