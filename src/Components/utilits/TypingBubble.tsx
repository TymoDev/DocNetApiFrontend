export default function TypingBubble() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-2 w-fit max-w-[80%] md:max-w-[70%] rounded-2xl px-3 py-2 bg-white/5 text-neutral-100">
        <span className="text-[11px] text-neutral-300">Assistant is typing</span>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300/80 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300/80 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300/80 animate-bounce" />
        </div>
      </div>
    </div>
  );
}
