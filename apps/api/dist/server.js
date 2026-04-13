"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const stripe_controller_1 = require("./controllers/stripe.controller");
function getAllowedOrigins() {
    const configuredOrigins = process.env.FRONTEND_ORIGINS ||
        process.env.FRONTEND_ORIGIN ||
        "http://localhost:3000";
    return configuredOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}
function createServer() {
    const app = (0, express_1.default)();
    const allowedOrigins = getAllowedOrigins();
    const corsOptions = {
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
    app.use((0, cors_1.default)(corsOptions));
    app.use("/api/stripe/webhook", express_1.default.raw({ type: "application/json", limit: "2mb" }), stripe_controller_1.handleWebhook);
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use("/api", routes_1.default);
    app.use(errorHandler_1.errorHandler);
    return app;
}
