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
