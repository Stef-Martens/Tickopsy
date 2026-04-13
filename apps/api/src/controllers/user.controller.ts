import { Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { AppError } from "../services/error.service";

export async function getUsers(req: any, res: Response, next: NextFunction) {
  try {
    const users = await userService.getUsersByAccountId(req.user.accountId);
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req: any, res: Response, next: NextFunction) {
  try {
    const user = await userService.getUserByIdForAccount(
      req.params.id,
      req.user.accountId,
    );
    if (!user) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: any, res: Response, next: NextFunction) {
  try {
    if (req.params.id !== req.user.id && req.user.role !== "ADMIN") {
      throw new AppError("Forbidden", "FORBIDDEN", 403);
    }

    const user = await userService.updateUserForAccount(
      req.params.id,
      req.user.accountId,
      {
        name: req.body?.name,
        email: req.body?.email,
        phone: req.body?.phone,
      },
    );

    if (!user) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: any, res: Response, next: NextFunction) {
  try {
    if (req.user.role !== "ADMIN") {
      throw new AppError("Forbidden", "FORBIDDEN", 403);
    }

    const deleted = await userService.deleteUserForAccount(
      req.params.id,
      req.user.accountId,
    );
    if (!deleted) {
      throw new AppError("User not found", "USER_NOT_FOUND", 404);
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
