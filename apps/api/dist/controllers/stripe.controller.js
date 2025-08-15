"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = void 0;
const authService = __importStar(require("..//services/subscription.service"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-06-30.basil",
});
// This secret comes from your Stripe dashboard -> Webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const handleWebhook = async (req, res) => {
    let event;
    try {
        // Stripe requires the raw body to verify signature
        const signature = req.headers["stripe-signature"];
        event = stripe.webhooks.constructEvent(req.rawBody, // we need rawBody here
        signature, endpointSecret);
    }
    catch (err) {
        console.error("⚠️ Webhook signature verification failed.", err);
        return res.status(400).send(`Webhook Error: ${err}`);
    }
    // Handle different event types
    switch (event.type) {
        case "checkout.session.completed":
            const session = event.data.object;
            console.log("✅ Checkout completed for session:", session.id);
            const customerId = session.customer;
            const subscriptionId = session.subscription;
            const email = session.customer_email;
            try {
                // Your service updates the DB
                await authService.updateSubscription({
                    customerId,
                    subscriptionId,
                    email: email ?? undefined,
                    status: "active",
                    plan: session.metadata?.plan || "default",
                    expiresAt: session.expires_at
                        ? new Date(session.expires_at * 1000)
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // fallback: 30 days from now
                });
            }
            catch (err) {
                console.error("Failed to update subscription:", err);
            }
            break;
        case "invoice.payment_succeeded":
            const invoice = event.data.object;
            console.log("💰 Payment succeeded for invoice:", invoice.id);
            // TODO: update subscription/payment status
            break;
        case "customer.subscription.updated":
            const subscription = event.data.object;
            console.log("📅 Subscription updated:", subscription.id);
            // TODO: update subscription info in DB
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(200).send("Received");
};
exports.handleWebhook = handleWebhook;
