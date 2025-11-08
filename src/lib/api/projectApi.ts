import { useQuery } from "@tanstack/react-query";
import type { ProjectEvent } from "../../types";
import { DUMMY_PROJECTS } from "./_dummyData";

// 가짜 네트워크 지연
export const fakeFetch = <T>(data: T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 500); // 0.5초 지연
  });

// 모든 프로젝트 목록 가져오는 훅
export const useProjectQuery = () => {
  return useQuery<ProjectEvent[]>({
    queryKey: ["projects"],
    queryFn: () => fakeFetch(DUMMY_PROJECTS),
  });
};
