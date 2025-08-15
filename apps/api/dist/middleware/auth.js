"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
const supabase_1 = require("../lib/supabase");
async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader)
            return res.status(401).json({ error: "Missing Authorization header" });
        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error, } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        // Find corresponding Prisma user
        const appUser = await database_tickopsy_1.default.user.findUnique({
            where: { authId: user.id },
        });
        if (!appUser) {
            return res.status(403).json({ error: "User not found in app database" });
        }
        // Attach to request
        req.user = appUser;
        next();
    }
    catch (err) {
        next(err);
    }
}
