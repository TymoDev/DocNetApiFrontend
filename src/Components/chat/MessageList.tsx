import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import MessageBubble from "./MessageBubble";

type Props = { messages: ChatMessage[] };

export default function MessageList({ messages }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="max-w-3xl mx-auto">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
