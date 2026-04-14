import api from "@/lib/axiosClient";
import { create } from "zustand";

export type UserRole = "ADMIN" | "OPERATOR" | "CREDIT_ANALYST";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface SessionStore {
  user: SessionUser | null;
  isLoading: boolean;
  hasFetched: boolean;
  fetchSession: () => Promise<void>;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  isLoading: true,
  hasFetched: false,

  fetchSession: async () => {
    try {
      set({ isLoading: true });

      const res = await api.get("/auth/me");

      set({
        user: res.data.admin,
        isLoading: false,
        hasFetched: true,
      });
    } catch {
      set({
        user: null,
        isLoading: false,
        hasFetched: true,
      });
    }
  },

  clearSession: () =>
    set({
      user: null,
      isLoading: false,
      hasFetched: true,
    }),
}));