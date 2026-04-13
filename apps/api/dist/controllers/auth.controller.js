"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
exports.forgotPassword = forgotPassword;
exports.me = me;
const authService = __importStar(require("../services/auth.service"));
const userService = __importStar(require("../services/user.service"));
const accountService = __importStar(require("../services/account.service"));
const error_service_1 = require("../services/error.service");
async function signup(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.slice("Bearer ".length).trim();
            const result = await authService.provisionUserFromToken({
                accessToken: token,
                fallbackName: req.body?.name,
            });
            res.status(200).json(result);
            return;
        }
        const result = await authService.signupUser({
            email: req.body?.email,
            name: req.body?.name ||
                `${req.body?.["first-name"] || ""} ${req.body?.["last-name"] || ""}`.trim(),
            password: req.body?.password,
        });
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
}
async function forgotPassword(req, res, next) {
    try {
        const data = await authService.sendPasswordReset(req.body.email);
        res.json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
}
async function me(req, res, next) {
    try {
        const user = await userService.getUserById(req.user.id);
        if (!user) {
            throw new error_service_1.AppError("User not found", "USER_NOT_FOUND", 404);
        }
        const account = user.accountId
            ? await accountService.getAccountById(user.accountId)
            : null;
        res.json({ user, account });
    }
    catch (err) {
        next(err);
    }
}
