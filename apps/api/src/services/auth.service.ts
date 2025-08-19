import prisma from "@stef_martens/database-tickopsy";
import { supabase } from "../lib/supabase";
import { AppError } from "./error.service";

export class SignupError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export async function signupUser({
  name,
  email,
  password,
  role = "user",
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  if (!email || !password || !name) {
    throw new SignupError(
      "Name, email, and password are required",
      "INVALID_INPUT"
    );
  }

  const existingUser = await prisma.user.findFirst({ where: { email } });

  if (existingUser) {
    throw new AppError("User already exists", "EMAIL_EXISTS", 400);
  }

  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      throw new AppError("Email is already registered", "EMAIL_EXISTS", 400);
    }
    throw new AppError(error.message, "SUPABASE_ERROR", 400);
  }

  const account = await prisma.account.create({
    data: { name: `${name}'s Account`, email, phone: "" },
  });

  const newUser = await prisma.user.create({
    data: {
      authId: authUser.user.id,
      accountId: account.id,
      name,
      email,
      role,
    },
  });

  return { status: "success", user: newUser, account };
}

export async function sendPasswordReset(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }
  if (!email.includes("@")) {
    throw new Error("Invalid email address");
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      process.env.RESET_PASSWORD_REDIRECT_URL ||
      "http://localhost:3000/reset-password",
  });

  if (error) throw new Error(error.message);

  return data;
}
