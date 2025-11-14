import { create } from "zustand";

// User 타입 
// 로그인 전 null / 로그인 후 id, name, email 포함된 객체
type User = { id: string; name: string; email: string } | null;

// 로그인 상태 타입
// UNAUTHEMTICATED: 로그인 안 된 상태, AUTHENTICATED: 로그인 완료
type AuthStatus = "UNAUTHENTICATED" | "AUTHENTICATED"

type AuthState = {
  user: User; // 현재 로그인한 사용자 정보
  status: AuthStatus; // 로그인 상태
  hasSeenOnboarding: boolean;

  setUser: (u: User) => void;
  setStatus: (s: AuthStatus) => void;
  setHasSeenOnboarding: (v: boolean) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태 설정
  user: null,
  status: "UNAUTHENTICATED",

  // 온보딩 여부 localStorage 기반
  hasSeenOnboarding: !!localStorage.getItem("hasSeenOnboarding"),

  // 사용자 정보 설정 - 로그인 성공 시 user에 서버에서 받은 값 넣음
  setUser: (u) => set({ user: u }),
  
  // 로그인 status 업데이트
  setStatus: (s) => set({ status: s }),
  
  setHasSeenOnboarding: (v) => {
    if (v) localStorage.setItem("hasSeenOnboarding", "1");
    set({ hasSeenOnboarding: v });
  },
  logout: () => set({ user: null }),
}));

export default useAuthStore;
