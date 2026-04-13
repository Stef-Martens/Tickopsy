"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTickets = getAllTickets;
exports.getTicketsByAccountId = getTicketsByAccountId;
exports.getTicketByIdForAccount = getTicketByIdForAccount;
exports.createTicket = createTicket;
exports.updateTicketForAccount = updateTicketForAccount;
exports.deleteTicketForAccount = deleteTicketForAccount;
const database_tickopsy_1 = __importDefault(require("@stef_martens/database-tickopsy"));
function getAllTickets() {
    return database_tickopsy_1.default.ticket.findMany({
        include: {
            account: true,
            customer: true,
            creator: true,
            notifications: true,
            reminders: true,
        },
    });
}
function getTicketsByAccountId(accountId) {
    return database_tickopsy_1.default.ticket.findMany({
        where: { accountId, deletedAt: null },
        include: {
            account: true,
            customer: true,
            creator: true,
            notifications: true,
            reminders: true,
        },
    });
}
function getTicketByIdForAccount(id, accountId) {
    return database_tickopsy_1.default.ticket.findFirst({
        where: { id, accountId, deletedAt: null },
    });
}
function createTicket(data) {
    return database_tickopsy_1.default.ticket.create({
        data: {
            accountId: data.accountId,
            createdById: data.createdById,
            customerId: data.customerId,
            description: data.description,
            status: data.status,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
    });
}
async function updateTicketForAccount(id, accountId, data) {
    const existing = await database_tickopsy_1.default.ticket.findFirst({
        where: { id, accountId, deletedAt: null },
    });
    if (!existing) {
        return null;
    }
    return database_tickopsy_1.default.ticket.update({
        where: { id },
        data: {
            description: data.description,
            status: data.status,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
    });
}
async function deleteTicketForAccount(id, accountId) {
    const existing = await database_tickopsy_1.default.ticket.findFirst({
        where: { id, accountId, deletedAt: null },
    });
    if (!existing) {
        return null;
    }
    return database_tickopsy_1.default.ticket.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
