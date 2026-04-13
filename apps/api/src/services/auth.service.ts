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

type PasswordSignupArgs = {
  email: string;
  name: string;
  password: string;
};

type ProvisionFromTokenArgs = {
  accessToken: string;
  fallbackName?: string;
};

async function getOrCreateAppUser(params: {
  authUserId: string;
  email: string;
  name: string;
  role?: string;
}) {
  const { authUserId, email, name, role = "USER" } = params;

  let user = await prisma.user.findFirst({ where: { authId: authUserId } });
  let account = null;

  if (user) {
    account = await prisma.account.findUnique({
      where: { id: user.accountId },
    });
    return { status: "exists", user, account };
  }

  account = await prisma.account.create({
    data: { name: `${name}'s Account`, email, phone: "", hasAccess: false },
  });

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

export async function signupUser(args: PasswordSignupArgs) {
  const { email, name, password } = args;

  if (!email || !name || !password) {
    throw new AppError(
      "Email, name and password are required",
      "INVALID_SIGNUP_INPUT",
      400,
    );
  }

  let authUserId: string | null = null;

  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users.users.find((u) => u.email === email);
      if (!existing) {
        throw new AppError(
          "Supabase user not found",
          "SUPABASE_USER_NOT_FOUND",
          404,
        );
      }
      authUserId = existing.id;
    } else {
      throw new AppError(error.message, "SUPABASE_AUTH_ERROR", 400);
    }
  } else {
    authUserId = authUser.user.id;
  }

  if (!authUserId) {
    throw new AppError(
      "Could not resolve Supabase auth user ID",
      "SUPABASE_AUTH_ERROR",
      500,
    );
  }

  return getOrCreateAppUser({
    authUserId,
    email,
    name,
    role: "USER",
  });
}

export async function provisionUserFromToken(args: ProvisionFromTokenArgs) {
  const { accessToken, fallbackName } = args;

  if (!accessToken) {
    throw new AppError("Missing access token", "UNAUTHORIZED", 401);
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(accessToken);

  if (error || !user) {
    throw new AppError("Invalid or expired token", "UNAUTHORIZED", 401);
  }

  const email = user.email;
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    fallbackName ||
    (email ? email.split("@")[0] : "User");

  if (!email) {
    throw new AppError("User email is missing", "INVALID_USER_DATA", 400);
  }

  return getOrCreateAppUser({
    authUserId: user.id,
    email,
    name,
    role: "USER",
  });
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
