import { Mic, Paperclip, Send, Sparkles } from "lucide-react";
import { useState } from "react";

type Props = {
  onSend: (text: string) => void;
  isSending?: boolean;
};

export default function Composer({ onSend, isSending }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text || isSending) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-white/5 bg-[#0f1322]/80 backdrop-blur px-4 md:px-8 py-3">
      <div className="max-w-3xl mx-auto">
        <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <button
            type="button"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
            aria-label="Attach file"
            disabled={isSending}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <div className="rounded-2xl border border-white/10 bg-white/5 focus-within:bg-white/10">
              <textarea
                id="chat-input"
                className="w-full resize-none bg-transparent outline-none px-4 py-3 text-sm"
                rows={1}
                placeholder="Type your message here..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={isSending}
              />
            </div>
            <div className="mt-1 text-[11px] text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Press Enter to send • Shift+Enter — new line
            </div>
          </div>

          <button
            type="button"
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50"
            aria-label="Voice input"
            disabled={isSending}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white inline-flex items-center gap-2 disabled:opacity-50"
            aria-label="Send message"
            disabled={isSending}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
