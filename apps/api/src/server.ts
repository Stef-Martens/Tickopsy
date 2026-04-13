import express from "express";
import cors, { CorsOptions } from "cors";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { handleWebhook } from "./controllers/stripe.controller";

function getAllowedOrigins() {
  const configuredOrigins =
    process.env.FRONTEND_ORIGINS ||
    process.env.FRONTEND_ORIGIN ||
    "http://localhost:3000";

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function createServer() {
  const app = express();
  const allowedOrigins = getAllowedOrigins();

  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));

  app.use(
    "/api/stripe/webhook",
    express.raw({ type: "application/json", limit: "2mb" }),
    handleWebhook,
  );

  app.use(express.json({ limit: "1mb" }));

  app.use("/api", router);
  app.use(errorHandler);

  return app;
}
