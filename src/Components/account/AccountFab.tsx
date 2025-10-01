import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";
import { useUserState } from "../state/userState";

export default function AccountFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setGuest } = useUserState();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setGuest();
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div ref={ref} className="fixed left-4 bottom-4 z-50 select-none">
      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-10 w-10 rounded-full bg-violet-600 hover:bg-violet-500 active:scale-95 transition text-white grid place-items-center shadow-lg shadow-violet-600/30 border border-white/10"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" fill="currentColor"/>
          <path d="M3 21a9 9 0 0 1 18 0" fill="currentColor"/>
        </svg>
      </button>

      {/* MENU */}
      {open && (
        <div role="menu" className="mt-2 w-56 rounded-xl border border-white/10 bg-[#0b0e17]/95 backdrop-blur shadow-xl shadow-black/40 overflow-hidden">
          <MenuItem onClick={() => { setOpen(false); navigate("/settings"); }}>
            <IconGear /> <span>Налаштування</span>
          </MenuItem>
          <MenuItem onClick={() => { setOpen(false); navigate("/personalization"); }}>
            <IconSpark /> <span>Персоналізація</span>
          </MenuItem>
          <div className="h-px bg-white/10 my-1" />
          <MenuItem onClick={handleLogout} danger>
            <IconLogout /> <span>Вийти</span>
          </MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick?: () => void; danger?: boolean; }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-white/10 transition ${
        danger ? "text-red-300 hover:text-red-200" : "text-neutral-200"
      }`}
      role="menuitem"
    >
      {children}
    </button>
  );
}

function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor">
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 4a7.6 7.6 0 0 0-.12-1l2-1.55-2-3.46-2.42 1a7.7 7.7 0 0 0-1.73-1L14.5 2h-5L8.27 5a7.7 7.7 0 0 0-1.73 1l-2.42-1-2 3.46L4.12 11a7.6 7.6 0 0 0 0 2l-2 1.55 2 3.46 2.42-1c.53.41 1.11.76 1.73 1L9.5 22h5l1.23-3a7.7 7.7 0 0 0 1.73-1l2.42 1 2-3.46L20.88 13c.08-.33.12-.66.12-1Z"/>
    </svg>
  );
}
function IconSpark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor">
      <path d="M12 2 9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2Z"/>
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90" fill="currentColor">
      <path d="M14 7v-2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M9 12h11l-3-3m3 3-3 3"/>
    </svg>
  );
}
