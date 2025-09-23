import React from "react";
import AppRoutes from "../src/Components/Routes/AppRoutes";
import { UserStateProvider } from "./Components/state/userState";

const App: React.FC = () => {
  return (
    <UserStateProvider>
      <AppRoutes />
    </UserStateProvider>
  );
};

export default App;