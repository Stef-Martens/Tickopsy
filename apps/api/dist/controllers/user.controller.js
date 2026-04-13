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
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const userService = __importStar(require("../services/user.service"));
const error_service_1 = require("../services/error.service");
async function getUsers(req, res, next) {
    try {
        const users = await userService.getUsersByAccountId(req.user.accountId);
        res.json(users);
    }
    catch (error) {
        next(error);
    }
}
async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserByIdForAccount(req.params.id, req.user.accountId);
        if (!user) {
            throw new error_service_1.AppError("User not found", "USER_NOT_FOUND", 404);
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}
async function updateUser(req, res, next) {
    try {
        if (req.params.id !== req.user.id && req.user.role !== "ADMIN") {
            throw new error_service_1.AppError("Forbidden", "FORBIDDEN", 403);
        }
        const user = await userService.updateUserForAccount(req.params.id, req.user.accountId, {
            name: req.body?.name,
            email: req.body?.email,
            phone: req.body?.phone,
        });
        if (!user) {
            throw new error_service_1.AppError("User not found", "USER_NOT_FOUND", 404);
        }
        res.json(user);
    }
    catch (error) {
        next(error);
    }
}
async function deleteUser(req, res, next) {
    try {
        if (req.user.role !== "ADMIN") {
            throw new error_service_1.AppError("Forbidden", "FORBIDDEN", 403);
        }
        const deleted = await userService.deleteUserForAccount(req.params.id, req.user.accountId);
        if (!deleted) {
            throw new error_service_1.AppError("User not found", "USER_NOT_FOUND", 404);
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
