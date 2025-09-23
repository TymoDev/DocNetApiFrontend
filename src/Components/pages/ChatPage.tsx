import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../layout/AppShell";
import TopBar from "../header/TopBar";
import ChatSidebar from "../sidebar/ChatSidebar";
import ChatArea from "../chat/ChatArea";
import Composer from "../composer/Composer";
import type { ChatMessage } from "../types/chat";
import { ask } from "../../api/chat";
import { useUserState } from "../state/userState";
import { useChatMessages } from "../hooks/useChatMessages";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatId: routeChatId } = useParams<{ chatId?: string }>();
  const { status } = useUserState();


  const [pending, setPending] = useState<ChatMessage[]>([]);

  const { data, isLoading, isFetching, error, append, seed } = useChatMessages(routeChatId);
  const messages = useMemo<ChatMessage[]>(
    () => (routeChatId ? (data ?? []) : pending),
    [routeChatId, data, pending]
  );

  const onSend = async (text: string, files?: File[]) => {
    const trimmed = text.trim();
    if (!trimmed && (!files || files.length === 0)) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    if (!routeChatId) setPending((p) => [...p, userMsg]); else append(userMsg);

    try {
      const res = await ask({
        chatId: routeChatId ?? null,     // якщо нема id — бек створить чат
        question: trimmed || null,
        attachments: files ?? null,
        filter: null,
      });

      if (routeChatId && res.chatId !== routeChatId) {
        console.error("[Chat] ChatId mismatch", { url: routeChatId, response: res.chatId });

        return;
      }

      if (!routeChatId) {
        const seeded = [...pending, userMsg];
        navigate(`/chat/${res.chatId}`, { replace: true });
        seed(seeded, res.chatId);
        setPending([]); 
      }

      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: res.answer || "(empty response)",
        createdAt: new Date().toISOString(),
        meta: {
          context: res.context,
          contextChars: res.contextChars,
          chunks: res.chunks,
        },
      };


      const targetId = routeChatId ?? res.chatId;
      if (targetId === routeChatId) append(assistantMsg);
      else seed([...(data ?? []), ...(pending.length ? pending : []), assistantMsg], targetId);

    } catch (e) {
      console.error(e);
      const sysMsg: ChatMessage = {
        id: uid(),
        role: "system",
        content: "Server error: unable to process your request.",
        createdAt: new Date().toISOString(),
      };
      if (!routeChatId) setPending((p) => [...p, sysMsg]); else append(sysMsg);
    }
  };

  return (
    <AppShell header={<TopBar showAuthCTA={status !== "authenticated"} />} sidebar={<ChatSidebar />}>
      <div className="h-full min-h-0 flex flex-col">
        <ChatArea
          messages={messages}
          error={error ? "Failed to load messages." : null}
          showAuthCTA={status !== "authenticated"}
        />
        <div className="px-4 md:px-8 pb-1 text-[11px] text-neutral-500">
          {routeChatId ? (isFetching ? "Syncing…" : isLoading ? "Loading…" : "") : "New chat"}
        </div>
        <Composer onSend={onSend} isSending={false} />
      </div>
    </AppShell>
  );
}
