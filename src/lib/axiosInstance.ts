// src/lib/axiosInstance.ts
import axios from "axios";

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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (예: 에러 처리, 토큰 만료 등)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("인증 만료됨. 다시 로그인 필요");
      // TODO: refresh token 로직 or logout 처리
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
