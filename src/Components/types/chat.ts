export type ChatSummary = {
  id: string;
  title: string;
  createdAt: string; // ISO
};

export type MessageChunk = {
  text: string;
  score: number;
  metadata: Record<string, string>;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  meta?: {
    context?: string;
    contextChars?: number;
    chunks?: MessageChunk[];
  };
};
export type ChatListItem = {
  id: string;
  title?: string | null;
  lastMessageAt?: string | null;
  lastMessagePreview?: string | null;
};

export type ChatListItemWire =
  | {
      id?: string;
      title?: string | null;
      lastMessageAt?: string | Date | null;
      lastMessagePreview?: string | null;
    }
  | {
      Id?: string;
      Title?: string | null;
      LastMessageAt?: string | Date | null;
      LastMessagePreview?: string | null;
    };

export type ChatPatchRequest = {
  title: string;
};
export type ChatId = string;
