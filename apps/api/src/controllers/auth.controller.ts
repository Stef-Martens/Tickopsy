import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../services/error.service";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signupUser({ name, email, password });
    res.status(200).json(result);
  } catch (err: any) {
    if (err instanceof AppError) {
      return res
        .status(err.status)
        .json({ error: err.message, code: err.code });
    }
    console.error(err);
    return res
      .status(500)
      .json({ error: "Internal server error", code: "INTERNAL_ERROR" });
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await authService.sendPasswordReset(req.body.email);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
