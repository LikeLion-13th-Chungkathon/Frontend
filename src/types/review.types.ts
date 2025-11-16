import type { Highlight } from "./note.types";

// 팀 진척도 상황 정보 타입 정의
export interface TeamProgress {
  projectId: string;
  projectName: string;
  teamLogCount: number; // 팀원이 모은 총 통나무 개수
  teamMemberCount: number; // 팀원 수
  totalLogsForCompletion: number; // 몇개 모으면 완성인데?
  progressPercent: number; // API가 계산해준 진행률
}

// 태깅 결과 페이지 전체 데이터 (API 응답)
export interface ReviewData {
  teamProgress: TeamProgress;

  // 내가 작성한 모든 목록
  myHighlights: Highlight[];
}

// TagStatusSheet에 사용할 팀원 기여도 API 타입
export interface ApiProjectContribution {
  username: string;
  role: string;
  total_logs: number;
  max_possible_logs: number;
  contribution_percent: number;
}

// 1. GET /projects/{id}/house/
export interface ApiProjectHouse {
  project_name: string;
  member_count: number;
  duration_days: number;
  difficulty_ratio: number;
  current_logs: number;
  total_required_logs: number;
  progress_percent: number;
}

// 2. GET /taggings/project/{project_id}/
export interface ApiTagStyle {
  id: number;
  tag_detail: string;
  tag_color: string;
}

export interface ApiProjectTagging {
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

export interface ApiProjectCategory {
  tag_style: ApiTagStyle;
  taggings: ApiProjectTagging[];
}

export interface ApiProjectTaggingsResponse {
  project_id: number;
  project_name: string;
  categories: ApiProjectCategory[];
}
