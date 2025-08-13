import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
import prisma from "@stef_martens/database-tickopsy";

// Signup
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role = "user" } = req.body;

    // Basic validation before hitting Supabase
    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    // Create user in Supabase Auth
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        return res.status(409).json({ error: "Email is already registered" });
      }
      return res.status(400).json({ error: error.message });
    }

    // Create user in your own DB
    const newUser = await prisma.user.create({
      data: {
        id: authUser.user.id,
        authId: authUser.user.id,
        name,
        email,
        role,
      },
    });

    res.status(201).json({ user: newUser });
  } catch (err) {
    next(err);
  }
}

// Login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return res.status(401).json({ error: "Incorrect email or password" });
      }
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
