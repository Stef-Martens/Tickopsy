import express from "express";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { handleWebhook } from "./controllers/stripe.controller";

export function createServer() {
  const app = express();

  app.use(cors());

  // Register webhook BEFORE json middleware
  app.use(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleWebhook
  );

  // Normal JSON parsing for all other routes
  app.use(express.json());

  app.use("/api", router);
  app.use(errorHandler);

  return app;
}
