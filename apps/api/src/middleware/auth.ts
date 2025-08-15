import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import prisma from "@stef_martens/database-tickopsy";
import { supabase } from "../lib/supabase";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Missing Authorization header" });

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Find corresponding Prisma user
    const appUser = await prisma.user.findUnique({
      where: { authId: user.id },
    });

    if (!appUser) {
      return res.status(403).json({ error: "User not found in app database" });
    }

    // Attach to request
    (req as any).user = appUser;
    next();
  } catch (err) {
    next(err);
  }
}
