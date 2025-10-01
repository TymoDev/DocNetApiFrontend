// src/Components/layout/AppShell.tsx
import type { ReactNode } from "react";
import { useUserState } from "../state/userState";
import AccountFab from "../account/AccountFab";

type AppShellProps = {
  header: ReactNode;
  sidebar?: ReactNode | null;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AppShell({
  header,
  sidebar,
  children,
  footer,
}: AppShellProps) {
  const hasSidebar = !!sidebar;
  const { status } = useUserState();

  return (
    <div
      className={
        hasSidebar
          ? "h-dvh grid grid-rows-[auto_minmax(0,1fr)_auto] grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]"
          : "h-dvh grid grid-rows-[auto_minmax(0,1fr)_auto] grid-cols-1"
      }>
      <header className={hasSidebar ? "md:col-span-2" : undefined}>
        {header}
      </header>

      {hasSidebar ? (
        <aside className="hidden md:block border-r border-white/5 bg-[#0f1322] overflow-y-auto">
          {sidebar}
        </aside>
      ) : null}

      <main className="bg-[#0b0e17] overflow-hidden min-h-0 flex flex-col">
        {children}
      </main>

      {footer ? (
        <footer className={hasSidebar ? "md:col-span-2" : undefined}>
          {footer}
        </footer>
      ) : null}

      {status === "authenticated" && <AccountFab />}
    </div>
  );
}
