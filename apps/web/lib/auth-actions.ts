"use server";

import { redirect } from "next/navigation";

import { createClient } from "../utils/supabase/server";
import { apiFetch } from "./api";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function signup(formData: FormData) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("first-name") + " " + formData.get("last-name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });
}

export async function signupSocial(formData: FormData) {
  return apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/signup-social`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: formData.get("email"),
      provider: formData.get("provider"),
      accessToken: formData.get("accessToken"),
    }),
  });
}

export async function logoutAction() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signInWithGoogle() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect(data.url);
}

export async function forgotPassword({ email }: { email: string }) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/forgot-password",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const text = await res.text();

    if (!res.ok) {
      return { success: false, error: text };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function me() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    cache: "no-store", // always fetch fresh user data; can tweak for caching
  });

  return res.json();
}
