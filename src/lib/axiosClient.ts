import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = await getSession() as Session | null;
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const session = await getSession() as Session | null;

    if (session?.error?.startsWith("RefreshFailed")) {
      await signOut({ callbackUrl: "/login?error=SessionExpired" });
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      await getSession();
    }

    return Promise.reject(error);
  }
);

export default api;