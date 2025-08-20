import { Request, Response, NextFunction } from "express";
import * as accountService from "../services/account.service";
import { AppError } from "../services/error.service";

export async function getAccounts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    next(error);
  }
}

export async function getAccountById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const account = await accountService.getAccountById(req.params.id);
    if (!account) {
      throw new AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
    }
    res.json(account);
  } catch (error) {
    next(error);
  }
}

export async function createAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const account = await accountService.createAccount(req.body);
    res.status(201).json(account);
  } catch (error) {
    next(error);
  }
}

export async function updateAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const account = await accountService.updateAccount(req.params.id, req.body);
    if (!account) {
      throw new AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
    }
    res.json(account);
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await accountService.deleteAccount(req.params.id);
    if (!deleted) {
      throw new AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
