import type { Highlight } from "./note.types";

// 팀 진척도 상황 정보 타입 정의
export interface TeamProgress {
  projectId: string;
  projectName: string;
  teamLogCount: number; // 팀원이 모은 총 통나무 개수
  teamMemberCount: number; // 팀원 수
  totalLogsForCompletion: number; // 몇개 모으면 완성인데?
}

// 태깅 결과 페이지 전체 데이터 (API 응답)
export interface ReviewData {
  teamProgress: TeamProgress;

  // 내가 작성한 모든 목록
  myHighlights: Highlight[];
}
