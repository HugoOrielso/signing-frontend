import axios from "axios";
import type { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";

async function forceSignOut(reason: string) {
  try {
    const session = await getSession();

    if ((session as Session | null)?.refreshToken) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        { refreshToken: (session as Session).refreshToken },
        { headers: { "Content-Type": "application/json" } }
      );
    }
  } catch {
    // si falla la revocación remota, igual cerramos sesión local
  } finally {
    await signOut({ callbackUrl: `/?error=${reason}` });
  }
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = (await getSession()) as Session | null;

  if (session?.error?.includes("RefreshFailed")) {
    await forceSignOut("session-expired");
    return Promise.reject(new Error("Session expired"));
  }

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url ?? "";

    const authRoutes = ["/auth/login", "/auth/refresh", "/api/auth"];
    const isAuthRequest = authRoutes.some((route) => requestUrl.includes(route));

    if (isAuthRequest) {
      return Promise.reject(error);
    }

    if (status === 401) {
      await forceSignOut("unauthorized");
    }

    return Promise.reject(error);
  }
);

export default api;