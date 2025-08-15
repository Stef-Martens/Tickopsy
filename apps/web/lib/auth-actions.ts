"use server";

import { redirect } from "next/navigation";

import { createClient } from "../utils/supabase/server";

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    console.log("Attempting login for:", email);
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Login failed:", data.error || "Unknown error");
      return { success: false, error: data.error || "Login failed" };
    }

    console.log("Login successful for:", email);
    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function signup(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: formData.get("first-name") + " " + formData.get("last-name"),
      email: formData.get("email"),
      password: formData.get("password"),
    }),
  });

  const data = await res.json();
  return { success: res.ok, error: data.error };
}

export async function signout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    redirect("/error");
  }

  redirect("/logout");
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
