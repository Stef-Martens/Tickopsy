import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { AppError } from "../services/error.service";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
