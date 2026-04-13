import { Request, Response, NextFunction } from "express";
import * as accountService from "../services/account.service";
import { AppError } from "../services/error.service";

export async function getAccounts(req: any, res: Response, next: NextFunction) {
  try {
    const account = await accountService.getAccountById(req.user.accountId);
    res.json(account ? [account] : []);
  } catch (error) {
    next(error);
  }
}

export async function getAccountById(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.params.id !== req.user.accountId) {
      throw new AppError("Forbidden", "FORBIDDEN", 403);
    }

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
  next: NextFunction,
) {
  try {
    throw new AppError(
      "Account creation is handled during signup",
      "ACCOUNT_CREATE_NOT_ALLOWED",
      403,
    );
  } catch (error) {
    next(error);
  }
}

export async function updateAccount(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const account = await accountService.updateAccountForUser(
      req.params.id,
      req.user.accountId,
      req.body,
    );
    if (!account) {
      throw new AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
    }
    res.json(account);
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: any,
  res: Response,
  next: NextFunction,
) {
  try {
    const deleted = await accountService.deleteAccountForUser(
      req.params.id,
      req.user.accountId,
    );
    if (!deleted) {
      throw new AppError("Account not found", "ACCOUNT_NOT_FOUND", 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
