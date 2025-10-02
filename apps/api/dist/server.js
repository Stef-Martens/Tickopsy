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
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    // Register webhook BEFORE json middleware
    app.use("/api/stripe/webhook", express_1.default.raw({ type: "application/json" }), stripe_controller_1.handleWebhook);
    // Normal JSON parsing for all other routes
    app.use(express_1.default.json());
    app.use("/api", routes_1.default);
    app.use(errorHandler_1.errorHandler);
    return app;
}
