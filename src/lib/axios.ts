// axios 파일입니다.
// 토큰 인증이 필요한 경우의 axios 인스턴스와 그렇지 않은 경우의 axios 인스턴스를 구분해뒀습니다.

// import axios from "axios";
// import { useUserStore } from "../store/useUserStore"; // ⭐️ Zustand 스토어 import

// const BASE_URL = "https://api.yourserver.com";

// // 1. 🚀 공개용 인스턴스 (토큰 X)
// //    (로그인, 회원가입, 상품조회 등)
// export const publicApi = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // 2. 🔒 인증용 인스턴스 (토큰 O)
// //    (내 정보 조회, 글쓰기, 결제 등)
// export const privateApi = axios.create({
//   baseURL: BASE_URL,
//   headers: { "Content-Type": "application/json" },
// });

// // --- 🔒 인증용 인스턴스에만 Interceptor 추가 ---
// privateApi.interceptors.request.use(
//   (config) => {
//     // ⭐️ Zustand 스토어에서 토큰을 가져옵니다. (Hook 밖에서 사용)
//     const token = useUserStore.getState().accessToken;

//     if (token) {
//       // ⭐️ 헤더에 토큰 추가
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
