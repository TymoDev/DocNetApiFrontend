import { useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { fetchChatMessages } from "../../api/getChat";
import type { ChatMessage } from "../types/chat";

type Options = {
  page?: number;
  pageSize?: number;
  suspend?: boolean;
};

export function useChatMessages(chatId?: string, opts: Options = {}) {
  const qc = useQueryClient();
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 50;

  const key: QueryKey = ["chat", "messages", chatId, page, pageSize];

  const query = useQuery<ChatMessage[], Error>({
    queryKey: key,
    queryFn: () => fetchChatMessages(chatId!, page, pageSize),
    enabled: !!chatId && !opts.suspend,
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const append = (msg: ChatMessage) => {
    if (!chatId) return;
    qc.setQueryData<ChatMessage[]>(key, (old = []) => [...old, msg]);
  };

  const seed = (msgs: ChatMessage[], id: string) => {
    qc.setQueryData<ChatMessage[]>(
      ["chat", "messages", id, page, pageSize],
      msgs
    );
  };

  return { ...query, append, seed } as const;
}
