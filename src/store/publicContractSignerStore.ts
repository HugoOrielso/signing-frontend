"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PublicContractSignerSession = {
  email: string;
  sessionToken: string;
  verified: boolean;
};

interface PublicContractSignerState {

  // indica que el estado persistido ya se cargó
  hydrated: boolean;

  // sesiones OTP por contrato
  sessions: Record<string, PublicContractSignerSession>;

  setHydrated: (value: boolean) => void;

  setSession: (
    token: string,
    session: PublicContractSignerSession
  ) => void;

  clearSession: (token: string) => void;

  getSession: (
    token: string
  ) => PublicContractSignerSession | null;

  hasValidSession: (token: string) => boolean;
}

export const usePublicContractSignerStore =
create<PublicContractSignerState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      sessions: {},

      setHydrated: (value) => set({ hydrated: value }),

      setSession: (token, session) =>
        set((state) => ({
          sessions: {
            ...state.sessions,
            [token]: session,
          },
        })),

      clearSession: (token) =>
        set((state) => {
          const next = { ...state.sessions };
          delete next[token];
          return { sessions: next };
        }),

      getSession: (token) =>
        get().sessions[token] ?? null,

      hasValidSession: (token) => {
        const session = get().sessions[token];
        return !!session?.verified &&
               !!session?.email &&
               !!session?.sessionToken;
      },
    }),
    {
      name: "public-contract-signer-session",

      storage: createJSONStorage(() => sessionStorage),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);