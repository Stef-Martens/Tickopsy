"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/api/auth-actions";
import { Button } from "./ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const res = await logoutAction();
    if (res.success) {
      router.push("/login"); // or redirect to homepage
    }
  }

  return <Button onClick={handleLogout}>Logout</Button>;
}
