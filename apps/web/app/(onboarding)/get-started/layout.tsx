// app/(onboarding)/layout.tsx
import { me } from "@/lib/auth-actions";
import { SessionProvider } from "@/providers/session-provider";

export default async function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userInfo = null;

  try {
    userInfo = await me();
  } catch (error) {
    console.error("Error fetching user info:", error);
  }

  const sessionData = {
    user: userInfo?.data?.user || null,
    account: userInfo?.data?.account || null,
  };

  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
}
