"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupError = void 0;
exports.signupUser = signupUser;
exports.provisionUserFromToken = provisionUserFromToken;
exports.sendPasswordReset = sendPasswordReset;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
const supabase_1 = require("../lib/supabase");
const error_service_1 = require("./error.service");
class SignupError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.SignupError = SignupError;
async function getOrCreateAppUser(params) {
    const { authUserId, email, name, role = "USER" } = params;
    let user = await database_tickopsy_1.default.user.findFirst({ where: { authId: authUserId } });
    let account = null;
    if (user) {
        account = await database_tickopsy_1.default.account.findUnique({
            where: { id: user.accountId },
        });
        return { status: "exists", user, account };
    }
    account = await database_tickopsy_1.default.account.create({
        data: { name: `${name}'s Account`, email, phone: "", hasAccess: false },
    });
    user = await database_tickopsy_1.default.user.create({
        data: {
            authId: authUserId,
            accountId: account.id,
            name,
            email,
            role,
        },
    });
    return { status: "created", user, account };
}
async function signupUser(args) {
    const { email, name, password } = args;
    if (!email || !name || !password) {
        throw new error_service_1.AppError("Email, name and password are required", "INVALID_SIGNUP_INPUT", 400);
    }
    let authUserId = null;
    const { data: authUser, error } = await supabase_1.supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });
    if (error) {
        if (error.message.includes("already registered")) {
            const { data: users } = await supabase_1.supabase.auth.admin.listUsers();
            const existing = users.users.find((u) => u.email === email);
            if (!existing) {
                throw new error_service_1.AppError("Supabase user not found", "SUPABASE_USER_NOT_FOUND", 404);
            }
            authUserId = existing.id;
        }
        else {
            throw new error_service_1.AppError(error.message, "SUPABASE_AUTH_ERROR", 400);
        }
    }
    else {
        authUserId = authUser.user.id;
    }
    if (!authUserId) {
        throw new error_service_1.AppError("Could not resolve Supabase auth user ID", "SUPABASE_AUTH_ERROR", 500);
    }
    return getOrCreateAppUser({
        authUserId,
        email,
        name,
        role: "USER",
    });
}
async function provisionUserFromToken(args) {
    const { accessToken, fallbackName } = args;
    if (!accessToken) {
        throw new error_service_1.AppError("Missing access token", "UNAUTHORIZED", 401);
    }
    const { data: { user }, error, } = await supabase_1.supabase.auth.getUser(accessToken);
    if (error || !user) {
        throw new error_service_1.AppError("Invalid or expired token", "UNAUTHORIZED", 401);
    }
    const email = user.email;
    const name = user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        fallbackName ||
        (email ? email.split("@")[0] : "User");
    if (!email) {
        throw new error_service_1.AppError("User email is missing", "INVALID_USER_DATA", 400);
    }
    return getOrCreateAppUser({
        authUserId: user.id,
        email,
        name,
        role: "USER",
    });
}
async function sendPasswordReset(email) {
    if (!email) {
        throw new Error("Email is required");
    }
    if (!email.includes("@")) {
        throw new Error("Invalid email address");
    }
    const { data, error } = await supabase_1.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.RESET_PASSWORD_REDIRECT_URL ||
            "http://localhost:3000/reset-password",
    });
    if (error)
        throw new Error(error.message);
    return data;
}
