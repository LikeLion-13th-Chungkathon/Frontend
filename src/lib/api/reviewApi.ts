//'리뷰' 페이지 조회 API 생성
import type {
  Highlight,
  ReviewData,
  TeamProgress,
  ApiProjectHouse,
  ApiProjectTaggingsResponse,
  ApiProjectContribution,
} from "../../types";
import { useQuery } from "@tanstack/react-query";
import axios from "../axiosInstance";
import { tagStyleToCategory } from "../utils/tagHelpers";

// --- (신규) API 응답 타입 (Swagger 기준) ---

// 리뷰 페이지 데이터 조회 (2개 API 동시 호출)
export const useReviewsQuery = (projectId: string | null) => {
  return useQuery<ReviewData>({
    queryKey: ["reviews", projectId],
    queryFn: async () => {
      // API 병렬 호출
      const [houseRes, taggingsRes] = await Promise.all([
        axios.get<ApiProjectHouse>(`/projects/${projectId}/house/`),
        axios.get<ApiProjectTaggingsResponse>(
          `/taggings/project/${projectId}/`
        ),
      ]);

      const houseData = houseRes.data;
      const taggingsData = taggingsRes.data;
      console.log("houseData: ", houseData);
      console.log("taggingsData: ", taggingsData);

      // ApiProjectHouse -> TeamProgress (앱 타입)로 변환
      const teamProgress: TeamProgress = {
        projectId: String(taggingsData.project_id), // ⬅️ ID는 Taggings API에서
        projectName: houseData.project_name,
        teamLogCount: houseData.current_logs,
        teamMemberCount: houseData.member_count,
        totalLogsForCompletion: houseData.total_required_logs,
        progressPercent: houseData.progress_percent,
      };

      // ApiProjectTaggingsResponse -> Highlight[] (앱 타입)로 변환
      const myHighlights: Highlight[] = [];
      taggingsData.categories.forEach((category) => {
        category.taggings.forEach((tag) => {
          myHighlights.push({
            id: String(tag.id),
            category: tagStyleToCategory(tag.tag_style),
            startIndex: tag.offset_start,
            endIndex: tag.offset_end,
            text: tag.tag_contents,
            memoId: String(tag.memo), //추가
          });
        });
      });

      // 두 데이터 ReviewData로 조합
      return {
        teamProgress,
        myHighlights,
      };
    },
    enabled: !!projectId,
  });
};

// 프로젝트 임원 기여도 조회
export const useProjectContributionQuery = (projectId: string | null) => {
  return useQuery<ApiProjectContribution[]>({
    queryKey: ["reviews", projectId, "contribution"], // ⬅️ 메인 쿼리와 키 분리
    queryFn: async () => {
      const { data } = await axios.get<ApiProjectContribution[]>(
        `/projects/${projectId}/house/contribution/`
      );
      return data;
    },
    enabled: !!projectId, // projectId가 있을 때만 호출
  });
};
