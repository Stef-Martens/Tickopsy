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
    console.log("User info fetched successfully:", userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
  }

  const sessionData = {
    user: userInfo?.user || null,
    account: userInfo?.account || null,
  };

  return <SessionProvider session={sessionData}>{children}</SessionProvider>;
}
