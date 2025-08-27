import { Plus, Trash2 } from "lucide-react";
import type { ChatSummary } from "../types/chat";

const MOCK: ChatSummary[] = [
  { id: "1", title: "New Chat", createdAt: "2025-08-27T09:00:00Z" },
];

export default function ChatSidebar() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium border border-white/10 bg-indigo-500/15 hover:bg-indigo-500/25">
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      <div className="px-2 pb-2 overflow-y-auto flex-1">
        <div className="px-2 text-xs uppercase tracking-wide text-neutral-400 mb-2">
          Chat History
        </div>
        <ul className="space-y-1">
          {MOCK.map((c) => (
            <li key={c.id}>
              <button
                className="group w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left hover:bg-white/5"
                aria-current="page">
                <div className="min-w-0">
                  <div className="truncate text-sm">{c.title}</div>
                  <div className="text-xs text-neutral-400">
                    No messages yet
                  </div>
                </div>
                <Trash2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 text-xs text-neutral-400 border-t border-white/5">
        © {new Date().getFullYear()} GLP
      </div>
    </div>
  );
}
