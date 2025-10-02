"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login/login-form";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut();
  }, []);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Tickopsy
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
