import type { ReactNode } from "react";

type AppShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AppShell({
  header,
  sidebar,
  children,
  footer,
}: AppShellProps) {
  return (
    <div className="h-dvh grid grid-rows-[auto_minmax(0,1fr)_auto] grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
      {/* Header */}
      <header className="md:col-span-2">{header}</header>

      {/* Sidebar */}
      <aside className="hidden md:block border-r border-white/5 bg-[#0f1322] overflow-y-auto">
        {sidebar}
      </aside>

      {/* Main — важливо: overflow-hidden + min-h-0 */}
      <main className="bg-[#0b0e17] overflow-hidden min-h-0 flex flex-col">
        {children}
      </main>

      {footer ? <footer className="md:col-span-2">{footer}</footer> : null}
    </div>
  );
}
