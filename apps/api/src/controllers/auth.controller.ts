import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.signupUser(req.body);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.loginUser(req.body);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    await authService.logoutUser();
    res.status(204).send();
  } catch (err) {
    next(err);
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
