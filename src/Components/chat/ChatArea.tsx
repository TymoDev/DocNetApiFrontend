import WelcomeCard from "./WelcomeCard";
import MessageList from "./MessageList";
import type { ChatMessage } from "../types/chat";

type Props = {
  messages: ChatMessage[];
  error?: string | null;
  showAuthCTA?: boolean;
};

export default function ChatArea({ messages, error, showAuthCTA }: Props) {
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
