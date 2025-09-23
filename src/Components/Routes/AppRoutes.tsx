import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const AuthRoutes = lazy(() => import("../Routes/AuthRoutes"));
const ChatPage = lazy(() => import("../pages/ChatPage"));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat/:chatId" element={<ChatPage />} /> {/* ← новий */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
