import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../layout/AppShell";
import TopBar from "../header/TopBar";
import ChatSidebar from "../sidebar/ChatSidebar";
import ChatArea from "../chat/ChatArea";
import Composer from "../composer/Composer";
import type { ChatMessage } from "../types/chat";
import { ask, askAnonymous } from "../../api/chat";
import { useUserState } from "../state/userState";
import { useChatMessages } from "../hooks/useChatMessages";
import { useQueryClient } from "@tanstack/react-query";
import { typewriter } from "../utilits/typewriter";

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function ChatPage() {
  const navigate = useNavigate();
  const { chatId: routeChatId } = useParams<{ chatId?: string }>();
  const { status } = useUserState();

  const queryClient = useQueryClient();
  const cancelTypingRef = useRef<(() => void) | null>(null);
  const animatingChatIdRef = useRef<string | null>(null);

  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [pending, setPending] = useState<ChatMessage[]>([]);

  const suspend = !!routeChatId && isTyping && animatingChatIdRef.current === routeChatId;
  const { data, isLoading, isFetching, error, append, seed } =
    useChatMessages(routeChatId, { suspend, page: 1, pageSize: 50 });

  const messages = useMemo<ChatMessage[]>(
    () => (routeChatId ? data ?? [] : pending),
    [routeChatId, data, pending]
  );

  useEffect(() => {
    return () => {
      cancelTypingRef.current?.();
      cancelTypingRef.current = null;
      animatingChatIdRef.current = null;
    };
  }, []);

  const updateAssistantContent = (targetChatId: string, msgId: string, content: string) => {
    queryClient.setQueriesData<ChatMessage[]>(
      { queryKey: ["chat", "messages", targetChatId, 1, 50] as const },
      (old) => (old ? old.map((m) => (m.id === msgId ? { ...m, content } : m)) : old)
    );
  };

  const updatePendingAssistantContent = (msgId: string, content: string) => {
    setPending((p) => p.map((m) => (m.id === msgId ? { ...m, content } : m)));
  };

  const onSend = async (text: string, files?: File[]) => {
    const trimmed = text.trim();
    if (!trimmed && (!files || files.length === 0)) return;

    cancelTypingRef.current?.();
    cancelTypingRef.current = null;
    setIsTyping(false);

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    if (!routeChatId) setPending((p) => [...p, userMsg]);
    else append(userMsg);

    setIsSending(true);
    try {
      const isAuth = status === "authenticated";
      const res = isAuth
        ? await ask({
            chatId: routeChatId ?? null,
            question: trimmed || null,
            attachments: files ?? null,
            filter: null,
          })
        : await askAnonymous({
            question: trimmed || null,
            filter: null,
          });

      if (isAuth && routeChatId && res.chatId !== routeChatId) {
        console.error("[Chat] ChatId mismatch", { url: routeChatId, response: res.chatId });
        return;
      }

      const assistantId = uid();
      const assistantBase: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        meta: {
          context: res.context,
          contextChars: res.contextChars,
          chunks: res.chunks,
        },
      };

      if (!isAuth) {
        setPending((prev) => [...prev, assistantBase]);
        setIsTyping(true);
        const { cancel, done } = typewriter(
          res.answer || "",
          (partial) => updatePendingAssistantContent(assistantId, partial),
          14
        );
        cancelTypingRef.current = cancel;
        await done;
        setIsTyping(false);
        return;
      }

      if (!routeChatId) {
        const targetId = res.chatId!;
        const initial = [...pending, userMsg, assistantBase];

        seed(initial, targetId);
        animatingChatIdRef.current = targetId;
        setIsTyping(true);
        const { cancel, done } = typewriter(
          res.answer || "",
          (partial) => updateAssistantContent(targetId, assistantId, partial),
          14
        );
        cancelTypingRef.current = cancel;

        navigate(`/chat/${targetId}`, { replace: true });

        await done;
        setIsTyping(false);
        animatingChatIdRef.current = null;
        queryClient.invalidateQueries({ queryKey: ["chat", "messages", targetId, 1, 50] as const });
        return;
      }

      append(assistantBase);
      animatingChatIdRef.current = routeChatId!;
      setIsTyping(true);
      const { cancel, done } = typewriter(
        res.answer || "",
        (partial) => updateAssistantContent(routeChatId!, assistantId, partial),
        14
      );
      cancelTypingRef.current = cancel;
      await done;
      setIsTyping(false);
      animatingChatIdRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["chat", "messages", routeChatId!, 1, 50] as const });
    } catch (e) {
      console.error(e);
      const sysMsg: ChatMessage = {
        id: uid(),
        role: "system",
        content: "Server error: unable to process your request.",
        createdAt: new Date().toISOString(),
      };
      if (!routeChatId) setPending((p) => [...p, sysMsg]);
      else append(sysMsg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppShell
      header={<TopBar showAuthCTA={status !== "authenticated"} />}
      sidebar={status === "authenticated" ? <ChatSidebar /> : null}
    >
      <div className="h-full min-h-0 flex flex-col">
        <ChatArea
          messages={messages}
          error={error ? "Failed to load messages." : null}
          showAuthCTA={status !== "authenticated"}
          isWaiting={isSending && !isTyping}
        />
        <div className="px-4 md:px-8 pb-1 text-[11px] text-neutral-500">
          {routeChatId ? (isFetching ? "Syncing…" : isLoading ? "Loading…" : "") : "New chat"}
        </div>
        <Composer onSend={onSend} isSending={isSending || isTyping} />
      </div>
    </AppShell>
  );
}
