import { createContext, useContext, useMemo, useState } from "react";

export type AuthStatus = "guest" | "authenticated" | "unknown";

type Ctx = {
  status: AuthStatus;
  setStatus: (s: AuthStatus) => void;
};

const UserStateContext = createContext<Ctx | null>(null);

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("guest");
  const value = useMemo(() => ({ status, setStatus }), [status]);
  return <UserStateContext.Provider value={value}>{children}</UserStateContext.Provider>;
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx) throw new Error("useUserState must be used within <UserStateProvider>");
  return ctx;
}
