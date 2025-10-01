import type { ChatMessage } from "../types/chat";

type Props = { message: ChatMessage };

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={[
          "msg-text inline-block w-fit max-w-[80%] md:max-w-[70%]",
          "rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white/5 border border-white/10 text-neutral-100",
        ].join(" ")}
        aria-label={isUser ? "User message" : "Assistant message"}
      >
        {message.content}
      </div>
    </div>
  );
}
