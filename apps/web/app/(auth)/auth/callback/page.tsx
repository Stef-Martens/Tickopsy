"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function OAuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function handleOAuth() {
      // After Google redirects, Supabase automatically stores the session in local storage/cookies
      // We can just read the session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        console.error(error);
        return;
      }
      // session exists now, redirect to dashboard
      router.replace("/dashboard");
    }

    handleOAuth();
  }, [router, supabase]);

  return <p>Logging you in...</p>;
}
