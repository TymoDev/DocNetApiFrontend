import { http } from "./client";
import type {
  ChatId,
  ChatListItem,
  ChatListItemWire,
  ChatPatchRequest,
} from "../Components/types/chat";

function normalizeChatItem(w: ChatListItemWire | undefined): ChatListItem {
  if (!w) {
    return {
      id: "",
      title: null,
      lastMessageAt: null,
      lastMessagePreview: null,
    };
  }

  const id = ("id" in w && w.id) || ("Id" in w && (w as any).Id) || "";

  const title =
    ("title" in w ? (w as any).title : undefined) ??
    ("Title" in w ? (w as any).Title : null) ??
    null;

  const rawDate =
    ("lastMessageAt" in w ? (w as any).lastMessageAt : undefined) ??
    ("LastMessageAt" in w ? (w as any).LastMessageAt : null) ??
    null;

  const lastMessageAt =
    rawDate == null
      ? null
      : typeof rawDate === "string"
      ? rawDate
      : (rawDate as Date).toISOString();

  const lastMessagePreview =
    ("lastMessagePreview" in w ? (w as any).lastMessagePreview : undefined) ??
    ("LastMessagePreview" in w ? (w as any).LastMessagePreview : null) ??
    null;

  return { id, title, lastMessageAt, lastMessagePreview };
}

export async function renameChat(
  id: ChatId,
  title: string
): Promise<ChatListItem> {
  const payload: ChatPatchRequest = { title };
  const res = await http.patch<ChatListItemWire>(
    `/api/chats/${encodeURIComponent(id)}`,
    payload
  );

  return (
    normalizeChatItem(res.data) || {
      id,
      title,
      lastMessageAt: null,
      lastMessagePreview: null,
    }
  );
}

export async function deleteChat(id: ChatId): Promise<void> {
  await http.delete(`/api/chats/${encodeURIComponent(id)}`);
}
