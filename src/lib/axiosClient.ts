import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const session = (await getSession()) as Session | null;

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const session = (await getSession()) as Session | null;
    const status = error?.response?.status;
    const requestUrl = error?.config?.url as string | undefined;

    // Si el refresh ya falló, saca al usuario
    if (session?.error?.startsWith("RefreshFailed")) {
      await signOut({
        callbackUrl: "/login?error=SessionExpired",
        redirect: true,
      });
      return Promise.reject(error);
    }

    // Evita bucles con endpoints de auth/login si quieres
    const isAuthRequest =
      requestUrl?.includes("/auth/login") ||
      requestUrl?.includes("/auth/refresh") ||
      requestUrl?.includes("/api/auth");

    if (status === 401 && !isAuthRequest) {
      await signOut({
        callbackUrl: "/login?error=Unauthorized",
        redirect: true,
      });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;