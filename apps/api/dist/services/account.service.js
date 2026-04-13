"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAccounts = getAllAccounts;
exports.getAccountsByIds = getAccountsByIds;
exports.getAccountById = getAccountById;
exports.createAccount = createAccount;
exports.updateAccount = updateAccount;
exports.updateAccountForUser = updateAccountForUser;
exports.deleteAccount = deleteAccount;
exports.deleteAccountForUser = deleteAccountForUser;
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
function getAccountsByIds(accountIds) {
    return database_tickopsy_1.default.account.findMany({
        where: { id: { in: accountIds } },
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
async function updateAccountForUser(id, accountId, data) {
    if (id !== accountId) {
        return null;
    }
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
async function deleteAccountForUser(id, accountId) {
    if (id !== accountId) {
        return null;
    }
    return database_tickopsy_1.default.account.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
