"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { apiFetch } from "@/lib/api/api";
import { signup } from "@/lib/auth-actions";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleOAuth() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/error");
        return;
      }

      // Get Google profile info from Supabase session
      const { email, user_metadata } = session.user;
      const name =
        user_metadata?.full_name ??
        `${user_metadata?.first_name ?? ""} ${user_metadata?.last_name ?? ""}`;

      const formData = new FormData();
      formData.append("email", email);
      formData.append("name", name);
      formData.append("provider", "google");
      formData.append("accessToken", session.access_token);

      await signup(formData);

      // Now user is guaranteed to exist in backend
      router.push("/dashboard");
    }

    handleOAuth();
  }, [router]);

  return <p>Signing you in...</p>;
}
