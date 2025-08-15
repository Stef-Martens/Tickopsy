import prisma from "@stef_martens/database-tickopsy";
import { supabase } from "../lib/supabase";

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
    throw new Error("Name, email, and password are required");
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user already exists in Prisma
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "User already exists",
    };
  }

  // Create user in Supabase auth
  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return {
        status: "error",
        message: "Email is already registered",
      };
    }
    throw new Error(error.message);
  }

  // Create account in Prisma
  const account = await prisma.account.create({
    data: {
      name: `${name}'s Account`,
      email,
      phone: "",
    },
  });

  // Create user in Prisma linked to the account
  const newUser = await prisma.user.create({
    data: {
      authId: authUser.user.id, // Supabase auth user ID
      accountId: account.id, // Link to the created account
      name,
      email,
      role,
    },
  });

  return {
    status: "success",
    user: newUser,
    account,
  };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Incorrect email or password");
    }
    throw new Error(error.message);
  }

  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return true;
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
