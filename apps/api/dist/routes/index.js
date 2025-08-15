"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_routes_1 = __importDefault(require("./account.routes"));
const ticket_routes_1 = __importDefault(require("./ticket.routes"));
const user_route_1 = __importDefault(require("./user.route"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const stripe_routes_1 = __importDefault(require("./stripe.routes"));
const router = (0, express_1.Router)();
router.use("/", auth_routes_1.default);
router.use("/accounts", account_routes_1.default);
router.use("/users", user_route_1.default);
router.use("/tickets", ticket_routes_1.default);
router.use("/stripe", stripe_routes_1.default);
exports.default = router;
