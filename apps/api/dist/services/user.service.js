"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
function getAllUsers() {
    return database_tickopsy_1.default.user.findMany({
        include: { account: true, ticketsCreated: true },
    });
}
function getUserById(id) {
    return database_tickopsy_1.default.user.findUnique({
        where: { id },
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
function deleteUser(id) {
    return database_tickopsy_1.default.user.delete({ where: { id } });
}
