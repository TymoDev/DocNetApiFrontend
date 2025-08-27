import { useState } from "react";
import AppShell from "../layout/AppShell";
import TopBar from "../header/TopBar";
import ChatSidebar from "../sidebar/ChatSidebar";
import ChatArea from "../chat/ChatArea";
import Composer from "../composer/Composer";
import type { ChatMessage } from "../types/chat";
import { ask } from "../../api/chat";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSend = async (text: string) => {
    setError(null);

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    try {
      const res = await ask(text); // ← ТЕПЕР об'єкт
      const assistantMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: res.answer || "(empty response)", // ← беремо рядок з поля answer
        createdAt: new Date().toISOString(),
        meta: {
          context: res.context,
          contextChars: res.contextChars,
          chunks: res.chunks,
        },
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setError(
        "Server error: unable to process your request. Please try again."
      );
      const sysMsg: ChatMessage = {
        id: uid(),
        role: "system",
        content: "An error occurred while contacting the server.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, sysMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppShell header={<TopBar />} sidebar={<ChatSidebar />}>
      <div className="h-full min-h-0 flex flex-col">
        <ChatArea messages={messages} error={error} />
        <Composer onSend={onSend} isSending={isSending} />
      </div>
    </AppShell>
  );
}
