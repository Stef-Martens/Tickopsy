import { Request, Response, NextFunction } from "express";
import { supabase } from "src/lib/supabase";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
}
