"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAccounts = getAllAccounts;
exports.getAccountById = getAccountById;
exports.createAccount = createAccount;
exports.updateAccount = updateAccount;
exports.deleteAccount = deleteAccount;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
function getAllAccounts() {
    return database_tickopsy_1.default.account.findMany({
        include: {
            users: true,
            customers: true,
            tickets: true,
            subscriptions: true,
        },
    });
}
function getAccountById(id) {
    return database_tickopsy_1.default.account.findUnique({
        where: { id },
        include: {
            users: true,
            customers: true,
            tickets: true,
        },
    });
}
function createAccount(data) {
    return database_tickopsy_1.default.account.create({ data });
}
function updateAccount(id, data) {
    return database_tickopsy_1.default.account.update({
        where: { id },
        data,
    });
}
function deleteAccount(id) {
    return database_tickopsy_1.default.account.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
