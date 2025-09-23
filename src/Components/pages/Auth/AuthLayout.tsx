import type { ReactNode } from "react";


export default function AuthLayout({ children }: { children: ReactNode }) {
return (
<div className="min-h-dvh grid md:grid-cols-2">
{/* Left visual panel (hidden on mobile) */}
<div className="hidden md:flex bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white p-10">
<div className="m-auto max-w-md space-y-4">
<div className="text-3xl font-semibold tracking-tight">GLP Chatbot</div>
<p className="text-white/90">
Secure login to sync your chats and continue where you left off.
</p>
<ul className="space-y-2 text-sm text-white/80">
<li className="flex items-center gap-2"><span className="i">•</span> Dark, focused UI</li>
<li className="flex items-center gap-2"><span className="i">•</span> Your chats, organized</li>
<li className="flex items-center gap-2"><span className="i">•</span> Powered by GLP RAG</li>
</ul>
</div>
</div>


{/* Right form panel */}
<div className="flex items-center justify-center p-6 md:p-10 bg-[#0b0e17]">
<div className="w-full max-w-md">
<div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl">
{children}
</div>
<p className="mt-4 text-center text-xs text-neutral-400">
By continuing you agree to our Terms & Privacy.
</p>
</div>
</div>
</div>
);
}