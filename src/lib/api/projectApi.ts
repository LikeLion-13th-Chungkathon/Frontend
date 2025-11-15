import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import type {
//   ProjectEvent,
//   CreateProjectPayload,
//   CreateProjectResponse,
//   Project,
// } from "../../types";
import axios from "../axiosInstance";

// 1. GET /projects/ 응답 객체
export interface ApiProject {
  id: number;
  project_name: string;
  date_start: string;
  date_end: string;
  owner: number;
  invite_code: string;
  created_at: string;
}

// 2. POST /projects/ 요청 객체
export interface CreateProjectPayload {
  project_name: string;
  date_start: string;
  date_end: string;
}

// 3. POST /projects/invite/ 요청 객체
export interface JoinProjectPayload {
  invite_code: string;
}

// 4. POST /projects/invite/ 응답 객체
export interface JoinProjectResponse {
  message: string;
  team_member: {
    user: number;
    project: number;
    role: string;
    joined_at: string;
  };
}

// 프로젝트 목록 조회 (GET/projects/)
export const useProjectsQuery = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await axios.get<{ results: ApiProject[] }>("/projects/");
      // UI 호환을 위한 snake_case => camelCase 매핑
      console.log("GET/projects/프로젝트목록조회 :", data);
      return data.results.map((project) => ({
        id: String(project.id),
        title: project.project_name,
        startDate: project.date_start,
        endDate: project.date_end,
        memberCount: 0, // ⬅️ (주의!) 목록 API는 인원수를 주지 않습니다.
        category: "HACKATHON", // (임시)
        inviteCode: project.invite_code,
      }));
    },
    staleTime: 30_000,
  });

// 프로젝트 생성 뮤테이션 (POST/projects/)
export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProjectPayload) => {
      const { data } = await axios.post<ApiProject>("/projects/", payload);
      console.log(data);
      return {
        project: {
          id: String(data.id),
          title: data.project_name,
          startDate: data.date_start,
          endDate: data.date_end,
        },
        inviteCode: data.invite_code,
      };
    },
    onSuccess: () => {
      // React Query 캐시된 ["projects"] 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// 프로젝트 참여 (POST/projects/invite/)
export const useJoinProjectMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 해당 초대코드로 프로젝트 찾기
    mutationFn: async (inviteCode: string) => {
      const payload: JoinProjectPayload = { invite_code: inviteCode };
      const { data } = await axios.post<JoinProjectResponse>(
        "/projects/invite/",
        payload
      );
      console.log("프로젝트 참여 데이타 :", data);
      return data;
    },
    onSuccess: () => {
      // 프로젝트 목록 다시 불러오기
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
