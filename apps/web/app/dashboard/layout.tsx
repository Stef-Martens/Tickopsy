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

  console.log("User info fetched successfully:", userInfo);

  const sessionData = {
    user: userInfo.data.user,
    account: userInfo.data.account,
  };

  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
}
