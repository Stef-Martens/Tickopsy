import dotenv from "dotenv";
dotenv.config();

import { createServer } from "./server";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

requireEnv("DATABASE_URL");

if (!process.env.SUPABASE_URL) {
  console.warn(
    "⚠️  SUPABASE_URL not set — auth endpoints will fail until configured",
  );
}

const port = Number(process.env.PORT || 4000);
const app = createServer();

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
