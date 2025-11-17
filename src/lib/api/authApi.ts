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

export const useMyInfoQuery = () => {
  return useQuery<MyInfo>({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const { data } = await axiosInstance.get<MyInfo>("/account/my/");
      return data;
    },
    staleTime: 1000 * 60 * 5, // 선택: 5분 동안은 신선한 걸로 취급
  });
};
