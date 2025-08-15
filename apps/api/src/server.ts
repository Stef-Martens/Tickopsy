import express from "express";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export function createServer() {
  const app = express();

  app.use(cors());

  // For Stripe webhooks, raw body is needed for verification
  app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));

  // For other routes, normal JSON parsing
  app.use(express.json());

  app.use("/api", router);

  app.use(errorHandler);

  return app;
}
