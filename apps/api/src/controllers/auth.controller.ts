import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import * as userService from "../services/user.service";
import * as accountService from "../services/account.service";
import { AppError } from "../services/error.service";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length).trim();
      const result = await authService.provisionUserFromToken({
        accessToken: token,
        fallbackName: req.body?.name,
      });
      res.status(200).json(result);
      return;
    }

    const result = await authService.signupUser({
      email: req.body?.email,
      name:
        req.body?.name ||
        `${req.body?.["first-name"] || ""} ${req.body?.["last-name"] || ""}`.trim(),
      password: req.body?.password,
    });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await authService.sendPasswordReset(req.body.email);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function me(req: any, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }

    const account = user.accountId
      ? await accountService.getAccountById(user.accountId)
      : null;

    res.json({ user, account });
  } catch (err) {
    next(err);
  }
}
