import { Link } from "react-router-dom";

export default function WelcomeCard({ showAuthCTA = false }: { showAuthCTA?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-xl">
      <div className="w-10 h-10 mx-auto rounded-xl bg-white/10 grid place-items-center mb-3">🤖</div>
      <h2 className="text-lg font-semibold">Welcome to AI Chat</h2>
      <p className="text-sm text-neutral-400 mt-1">
        Start chatting instantly — no login required. This app uses available AI models with smart fallback.
      </p>

      {showAuthCTA && (
        <div className="mt-5 flex items-center justify-center gap-3">
          <Link
            to="/auth/register"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            Register for free
          </Link>
          <Link
            to="/auth/login"
            className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10"
          >
            Log in
          </Link>
        </div>
      )}
    </div>
  );
}
