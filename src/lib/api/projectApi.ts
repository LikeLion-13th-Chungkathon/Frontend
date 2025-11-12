// import { useQuery } from "@tanstack/react-query";
// import type { ProjectEvent } from "../../types";
// import { DUMMY_PROJECTS } from "./_dummyData";

// // 가짜 네트워크 지연
// export const fakeFetch = <T>(data: T): Promise<T> =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(data);
//     }, 500); // 0.5초 지연
//   });

// // 모든 프로젝트 목록 가져오는 훅
// export const useProjectQuery = () => {
//   return useQuery<ProjectEvent[]>({
//     queryKey: ["projects"],
//     queryFn: () => fakeFetch(DUMMY_PROJECTS),
//   });
// };

// src/lib/api/projectApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axiosInstance from "../axios"; // 나중에 백 붙을 때 쓸 예정
import { DUMMY_PROJECTS } from "./_dummyData";

/* ================================
 * 타입 정의 (공통)
 * ================================ */
export type Project = {
  id: string;
  title: string;
  startDate: string; // ISO string
  endDate: string;   // ISO string
};

export type CreateProjectPayload = {
  title: string;
  startDate: string;
  endDate: string;
};

export type CreateProjectResponse = {
  project: Project;
  inviteCode: string;
};

/* ================================
 * 가짜 fetch 유틸 (0.5초 지연)
 * ================================ */
export const fakeFetch = <T>(data: T, delay = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

/* ================================
 * 프로젝트 목록 조회 (더미 데이터)
 * ================================ */
export const useProjectQuery = () =>
  useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fakeFetch(DUMMY_PROJECTS as Project[]),
    staleTime: 30_000,
  });

/* ================================
 * 프로젝트 생성 뮤테이션 (더미 push)
 * ================================ */
export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateProjectResponse, Error, CreateProjectPayload>({
    // 나중에 백엔드 붙으면 axiosInstance로 교체하면 됨
    // ex) async (payload) => (await axiosInstance.post(...)).data
    mutationFn: async (payload) => {
      const newProject: Project = {
        id: String(Date.now()), // 간단한 id 생성
        title: payload.title,
        startDate: payload.startDate,
        endDate: payload.endDate,
      };

      // 더미 목록에 직접 추가 (임시)
      DUMMY_PROJECTS.push({
        ...newProject,
        category: "HACKATHON", // 기본값
        memberCount: 1,        // 기본값(팀대표 1명으로 시작)
        // color: "#C78550",   // 필요하면 유지
      });

      // 응답 형태 흉내
      const response: CreateProjectResponse = {
        project: newProject,
        inviteCode: "LIKELION-LOG",
      };

      return fakeFetch(response);
    },

    onSuccess: () => {
      // React Query 캐시된 ["projects"] 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};


