"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupError = void 0;
exports.signupUser = signupUser;
exports.sendPasswordReset = sendPasswordReset;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
const supabase_1 = require("../lib/supabase");
class SignupError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
exports.SignupError = SignupError;
async function signupUser(args) {
    const { email, name, role = "ADMIN" } = args;
    if (!email || !name) {
        throw new Error("Email and name are required");
    }
    // --- 1. Resolve Supabase auth user ---
    let authUserId = null;
    if ("password" in args && args.password) {
        // Email/password signup
        const { data: authUser, error } = await supabase_1.supabase.auth.admin.createUser({
            email,
            password: args.password,
            email_confirm: true,
        });
        if (error) {
            if (error.message.includes("already registered")) {
                // Fetch existing Supabase user
                const { data: users } = await supabase_1.supabase.auth.admin.listUsers();
                const existing = users.users.find((u) => u.email === email);
                if (!existing)
                    throw new Error("Supabase user not found");
                authUserId = existing.id;
            }
            else {
                throw new Error(`Supabase error: ${error.message}`);
            }
        }
        else {
            authUserId = authUser.user.id;
        }
    }
    else if ("provider" in args && args.provider) {
        // Social login (Google, etc.)
        const { data: users, error } = await supabase_1.supabase.auth.admin.listUsers();
        if (error)
            throw new Error(`Supabase error: ${error.message}`);
        const existing = users.users.find((u) => u.email === email);
        if (!existing) {
            throw new Error("Supabase user not found for social login");
        }
        authUserId = existing.id;
    }
    if (!authUserId) {
        throw new Error("Could not resolve Supabase auth user ID");
    }
    // --- 2. Check if app user already exists (by authId) ---
    let user = await database_tickopsy_1.default.user.findFirst({ where: { authId: authUserId } });
    let account = null;
    if (user) {
        account = await database_tickopsy_1.default.account.findUnique({
            where: { id: user.accountId },
        });
        return { status: "exists", user, account };
    }
    // --- 3. Create account ---
    account = await database_tickopsy_1.default.account.create({
        data: { name: `${name}'s Account`, email, phone: "", hasAccess: false },
    });
    // --- 4. Create app user ---
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
