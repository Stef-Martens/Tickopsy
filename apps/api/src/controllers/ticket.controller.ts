import { Response, NextFunction } from "express";
import * as ticketService from "../services/ticket.service";
import { AppError } from "../services/error.service";

export async function getTickets(req: any, res: Response, next: NextFunction) {
  try {
    const tickets = await ticketService.getTicketsByAccountId(
      req.user.accountId,
    );
    res.json(tickets);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticket = await ticketService.createTicket({
      accountId: req.user.accountId,
      createdById: req.user.id,
      customerId: req.body?.customerId,
      description: req.body?.description,
      status: req.body?.status,
      dueDate: req.body?.dueDate,
    });
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const ticket = await ticketService.updateTicketForAccount(
      req.params.id,
      req.user.accountId,
      req.body,
    );

    if (!ticket) {
      throw new AppError("Ticket not found", "TICKET_NOT_FOUND", 404);
    }

    res.json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const deleted = await ticketService.deleteTicketForAccount(
      req.params.id,
      req.user.accountId,
    );

    if (!deleted) {
      throw new AppError("Ticket not found", "TICKET_NOT_FOUND", 404);
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
