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

type UpsertUserArgs =
  | {
      email: string;
      name: string;
      password: string;
      role?: string;
      provider?: undefined;
      accessToken?: undefined;
    }
  | {
      email: string;
      name: string;
      provider: string;
      accessToken: string;
      role?: string;
      password?: undefined;
    };

export async function signupUser(args: UpsertUserArgs) {
  const { email, name, role = "ADMIN" } = args;

  if (!email || !name) {
    throw new Error("Email and name are required");
  }

  // --- 1. Resolve Supabase auth user ---
  let authUserId: string | null = null;

  if ("password" in args && args.password) {
    // Email/password signup
    const { data: authUser, error } = await supabase.auth.admin.createUser({
      email,
      password: args.password,
      email_confirm: true,
    });

    if (error) {
      if (error.message.includes("already registered")) {
        // Fetch existing Supabase user
        const { data: users } = await supabase.auth.admin.listUsers();
        const existing = users.users.find((u) => u.email === email);
        if (!existing) throw new Error("Supabase user not found");
        authUserId = existing.id;
      } else {
        throw new Error(`Supabase error: ${error.message}`);
      }
    } else {
      authUserId = authUser.user.id;
    }
  } else if ("provider" in args && args.provider) {
    // Social login (Google, etc.)
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw new Error(`Supabase error: ${error.message}`);
    const existing = users.users.find((u) => u.email === email);
    if (!existing) {
      throw new Error("Supabase user not found for social login");
    }
    authUserId = existing.id;
  }

  if (!authUserId) {
    throw new Error("Could not resolve Supabase auth user ID");
  }

  // --- 2. Check if app user already exists (by authId) ---
  let user = await prisma.user.findFirst({ where: { authId: authUserId } });
  let account = null;

  if (user) {
    account = await prisma.account.findUnique({
      where: { id: user.accountId },
    });
    return { status: "exists", user, account };
  }

  // --- 3. Create account ---
  account = await prisma.account.create({
    data: { name: `${name}'s Account`, email, phone: "", hasAccess: false },
  });

  // --- 4. Create app user ---
  user = await prisma.user.create({
    data: {
      authId: authUserId,
      accountId: account.id,
      name,
      email,
      role,
    },
  });

  return { status: "created", user, account };
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
