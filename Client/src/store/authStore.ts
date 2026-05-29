import { create } from "zustand";
import { persist } from "zustand/middleware";
import { queryClient } from "@/lib/queryClient";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
};

function syncAuthStorage(token: string | null, user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (token && user) {
    window.localStorage.setItem("tripai_token", token);
    window.localStorage.setItem("tripai_user", JSON.stringify(user));
    return;
  }

  window.localStorage.removeItem("tripai_token");
  window.localStorage.removeItem("tripai_user");
}

function clearUserCache() {
  queryClient.clear();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) => {
        clearUserCache();
        syncAuthStorage(token, user);
        set({ token, user, isAuthenticated: true });
      },
      clearSession: () => {
        clearUserCache();
        syncAuthStorage(null, null);
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "tripai-auth",
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        syncAuthStorage(state?.token ?? null, state?.user ?? null);
      },
    },
  ),
);