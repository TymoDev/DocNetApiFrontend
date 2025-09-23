import { useQuery } from "@tanstack/react-query";
import { fetchChatList } from "../../api/chatList";
import type { ChatListItem } from "../types/chat";

export function useChatList(page = 1, pageSize = 50) {
  return useQuery<ChatListItem[], Error>({
    queryKey: ["chats", page, pageSize],
    queryFn: () => fetchChatList(page, pageSize),
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
