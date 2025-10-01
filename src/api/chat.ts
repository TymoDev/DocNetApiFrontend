import { http } from "./client";

export type AskChunkWire =
  | { text: string; score: number; metadata: Record<string, string> }
  | { Text: string; Score: number; Metadata: Record<string, string> };

export type AskResponseWire = {
  chatId: string; 
  question: string;
  answer: string;
  context: string;
  contextChars: number;
  chunks: AskChunkWire[];
};

export type AskResponse = {
  chatId: string | null; 
  question: string;
  answer: string;
  context: string;
  contextChars: number;
  chunks: { text: string; score: number; metadata: Record<string, string> }[];
};

const ASK_ENDPOINT = "/api/ask";

function normalize(res: AskResponseWire): AskResponse {
  return {
    chatId: (res as any).chatId ?? (res as any).ChatId, 
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

export type AskAnonymousRequest = {
  question?: string | null;
  filter?: Record<string, string> | null;
};

export async function askAnonymous({
  question = null,
  filter = null,
}: AskAnonymousRequest): Promise<AskResponse> {
  const form = new FormData();
  if (question) form.append("Question", question);
  if (filter) for (const [k, v] of Object.entries(filter)) form.append(`Filter[${k}]`, v);

  const res = await http.post<any>("/api/ask/anonymous", form);

  return {
    chatId: null,                                  
    question: res.data.question,
    answer: res.data.answer,
    context: res.data.composedContext,              
    contextChars: res.data.totalChars,              
    chunks: (res.data.values ?? []).map((c: any) => ({
      text: c.text,
      score: c.score,
      metadata: c.metadata,
    })),
  };
}