import express from "express";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export function createServer() {
  const app = express();

  app.use(cors());

  // For other routes, normal JSON parsing
  app.use(express.json());

  app.use("/api", router);

  app.use(errorHandler);

  return app;
}
