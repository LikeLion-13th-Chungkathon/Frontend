// src/lib/axiosInstance.ts
import axios, { AxiosHeaders } from "axios";
import useAuthStore from "../store/useAuthStore";

// axios 기본 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  withCredentials: true, // 필요 시 쿠키 전송 허용
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// 요청 인터셉터 (예: 토큰 자동 첨부)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // 토큰을 붙이지 않을 URL (로그인/회원가입/구글 콜백)
    const skipAuth =
      config.url?.startsWith("/auth/login") ||
      config.url?.startsWith("/auth/signup") ||
      config.url?.startsWith("/account/google/callback/") ||
      config.url?.startsWith("/account/google/signup/");

    if (token && !skipAuth) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      (config.headers as AxiosHeaders).set(
        "Authorization",
        `Bearer ${token}`
      );
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (예: 에러 처리, 토큰 만료 등)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("인증 만료됨. 다시 로그인 필요", error.response?.data);

      // 1) 로컬 토큰 제거
      localStorage.removeItem("accessToken");

      // 2) Zustand 상태 초기화
      const { logout } = useAuthStore.getState();
      logout(); // user=null, status="UNAUTHENTICATED", pendingGoogleUser=null

      // 3) 로그인 페이지로 강제 이동
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
