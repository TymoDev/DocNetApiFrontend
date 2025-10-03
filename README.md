# GLP Chat — Frontend

Minimal chat UI for a .NET (RAG) backend.  
Stack: React 19, TypeScript, Vite, Tailwind, TanStack Query 5, React Router 7, axios, zustand, react-hook-form, zod, lucide-react.

## What’s included

### Routes
- `/chat` — new/guest chat (ephemeral, not persisted)  
- `/chat/:chatId` — existing chat (history comes from the backend)

### Auth
- Cookie-based; the token is stored in cookies; axios sends it automatically (`withCredentials`).

### Guest mode
- Chat without login; history lives only in page state (not saved on backend).

### Chat UX
- Typewriter answer rendering  
- “Assistant is typing…” indicator  
- Auto-scroll  
- Input lock while sending/typing  

### Chats sidebar
- Visible only for authenticated users.

### Account FAB
- Top-right — Upgrade plan / Personalization / Settings / Logout

---

## Quick start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.development`:
   ```env
   VITE_API_URL=http://localhost:5119
   ```

3. Run dev (app at [http://localhost:5173](http://localhost:5173)):
   ```bash
   npm run dev
   ```

---

## API

All backend calls are encapsulated in `src/api`.

---

## Project structure (short)

```
src/
├─ api/
│  ├─ client.ts         # axios: baseURL from env, withCredentials
│  ├─ chat.ts           # ask / askAnonymous + normalization
│  ├─ chatList.ts       # chat list
│  ├─ getChat.ts        # chat messages
│  └─ auth.ts           # login / register / checkAuth / logout
│
├─ Components/
│  ├─ Routes/AppRoutes.tsx
│  ├─ pages/ChatPage.tsx
│  ├─ layout/AppShell.tsx
│  ├─ header/TopBar.tsx
│  ├─ sidebar/ChatSidebar.tsx
│  ├─ composer/Composer.tsx
│  ├─ account/AccountFab.tsx
│  └─ chat/
│     ├─ ChatArea.tsx
│     ├─ MessageList.tsx
│     ├─ MessageBubble.tsx
│     └─ WelcomeCard.tsx
│
├─ hooks/
│  ├─ useChatList.ts
│  └─ useChatMessages.ts
│
├─ utilits/
│  ├─ TypingBubble.tsx
│  └─ typewriter.ts
│
├─ state/userState.tsx
├─ main.tsx
├─ Root.tsx
├─ index.css
└─ App.tsx
```

---

## Behavior

- On `/chat` without `chatId`, the frontend sends `ChatId=null`, receives a new `chatId`, navigates to `/chat/{chatId}`, and seeds the cache to avoid flicker.  
- While awaiting a reply:
  - Show `TypingBubble`  
  - Lock Composer  
  - Render text gradually (typewriter)  
  - Then unlock input  
- In guest mode:
  - Messages render and persist only within the current session (no backend history).

---

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
