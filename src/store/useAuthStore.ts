// import { create } from "zustand";

// interface AuthState {
//   isLoggedIn: boolean;
//   actions: {
//     login: () => void;
//     logout: () => void;
//   };
// }

// const useAuthStore = create<AuthState>((set) => ({
//   isLoggedIn: false, // 기본값 (추후 토큰 유무로 초기화)
//   actions: {
//     login: () => set({ isLoggedIn: true }),
//     logout: () => set({ isLoggedIn: false }),
//   },
// }));

// export const useAuthActions = () => useAuthStore((state) => state.actions);

// export default useAuthStore;

import { create } from "zustand";

type User = { id: string; name: string; email: string } | null;

type AuthState = {
  user: User;
  hasSeenOnboarding: boolean;
  setUser: (u: User) => void;
  setHasSeenOnboarding: (v: boolean) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hasSeenOnboarding: !!localStorage.getItem("hasSeenOnboarding"),
  setUser: (u) => set({ user: u }),
  setHasSeenOnboarding: (v) => {
    if (v) localStorage.setItem("hasSeenOnboarding", "1");
    set({ hasSeenOnboarding: v });
  },
  logout: () => set({ user: null }),
}));

export default useAuthStore;
