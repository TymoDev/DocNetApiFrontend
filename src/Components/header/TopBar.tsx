import { Link } from "react-router-dom";
import { useUserState } from "../state/userState";

type TopBarProps = {
  showAuthCTA?: boolean;
};

export default function TopBar({ showAuthCTA }: TopBarProps) {
  const { status } = useUserState();
  const show = showAuthCTA ?? status !== "authenticated";

  return (
    <div className="sticky top-0 z-40 border-b border-white/5 bg-[#0b0e17]/60 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 grid place-items-center text-white text-sm">🤖</div>
          <span className="font-semibold">GLP Chat</span>
        </div>

        {show && (
          <div className="flex items-center gap-2">
            <Link
              to="/auth/register"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
            >
              Register for free
            </Link>
            <Link
              to="/auth/login"
              className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/10 text-sm"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
