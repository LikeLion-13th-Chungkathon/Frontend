//'리뷰' 페이지 조회 API 생성
import type { Highlight, ReviewData, TeamProgress } from "../../types";
import { useQuery } from "@tanstack/react-query";
import axios from "../axiosInstance";
import { tagStyleToCategory } from "../utils/tagHelpers";

// --- (신규) API 응답 타입 (Swagger 기준) ---

// 1. GET /projects/{id}/house/
interface ApiProjectHouse {
  project_name: string;
  member_count: number;
  duration_days: number;
  difficulty_ratio: number;
  current_logs: number;
  total_required_logs: number;
  progress_percent: number;
}

// 2. GET /taggings/project/{project_id}/
interface ApiTagStyle {
  id: number;
  tag_detail: string;
  tag_color: string;
}

interface ApiProjectTagging {
  id: number;
  created_at: string;
  modified_at: string;
  tag_contents: string;
  offset_start: number;
  offset_end: number;
  tag_style: number;
  user: number;
  memo: number;
}

interface ApiProjectCategory {
  tag_style: ApiTagStyle;
  taggings: ApiProjectTagging[];
}

interface ApiProjectTaggingsResponse {
  project_id: number;
  project_name: string;
  categories: ApiProjectCategory[];
}

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
      console.log(houseData);
      console.log(taggingsData);

      // ApiProjectHouse -> TeamProgress (앱 타입)로 변환
      const teamProgress: TeamProgress = {
        projectId: String(taggingsData.project_id), // ⬅️ ID는 Taggings API에서
        projectName: houseData.project_name,
        teamLogCount: houseData.current_logs,
        teamMemberCount: houseData.member_count,
        totalLogsForCompletion: houseData.total_required_logs,
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
