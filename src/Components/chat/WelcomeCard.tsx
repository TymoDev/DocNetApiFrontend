import { Bot, History, Moon } from "lucide-react";

export default function WelcomeCard() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20">
          <Bot className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold text-center">Welcome to AI Chat</h1>
        <p className="mt-2 text-center text-sm text-neutral-400">
          Start chatting instantly — no login required. This app uses available AI models with smart fallback.
        </p>

        <ul className="mt-6 space-y-3">
          <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <History className="w-5 h-5 shrink-0" />
            <span className="text-sm">Chat history saved locally</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <Moon className="w-5 h-5 shrink-0" />
            <span className="text-sm">Dark and light themes</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
