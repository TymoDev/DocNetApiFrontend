import { http } from "./client";

export type AskRequest = {
  question: string;
  filter?: Record<string, string> | null;
};

export type AskChunkWire =
  | { text: string; score: number; metadata: Record<string, string> }
  | { Text: string; Score: number; Metadata: Record<string, string> }; // на випадок PascalCase

export type AskResponseWire = {
  question: string;
  answer: string;
  context: string; // = ctx.ComposedContext
  contextChars: number; // = ctx.TotalChars
  chunks: AskChunkWire[]; // = ctx.Chunks.Select(...)
};

// Канонічний тип для UI
export type AskResponse = {
  question: string;
  answer: string;
  context: string;
  contextChars: number;
  chunks: { text: string; score: number; metadata: Record<string, string> }[];
};

const ASK_ENDPOINT = "/api/ask";

function normalize(res: AskResponseWire): AskResponse {
  return {
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

export async function ask(
  question: string,
  filter?: Record<string, string>
): Promise<AskResponse> {
  const payload: AskRequest = { question, filter };
  const res = await http.post<AskResponseWire>(ASK_ENDPOINT, payload);
  return normalize(res.data);
}
