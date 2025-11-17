// src/lib/api/authApi.ts
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";

export type MyInfo = {
  id: number;
  username: string;
  email: string;
  nickname: string;
  created_at: string;
};

// 백엔드 실제 응답 형태: { results: { ...MyInfo } }
type MyInfoResponse = {
  results: MyInfo;
};

export const useMyInfoQuery = () => {
  return useQuery<MyInfo>({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<MyInfoResponse>("/account/my/");
      console.log("[useMyInfoQuery] /account/my/ response =", data);
      return data.results;   // results 안에 있는 MyInfo만 돌려주기
    },
    staleTime: 1000 * 60 * 5,
  });
};
