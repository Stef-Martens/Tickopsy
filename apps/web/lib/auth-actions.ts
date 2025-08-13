"use server";

import { revalidatePath } from "next/cache";
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
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || "Login failed" };
    }

    return { success: true, data };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}

export async function signup(formData: FormData) {
  const firstName = formData.get("first-name") as string;
  const lastName = formData.get("last-name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const res = await fetch("http://localhost:4000/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `${firstName} ${lastName}`,
      email,
      password,
      role: "user",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: text };
  }

  return { success: true };
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
