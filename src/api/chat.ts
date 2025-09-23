import { http } from "./client";

export type AskChunkWire =
  | { text: string; score: number; metadata: Record<string, string> }
  | { Text: string; Score: number; Metadata: Record<string, string> };

export type AskResponseWire = {
  chatId: string; // ← нове поле з беку
  question: string;
  answer: string;
  context: string;
  contextChars: number;
  chunks: AskChunkWire[];
};

export type AskResponse = {
  chatId: string; // ← канонічно в UI
  question: string;
  answer: string;
  context: string;
  contextChars: number;
  chunks: { text: string; score: number; metadata: Record<string, string> }[];
};

const ASK_ENDPOINT = "/api/ask";

function normalize(res: AskResponseWire): AskResponse {
  return {
    chatId: (res as any).chatId ?? (res as any).ChatId, // на всякий випадок
    question: res.question,
    answer: res.answer,
    context: res.context,
    contextChars: res.contextChars,
    chunks: (res.chunks ?? []).map((c: AskChunkWire) => ({
      text: "text" in c ? c.text : (c as any).Text,
      score: "score" in c ? c.score : (c as any).Score,
      metadata: "metadata" in c ? c.metadata : (c as any).Metadata,
    })),
  };
}


export type AskRequest = {
  chatId?: string | null;
  question?: string | null;
  filter?: Record<string, string> | null;
  attachments?: File[] | null;
};

export async function ask({
  chatId,
  question = null,
  filter = null,
  attachments = null,
}: AskRequest): Promise<AskResponse> {
  const form = new FormData();

  if (chatId) form.append("ChatId", chatId);
  if (question !== null && question !== undefined)
    form.append("Question", question);

  if (filter) {
    for (const [k, v] of Object.entries(filter)) {
      form.append(`Filter[${k}]`, v);
    }
  }

  if (attachments) {
    for (const f of attachments) {
      form.append("Attachments", f);
    }
  }

  const res = await http.post<AskResponseWire>(ASK_ENDPOINT, form);
  return normalize(res.data);
}
