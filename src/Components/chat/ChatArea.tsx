import WelcomeCard from "./WelcomeCard";
import MessageList from "./MessageList";
import TypingBubble from "../utilits/TypingBubble";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types/chat";

type Props = {
  messages: ChatMessage[];
  error?: string | null;
  showAuthCTA?: boolean;
  isWaiting?: boolean;
};

export default function ChatArea({
  messages,
  error,
  showAuthCTA,
  isWaiting = false,
}: Props) {
  const typingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isWaiting) typingRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isWaiting]);

  return (
    <div className="h-full min-h-0 w-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 md:px-8 py-6">
        {messages.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <WelcomeCard showAuthCTA={showAuthCTA} />
          </div>
        ) : (
          <MessageList messages={messages} />
        )}

        {isWaiting && (
          <div className="max-w-3xl mx-auto mt-2">
            <TypingBubble />
            <div ref={typingRef} />
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto mt-4">
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
