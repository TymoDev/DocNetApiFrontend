import { useEffect, useRef } from "react";

type Props = {
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function ChatItemMenu({ onRename, onDelete, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-2 top-8 z-50 w-44 rounded-lg border border-white/10 bg-[#0f1322] shadow-lg"
    >
      <button
        className="w-full px-3 py-2 text-left text-sm hover:bg-white/10"
        onClick={() => { onRename(); onClose(); }}
      >
        Rename
      </button>
      <div className="mx-2 my-1 h-px bg-white/10" />
      <button
        className="w-full px-3 py-2 text-left text-sm text-red-300 hover:bg-red-500/10"
        onClick={() => { onDelete(); onClose(); }}
      >
        Delete
      </button>
    </div>
  );
}
