import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ||
  "";

export const http = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
});
