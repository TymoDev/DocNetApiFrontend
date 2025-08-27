import { Brain, ChevronDown, Settings } from "lucide-react";

export default function TopBar() {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/5 bg-[#0f1322]/80 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-indigo-500/10">
          <Brain className="w-5 h-5" />
        </div>
        <span className="font-semibold">AI Chat</span>
      </div>

      {/* модель (макет, без логіки) */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border border-white/10 bg-white/5 hover:bg-white/10"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        GPT 4.0 <ChevronDown className="w-4 h-4" />
      </button>

      <button
        type="button"
        className="inline-flex items-center rounded-lg p-2 border border-white/10 bg-white/5 hover:bg-white/10"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
}
