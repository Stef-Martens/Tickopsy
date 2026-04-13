"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUsersByAccountId = getUsersByAccountId;
exports.getUserById = getUserById;
exports.getUserByIdForAccount = getUserByIdForAccount;
exports.updateUser = updateUser;
exports.updateUserForAccount = updateUserForAccount;
exports.deleteUser = deleteUser;
exports.deleteUserForAccount = deleteUserForAccount;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
async function getAllUsers() {
    return await database_tickopsy_1.default.user.findMany({
        include: { account: true, ticketsCreated: true },
    });
}
async function getUsersByAccountId(accountId) {
    return await database_tickopsy_1.default.user.findMany({
        where: { accountId },
        include: { account: true, ticketsCreated: true },
    });
}
async function getUserById(id) {
    return await database_tickopsy_1.default.user.findUnique({
        where: { id },
        include: { account: true },
    });
}
async function getUserByIdForAccount(id, accountId) {
    return await database_tickopsy_1.default.user.findFirst({
        where: { id, accountId },
        include: { account: true },
    });
}
async function updateUser(id, data) {
    // No password handling here — managed by Supabase
    return database_tickopsy_1.default.user.update({
        where: { id },
        data,
    });
}
async function updateUserForAccount(id, accountId, data) {
    const user = await database_tickopsy_1.default.user.findFirst({ where: { id, accountId } });
    if (!user) {
        return null;
    }
    return database_tickopsy_1.default.user.update({
        where: { id },
        data,
    });
}
async function deleteUser(id) {
    return await database_tickopsy_1.default.user.delete({ where: { id } });
}
async function deleteUserForAccount(id, accountId) {
    const user = await database_tickopsy_1.default.user.findFirst({ where: { id, accountId } });
    if (!user) {
        return null;
    }
    return database_tickopsy_1.default.user.delete({ where: { id } });
}
