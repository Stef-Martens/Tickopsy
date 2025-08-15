"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTickets = getAllTickets;
exports.createTicket = createTicket;
exports.updateTicket = updateTicket;
exports.deleteTicket = deleteTicket;
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
function updateTicket(id, data) {
    return database_tickopsy_1.default.ticket.update({
        where: { id },
        data: {
            description: data.description,
            status: data.status,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        },
    });
}
function deleteTicket(id) {
    return database_tickopsy_1.default.ticket.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
}
