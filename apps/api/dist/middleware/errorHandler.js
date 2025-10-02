"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const error_service_1 = require("../services/error.service");
function errorHandler(err, req, res, next) {
    if (err instanceof error_service_1.AppError) {
        return res.status(err.status).json({ error: err.message, code: err.code });
    }
    console.error("Unexpected error:", err);
    return res
        .status(500)
        .json({ error: "Internal server error", code: "INTERNAL_ERROR" });
}
