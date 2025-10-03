import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatList } from "../hooks/useChatList";
import { useUserState } from "../state/userState";
import ChatItemMenu from "./ChatItemMenu";
import { renameChat, deleteChat } from "../../api/updateChat";
import type { ChatListItem } from "../types/chat";

function fmtDate(iso?: string | number | Date | null) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

type Snapshot = Array<[readonly unknown[], unknown]>;

function patchChatsCache(
  qc: ReturnType<typeof useQueryClient>,
  updater: (list: ChatListItem[]) => ChatListItem[]
): Snapshot {
  const snaps = qc.getQueriesData({ queryKey: ["chats"] }) as Snapshot;
  snaps.forEach(([qk, prev]) => {
    if (Array.isArray(prev)) {
      qc.setQueryData<ChatListItem[]>(qk, updater(prev as ChatListItem[]));
    } else if (
      prev &&
      typeof prev === "object" &&
      Array.isArray((prev as any).items)
    ) {
      const obj = prev as { items: ChatListItem[]; [k: string]: any };
      qc.setQueryData(qk, { ...obj, items: updater(obj.items) });
    }
  });
  return snaps;
}

function restoreChatsCache(
  qc: ReturnType<typeof useQueryClient>,
  snaps: Snapshot | undefined
) {
  snaps?.forEach(([qk, prev]) => qc.setQueryData(qk, prev));
}

export default function ChatSidebar() {
  const navigate = useNavigate();
  const { chatId } = useParams<{ chatId?: string }>();
  const { status } = useUserState();
  const qc = useQueryClient();

  if (status !== "authenticated") return null;

  const { data, isPending, isFetching, error } = useChatList(1, 50);
  const [menuFor, setMenuFor] = useState<string | null>(null);

  const renameMut = useMutation<
    ChatListItem,
    Error,
    { id: string; title: string },
    { snaps: Snapshot }
  >({
    mutationFn: ({ id, title }) => renameChat(id, title),
    onMutate: async ({ id, title }) => {
      await qc.cancelQueries({ queryKey: ["chats"] });
      const snaps = patchChatsCache(qc, (list) =>
        list.map((c) => (c.id === id ? { ...c, title } : c))
      );
      return { snaps };
    },
    onError: (_err, _vars, ctx) => {
      restoreChatsCache(qc, ctx?.snaps);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const deleteMut = useMutation<
    void,
    Error,
    string,
    { snaps: Snapshot; id: string }
  >({
    mutationFn: (id) => deleteChat(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["chats"] });
      const snaps = patchChatsCache(qc, (list) =>
        list.filter((c) => c.id !== id)
      );
      qc.removeQueries({ queryKey: ["chat", "messages", id] });
      return { snaps, id };
    },
    onError: (_err, _id, ctx) => {
      restoreChatsCache(qc, ctx?.snaps);
    },
    onSuccess: (_void, id) => {
      if (chatId === id) navigate("/chat");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const askRename = (c: ChatListItem) => {
    const current = c.title ?? "Untitled chat";
    const title = window.prompt("New name:", current)?.trim();
    if (!title || title === current) return;
    setMenuFor(null);
    renameMut.mutate({ id: c.id, title });
  };

  const askDelete = (c: ChatListItem) => {
    if (!window.confirm("Delete this chat? This action cannot be undone.")) return;
    setMenuFor(null);
    deleteMut.mutate(c.id);
  };

  return (
    <aside className="h-full w-[260px] shrink-0 border-r border-white/5 bg-[#0b0e17]">
      <div className="px-3 py-2 border-b border-white/5">
        <button
          className="w-full text-left text-sm rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10"
          onClick={() => navigate("/chat")}>
          + New Chat
        </button>
      </div>

      <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-48px)]">
        {isPending && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-lg bg-white/5 h-[54px]"
              />
            ))}
          </>
        )}

        {error && (
          <div className="text-xs text-red-300 p-2">Failed to load chats.</div>
        )}

        {data?.map((c) => {
          const active = chatId === c.id;
          return (
            <div key={c.id} className="relative group">
              <button
                aria-label="chat actions"
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMenuFor((x) => (x === c.id ? null : c.id));
                }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="text-neutral-300">
                  <circle cx="10" cy="4" r="1.8" />
                  <circle cx="10" cy="10" r="1.8" />
                  <circle cx="10" cy="16" r="1.8" />
                </svg>
              </button>

              <Link
                to={`/chat/${c.id}`}
                className={`block rounded-lg px-3 py-2.5 pr-8 hover:bg-white/10 ${
                  active ? "bg-white/10" : "bg-transparent"
                }`}>
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

              {menuFor === c.id && (
                <ChatItemMenu
                  onRename={() => askRename(c)}
                  onDelete={() => askDelete(c)}
                  onClose={() => setMenuFor(null)}
                />
              )}
            </div>
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
