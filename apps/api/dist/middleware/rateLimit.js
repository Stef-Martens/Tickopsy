"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = rateLimit;
const buckets = new Map();
function rateLimit(options) {
    const windowMs = options?.windowMs ?? 60000;
    const max = options?.max ?? 20;
    return (req, res, next) => {
        const key = `${req.ip}:${req.path}`;
        const now = Date.now();
        const current = buckets.get(key);
        if (!current || current.resetAt <= now) {
            buckets.set(key, { count: 1, resetAt: now + windowMs });
            next();
            return;
        }
        if (current.count >= max) {
            const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
            res.setHeader("Retry-After", String(retryAfterSeconds));
            res
                .status(429)
                .json({ error: "Too many requests", code: "RATE_LIMITED" });
            return;
        }
        current.count += 1;
        buckets.set(key, current);
        next();
    };
}
