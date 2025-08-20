import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { AppError } from "../services/error.service";
import * as userService from "../services/user.service";
import * as accountService from "../services/account.service";

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

// export async function signupSocial(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const { email, name, provider, accessToken } = req.body;
//     const result = await authService.signupSocialUser({
//       email,
//       name,
//       provider,
//       accessToken,
//     });
//     res.status(200).json(result);
//   } catch (err: any) {
//     if (err instanceof AppError) {
//       return res
//         .status(err.status)
//         .json({ error: err.message, code: err.code });
//     }
//     console.error(err);
//     return res
//       .status(500)
//       .json({ error: "Internal server error", code: "INTERNAL_ERROR" });
//   }
// }

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

export async function me(req: any, res: Response, next: NextFunction) {
  try {
    console.log("Fetching user info for:", req);
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const account = user.accountId
      ? await accountService.getAccountById(user.accountId)
      : null;

    res.json({ user, account });
  } catch (error) {
    next(error);
  }
}
