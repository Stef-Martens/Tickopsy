"use client";

import { createContext, useContext } from "react";

// import { User, Account } from "@prisma/client";

// type Session = {
//   user: User;
//   account: Account | null;
// };

type Session = {
  user: any;
  account: any;
};

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
