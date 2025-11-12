import type { DailyNote, Highlight } from "../types";

// 텍스트 전용 노트 생성 DTO
export interface CreateTextNoteDTO {
  projectId: string;
  content: string;
}

export interface UpdateNoteDTO {
  // noteId는 URL 파라미터로 보낸다고 가정
  content: string;
  highlights: Omit<Highlight, "id">[]; // 하이라이트 정보
}

// 노트 "수정(하이라이팅)" API 응답
export interface UpdateNoteResponse {
  updatedNote: DailyNote;
  //2.1 통나무 모달은 "수정" 시에만 뜨게
  isFirstContribution: boolean;
}
