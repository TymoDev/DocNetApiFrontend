GLP Chat — Frontend

Minimal chat UI for a .NET (RAG) backend.
Stack: React 19, TypeScript, Vite, Tailwind, TanStack Query 5, React Router 7, axios, zustand, react-hook-form, zod, lucide-react.

What’s included
•Routes:
  /chat — new/guest chat (ephemeral, not persisted)
  /chat/:chatId — existing chat (history comes from the backend)
•Auth: cookie-based; the token is stored in cookies; axios sends it automatically (withCredentials).
•Guest mode: chat without login; history lives only in page state (not saved on backend).
•Chat UX: typewriter answer rendering, “Assistant is typing…” indicator, auto-scroll, input lock while sending/typing.
•Chats sidebar: visible only for authenticated users.
•Account FAB: top-right — Upgrade plan / Personalization / Settings / Logout.

Quick start

1.Install deps:
npm install
2.Create .env.development with:
VITE_API_URL=http://localhost:5119
3.Run:
npm run dev (app at http://localhost:5173)

API
All backend calls are encapsulated in src/api.

Project structure (short)
src/
├─ api/
│ ├─ client.ts (axios: baseURL from env, withCredentials)
│ ├─ chat.ts (ask / askAnonymous + normalization)
│ ├─ chatList.ts (chat list)
│ ├─ getChat.ts (chat messages)
│ └─ auth.ts (login / register / checkAuth / logout)
├─ Components/
│ ├─ Routes/AppRoutes.tsx
│ ├─ pages/ChatPage.tsx
│ ├─ layout/AppShell.tsx
│ ├─ header/TopBar.tsx
│ ├─ sidebar/ChatSidebar.tsx
│ ├─ composer/Composer.tsx
│ ├─ account/AccountFab.tsx
│ ├─ chat/
│ │ ├─ ChatArea.tsx
│ │ ├─ MessageList.tsx
│ │ ├─ MessageBubble.tsx
│ │ └─ WelcomeCard.tsx
│ ├─ hooks/
│ │ ├─ useChatList.ts
│ │ └─ useChatMessages.ts
│ ├─ utilits/
│ │ ├─ TypingBubble.tsx
│ │ └─ typewriter.ts
│ └─ state/userState.tsx
├─ main.tsx
├─ Root.tsx
├─ index.css
└─ App.tsx

Behavior
On /chat without chatId, the frontend sends ChatId=null, receives a new chatId, navigates to /chat/{chatId}, and seeds the cache to avoid flicker.
While awaiting a reply: show TypingBubble, lock Composer, render text gradually (typewriter), then unlock input.
In guest mode: messages render and persist only within the current session (no backend history).

Scripts
npm run dev
npm run build
npm run preview
