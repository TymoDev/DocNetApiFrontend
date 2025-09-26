import { createContext, useContext, useMemo, useState, useCallback } from "react";

export type AuthStatus = "unknown" | "authenticated" | "guest";

type Ctx = {
  status: AuthStatus;
  setStatus: (s: AuthStatus) => void;
  setAuthenticated: () => void; 
  setGuest: () => void;         
};

const UserStateContext = createContext<Ctx | null>(null);

export function UserStateProvider({
  children,
  initialStatus = "unknown", // починаємо як невідомо, щоб зробити перевірку сесії
}: {
  children: React.ReactNode;
  initialStatus?: AuthStatus;
}) {
  const [status, setStatus] = useState<AuthStatus>(initialStatus);

  const setAuthenticated = useCallback(() => setStatus("authenticated"), []);
  const setGuest = useCallback(() => setStatus("guest"), []);

  const value = useMemo(
    () => ({ status, setStatus, setAuthenticated, setGuest }),
    [status, setStatus, setAuthenticated, setGuest]
  );

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx) throw new Error("useUserState must be used within <UserStateProvider>");
  return ctx;
}
