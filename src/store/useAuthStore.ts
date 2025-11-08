import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  actions: {
    login: () => void;
    logout: () => void;
  };
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false, // 기본값 (추후 토큰 유무로 초기화)
  actions: {
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
  },
}));

export const useAuthActions = () => useAuthStore((state) => state.actions);

export default useAuthStore;
