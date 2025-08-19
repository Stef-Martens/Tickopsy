import { Request, Response } from "express";
import * as authService from "..//services/subscription.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil" as any,
});

// This secret comes from your Stripe dashboard -> Webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handleWebhook = async (req: Request, res: Response) => {
  let event: Stripe.Event;

  try {
    // Stripe requires the raw body to verify signature
    const signature = req.headers["stripe-signature"]!;
    if (!signature) {
      return res.status(400).send("Missing Stripe signature header");
    }
    console.log("Stripe signature header found:", signature);
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed.", err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle different event types
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ Checkout completed for session:", session.id);
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const email = session.customer_email;

      console.log("session metadata:", session.metadata);

      try {
        // Your service updates the DB
        await authService.updateSubscription({
          customerId,
          subscriptionId,
          email: email ?? undefined,
          priceId: session.metadata?.priceId || "default",
          status: "active",
          expiresAt: session.expires_at
            ? new Date(session.expires_at * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // fallback: 30 days from now
        });
      } catch (err) {
        console.error("Failed to update subscription:", err);
      }
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object as Stripe.Invoice;
      console.log("💰 Payment succeeded for invoice:", invoice.id);
      // TODO: update subscription/payment status
      break;

    case "customer.subscription.updated":
      const subscription = event.data.object as Stripe.Subscription;
      console.log("📅 Subscription updated:", subscription.id);
      // TODO: update subscription info in DB
      break;

    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object as Stripe.Subscription;
      const deletedSubscriptionId = deletedSubscription.id;
      const deletedCustomerId = deletedSubscription.customer as string;

      await authService.updateSubscription({
        customerId: deletedCustomerId,
        subscriptionId: deletedSubscriptionId,
        status: "canceled",
        priceId: deletedSubscription.items.data[0].price.id,
        expiresAt: new Date(),
      });

      // TODO: update subscription info in DB
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("Received");
};
