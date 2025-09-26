import { useEffect } from "react";
import { checkAuth } from "../../api/auth";
import { useUserState } from "../state/userState";

export default function SessionBootstrap() {
  const { setAuthenticated, setGuest, status } = useUserState();

  useEffect(() => {
    if (status !== "unknown") return;
    let authenticated = false;
    (async () => {
      authenticated = await checkAuth();
      if (authenticated) setAuthenticated();
      if (!authenticated) setGuest();
    })();

    return () => {
      authenticated = false;
    };
  }, [status, setAuthenticated, setGuest]);

  useEffect(() => {
    const onUnauth = () => setGuest();
    window.addEventListener("auth:unauthorized", onUnauth);
    return () => window.removeEventListener("auth:unauthorized", onUnauth);
  }, [setGuest]);

  return null;
}
