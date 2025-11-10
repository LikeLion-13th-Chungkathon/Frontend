import type { DailyNote, Highlight } from "../types";

// 노트 생성 및 수정 API 요청 예시
export interface CraeteNoteDTO {
  projectId: string;
  content: string;

  highlights: Omit<Highlight, "id">[];
}

// 노트 생성 및 수정 API (POST/notes) 응답
export interface CreateNoteResponse {
  newNote: DailyNote;
  // 첫 태킹 완료 여부에 따라 (벡엔드가 판단) 값이 true일때만 통나무 획득 모달 띄우기
  isFirstContribution: boolean;
}
