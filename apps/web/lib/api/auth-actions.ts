"use server";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import { apiFetch } from "./fetcher";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message, errorCode: "LOGIN_FAILED" };
  }

  return { success: true, data };
}

export async function signup(formData: FormData, accessToken?: string) {
  const firstName = formData.get("first-name")?.toString()?.trim() || "";
  const lastName = formData.get("last-name")?.toString()?.trim() || "";
  const explicitName = formData.get("name")?.toString()?.trim() || "";

  const name = explicitName || `${firstName} ${lastName}`.trim();

  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      name,
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });
}

export async function logoutAction() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message, errorCode: "LOGOUT_FAILED" };
  }

  return { success: true };
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: { access_type: "offline", prompt: "consent" },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function forgotPassword({ email }: { email: string }) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export const me = cache(async () => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      success: false,
      error: "Not authenticated",
      errorCode: "UNAUTHENTICATED",
    };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return {
      success: false,
      error: "Missing session token",
      errorCode: "UNAUTHENTICATED",
    };
  }

  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    next: { revalidate: 60 },
  });
});
