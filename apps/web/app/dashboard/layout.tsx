import { redirect } from "next/navigation";
import { me } from "@/lib/api/auth-actions";
import { SessionProvider } from "@/providers/session-provider";
import { ThemeProviderDashboard } from "@/providers/theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userInfo = null;

  try {
    userInfo = await me();
    if (!userInfo.success) {
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

  return (
    <ThemeProviderDashboard>
      <SessionProvider session={sessionData}>{children}</SessionProvider>
    </ThemeProviderDashboard>
  );
}
