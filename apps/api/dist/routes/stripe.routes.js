"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stripe_controller_1 = require("../controllers/stripe.controller");
const router = (0, express_1.Router)();
// Webhook endpoint
// Important: Do NOT use express.json() here because Stripe needs raw body
router.post("/webhook", stripe_controller_1.handleWebhook);
exports.default = router;
