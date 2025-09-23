import { http } from "./client";
import type { ChatListItem } from "../Components/types/chat";

type Wire = {
  Id?: string; id?: string;
  Title?: string | null; title?: string | null;
  LastMessageAt?: string | null; lastMessageAt?: string | null | Date;
  LastMessagePreview?: string | null; lastMessagePreview?: string | null;
};


function extract(payload: any): Wire[] {
  if (Array.isArray(payload)) return payload as Wire[];
  if (Array.isArray(payload?.items)) return payload.items as Wire[];
  if (Array.isArray(payload?.data?.items)) return payload.data.items as Wire[];
  return [];
}

function normalize(w: Wire): ChatListItem {
  const id = (w.id ?? w.Id)!;
  const title = w.title ?? w.Title ?? null;
  const lastMessageAt = (w.lastMessageAt ?? w.LastMessageAt)?.toString() ?? null;
  const lastMessagePreview = w.lastMessagePreview ?? w.LastMessagePreview ?? null;
  return { id, title, lastMessageAt, lastMessagePreview };
}


const CHAT_LIST_ENDPOINT = "/api/chats";

export async function fetchChatList(page = 1, pageSize = 50): Promise<ChatListItem[]> {
  const res = await http.get(CHAT_LIST_ENDPOINT, { params: { page, pageSize } });
  return extract(res.data).map(normalize);
}
