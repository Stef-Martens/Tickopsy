"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server_1 = require("./server");
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return value;
}
requireEnv("SUPABASE_URL");
requireEnv("DATABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY &&
    !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error("Missing required env var: SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)");
}
const port = Number(process.env.PORT || 4000);
const app = (0, server_1.createServer)();
app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
