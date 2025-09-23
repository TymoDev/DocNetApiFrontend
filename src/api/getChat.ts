import { http } from "./client";
import type { ChatMessage } from "../Components/types/chat";

type AttachmentWire = Record<string, any>;

type MessageWire = {
  id?: string;
  chatId?: string;
  sender: string;
  content: string;
  createdAt: string | Date;
  attachments?: AttachmentWire[] | null;
};

function normalizeMessage(m: MessageWire): ChatMessage {
  const id = m.id as string;
  const roleRaw = m.sender.toString().toLowerCase();
  const role: "user" | "assistant" | "system" =
    roleRaw === "user" || roleRaw === "assistant" || roleRaw === "system"
      ? (roleRaw as any)
      : "assistant";

  const createdAt =
    typeof m.createdAt === "string"
      ? m.createdAt
      : (m.createdAt as Date)?.toISOString();

  return {
    id,
    role,
    content: m.content ?? "",
    createdAt: createdAt ?? new Date().toISOString(),
  };
}

export async function fetchChatMessages(
  chatId: string,
  page = 1,
  pageSize = 50
): Promise<ChatMessage[]> {
  const res = await http.get(
    `/api/chats/${encodeURIComponent(chatId)}/messages`,
    {
      params: { page, pageSize },
    }
  );

  const payload = res.data;
  const list: MessageWire[] = Array.isArray(payload)
    ? payload
    : (payload?.items as MessageWire[]) ?? [];

  return list.map(normalizeMessage);
}
