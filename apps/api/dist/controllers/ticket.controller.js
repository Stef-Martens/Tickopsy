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
exports.getTickets = getTickets;
exports.createTicket = createTicket;
exports.updateTicket = updateTicket;
exports.deleteTicket = deleteTicket;
const ticketService = __importStar(require("../services/ticket.service"));
async function getTickets(req, res, next) {
    try {
        const tickets = await ticketService.getAllTickets();
        res.json(tickets);
    }
    catch (error) {
        next(error);
    }
}
async function createTicket(req, res, next) {
    try {
        const ticket = await ticketService.createTicket(req.body);
        res.status(201).json(ticket);
    }
    catch (error) {
        next(error);
    }
}
async function updateTicket(req, res, next) {
    try {
        const ticket = await ticketService.updateTicket(req.params.id, req.body);
        res.json(ticket);
    }
    catch (error) {
        next(error);
    }
}
async function deleteTicket(req, res, next) {
    try {
        await ticketService.deleteTicket(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
