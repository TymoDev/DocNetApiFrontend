import { Link, useNavigate, useParams } from "react-router-dom";
import { useChatList } from "../hooks/useChatList";
import { useUserState } from "../state/userState";

function fmtDate(iso?: string | number | Date | null) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "";
  }
}

export default function ChatSidebar() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const { status } = useUserState();

 
  if (status !== "authenticated") return null;

  const { data, isPending, isFetching, error } = useChatList(1, 50);

  return (
    <aside className="h-full w-[260px] shrink-0 border-r border-white/5 bg-[#0b0e17]">
      <div className="px-3 py-2 border-b border-white/5">
        <button
          className="w-full text-left text-sm rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10"
          onClick={() => navigate("/chat")}
        >
          + New Chat
        </button>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-48px)]">
        {isPending && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white/5 h-[54px]" />
            ))}
          </>
        )}

        {error && <div className="text-xs text-red-300 p-2">Failed to load chats.</div>}

        {data?.map((c) => {
          const active = chatId === c.id;
          return (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className={`block rounded-lg px-3 py-2.5 hover:bg-white/10 ${
                active ? "bg-white/10" : "bg-transparent"
              }`}
            >
              <div className="text-sm font-medium truncate">
                {c.title || "Untitled chat"}
              </div>
              <div className="text-[11px] text-neutral-400 truncate">
                {c.lastMessagePreview || "—"}
              </div>
              <div className="text-[10px] text-neutral-500 mt-0.5">
                {fmtDate(c.lastMessageAt)}
              </div>
            </Link>
          );
        })}

        {data && data.length === 0 && !isPending && (
          <div className="text-xs text-neutral-400 p-2">No chats yet.</div>
        )}

        {isFetching && !isPending && (
          <div className="text-[11px] text-neutral-500 p-2">Syncing…</div>
        )}
      </div>
    </aside>
  );
}
