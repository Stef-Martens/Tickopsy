import { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticket.service";

export async function getTickets(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tickets = await ticketService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    next(error);
  }
}

export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const ticket = await ticketService.updateTicket(req.params.id, req.body);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
}

export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await ticketService.deleteTicket(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
