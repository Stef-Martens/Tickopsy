// app/dashboard/page.tsx
"use client";

import { useSession } from "@/providers/session-provider";
import { LogoutButton } from "@/components/logout-button";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, account } = useSession();

  if (!account || !account.hasAccess) {
    redirect("/get-started");
  }

  return (
    <>
      <h1>Welcome, {user.email}</h1>
      <p>Account Status: {account.hasAccess ? "Active" : "Inactive"}</p>
      <LogoutButton />
    </>
  );
}
