"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { signup } from "@/lib/api/auth-actions";

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

      const { user_metadata, email } = session.user;
      const name =
        user_metadata?.full_name ||
        `${user_metadata?.first_name ?? ""} ${user_metadata?.last_name ?? ""}`.trim() ||
        (email ? email.split("@")[0] : "User");

      const formData = new FormData();
      formData.append("name", name);

      const result = await signup(formData, session.access_token);
      if (!result.success) {
        router.push("/error");
        return;
      }

      router.push("/dashboard");
    }

    handleOAuth();
  }, [router]);

  return <p>Signing you in...</p>;
}
