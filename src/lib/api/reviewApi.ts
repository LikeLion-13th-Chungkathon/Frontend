//'리뷰' 페이지 조회 API 생성

import type { ReviewData } from "../../types";
import { useQuery } from "@tanstack/react-query";

// (가짜 API 함수)
const fetchReviewData = async (projectId: string): Promise<ReviewData> => {
  // const { data } = await myAxios.get(`/reviews/${projectId}`);

  // --- 더미 데이터 응답 ---
  const data: ReviewData = {
    teamProgress: {
      projectId: projectId,
      projectName: `[프로젝트${projectId}]`,
      teamLogCount: 34,
      teamMemberCount: 5,
      totalLogsForCompletion: 100,
    },
    myHighlights: [
      {
        id: "hl-1",
        category: "PROBLEM",
        startIndex: 0,
        endIndex: 5,
        text: "첫 문제",
      },
      {
        id: "hl-2",
        category: "PROBLEM",
        startIndex: 0,
        endIndex: 5,
        text: "두번째 문제",
      },
      {
        id: "hl-3",
        category: "IDEA",
        startIndex: 0,
        endIndex: 5,
        text: "아이디어1",
      },
      {
        id: "hl-4",
        category: "SOLUTION",
        startIndex: 0,
        endIndex: 5,
        text: "해결책1",
      },
      {
        id: "hl-5",
        category: "IDEA",
        startIndex: 0,
        endIndex: 5,
        text: "아이디어2",
      },
    ],
  };
  return new Promise((res) => setTimeout(() => res(data), 500));
  // --- 더미 데이터 끝 ---
};

// 리뷰 페이지 데이터 가져오기
export const useReviewsQuery = (projectId: string | null) => {
  return useQuery<ReviewData>({
    queryKey: ["reviews", projectId],
    queryFn: () => fetchReviewData(projectId!),
    enabled: !!projectId, // ProjectId가 있을때만 쿼리 실행
  });
};
