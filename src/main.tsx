// index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Root from "./Root";
import { UserStateProvider } from "./Components/state/userState";
import SessionBootstrap from "./Components/auth/AuthBootstrap"; // або твій AuthBootstrap

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,  
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserStateProvider initialStatus="unknown">
        <BrowserRouter>
          <SessionBootstrap />
          <Root />
        </BrowserRouter>
      </UserStateProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
