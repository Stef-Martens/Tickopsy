// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import { me } from "@/lib/auth-actions";
import { SessionProvider } from "@/providers/session-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userInfo = null;

  try {
    userInfo = await me();
    if (!userInfo) {
      redirect("/login");
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
    redirect("/login");
  }

  const sessionData = {
    user: userInfo.user,
    account: userInfo.account,
  };

  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
}
