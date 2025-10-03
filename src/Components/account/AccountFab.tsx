// src/Components/account/AccountFab.tsx
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { logout } from "../../api/auth";

type Props = {};

function FabContent() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setOpen(false);
      qc.clear();
      navigate("/auth/login", { replace: true });
      setBusy(false);
    }
  };

  const Item = ({
    icon,
    label,
    danger,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick?: () => void;
  }) => (
    <button
      className={[
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
        danger
          ? "text-red-300 hover:bg-red-500/10"
          : "text-neutral-200 hover:bg-white/10",
      ].join(" ")}
      onClick={onClick}
      disabled={busy}>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 2147483647,
        pointerEvents: "auto",
      }}>
      <button
        aria-label="Profile"
        className="h-11 w-11 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl flex items-center justify-center border border-white/10 disabled:opacity-70"
        onClick={() => setOpen((v) => !v)}
        disabled={busy}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" fill="currentColor" />
          <path
            d="M20 21a8 8 0 0 0-16 0"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-12 right-0 w-64 rounded-xl border border-white/10 bg-[#0f1322] shadow-2xl p-2">
          <Item
            label="Upgrade plan"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 2l3 7h7l-5.5 4.2L19 21l-7-4.5L5 21l2.5-7.8L2 9h7l3-7z" />
              </svg>
            }
            onClick={() => setOpen(false)}
          />
          <Item
            label="Personalization"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 3a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9zm0 4a5 5 0 1 1-5 5 5.006 5.006 0 0 1 5-5z" />
              </svg>
            }
            onClick={() => setOpen(false)}
          />
          <Item
            label="Settings"
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M12 15a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8.94-3a7.89 7.89 0 0 0-.14-1.5l2.12-1.65-2-3.46-2.49.5a7.71 7.71 0 0 0-1.29-.75l-.38-2.53H9.24l-.38 2.53a7.71 7.71 0 0 0-1.29.75l-2.49-.5-2 3.46 2.12 1.65A7.89 7.89 0 0 0 4 12a7.89 7.89 0 0 0 .14 1.5L2 15.15l2 3.46 2.49-.5c.41.29.84.54 1.29.75l.38 2.53h5.52l.38-2.53c.45-.21.88-.46 1.29-.75l2.49.5 2-3.46-2.12-1.65c.1-.49.16-1 .16-1.5z" />
              </svg>
            }
            onClick={() => setOpen(false)}
          />

          <div className="my-2 h-px bg-white/10" />

          <Item
            label="Logout"
            danger
            onClick={handleLogout}
            icon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M10 17l1.41-1.41L8.83 13H21v-2H8.83l2.58-2.59L10 7l-5 5 5 5z" />
                <path d="M3 21h8v-2H5V5h6V3H3z" />
              </svg>
            }
          />
        </div>
      )}
    </div>
  );
}

export default function AccountFab(_props: Props) {
  return createPortal(<FabContent />, document.body);
}
