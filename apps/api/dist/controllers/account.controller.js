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
exports.getAccounts = getAccounts;
exports.getAccountById = getAccountById;
exports.createAccount = createAccount;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
const accountService = __importStar(require("../services/account.service"));
const error_service_1 = require("../services/error.service");
async function getAccounts(req, res, next) {
    try {
        const accounts = await accountService.getAllAccounts();
        res.json(accounts);
    }
    catch (error) {
        next(error);
    }
}
async function getAccountById(req, res, next) {
    try {
        const account = await accountService.getAccountById(req.params.id);
        if (!account) {
            throw new error_service_1.AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
        }
        res.json(account);
    }
    catch (error) {
        next(error);
    }
}
async function createAccount(req, res, next) {
    try {
        const account = await accountService.createAccount(req.body);
        res.status(201).json(account);
    }
    catch (error) {
        next(error);
    }
}
async function updateAccount(req, res, next) {
    try {
        const account = await accountService.updateAccount(req.params.id, req.body);
        if (!account) {
            throw new error_service_1.AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
        }
        res.json(account);
    }
    catch (error) {
        next(error);
    }
}
async function deleteAccount(req, res, next) {
    try {
        const deleted = await accountService.deleteAccount(req.params.id);
        if (!deleted) {
            throw new error_service_1.AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
