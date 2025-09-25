import type { ReactNode } from "react";

type AppShellProps = {
  header: ReactNode;
  sidebar?: ReactNode | null; //
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

  return (
    <div
      className={
        hasSidebar
          ? "h-dvh grid grid-rows-[auto_minmax(0,1fr)_auto] grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]"
          : "h-dvh grid grid-rows-[auto_minmax(0,1fr)_auto] grid-cols-1"
      }
    >
      {/* Header */}
      <header className={hasSidebar ? "md:col-span-2" : undefined}>{header}</header>

      {/* Sidebar */}
      {hasSidebar ? (
        <aside className="hidden md:block border-r border-white/5 bg-[#0f1322] overflow-y-auto">
          {sidebar}
        </aside>
      ) : null}

      {/* Main */}
      <main className="bg-[#0b0e17] overflow-hidden min-h-0 flex flex-col">
        {children}
      </main>

      {footer ? (
        <footer className={hasSidebar ? "md:col-span-2" : undefined}>{footer}</footer>
      ) : null}
    </div>
  );
}
