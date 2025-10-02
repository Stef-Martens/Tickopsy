"use client";

import { createClient } from "@/utils/supabase/client";
import { createContext, useContext } from "react";

type Session = {
  user: any;
  account: any;
};

type SessionContextType = {
  user: any;
  account: any;
  logout: () => Promise<void>;
};

// Context now has session + logout
const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login"; // redirect after logout
  };

  return (
    <SessionContext.Provider
      value={{ user: session.user, account: session.account, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
