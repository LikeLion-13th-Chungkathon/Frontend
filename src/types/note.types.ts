// 하이라이트 카테고리 (태깅 관련 타입 정의)

export type HighlightCategory = "PROBLEM" | "IDEA" | "SOLUTION";

// 텍스트 내 하이라이트 정보

export interface Highlight {
  id: string;
  category: HighlightCategory;
  // 하이라이팅 방식이 처음과 끝 글자를 클릭하는거라면
  startIndex: number;
  endIndex: number;
  text: string;
  memoId?: string;
}

// 특정 날짜에 대한 노트 문서(메인 데이터)
export interface DailyNote {
  id: string;
  date: string;
  content: string;
  highlights: Highlight[];
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// 메모 API 응답 타입 정의
export interface ApiMemo {
  id: number;
  created_at: string;
  modified_at: string;
  date: string;
  contents: string;
  user: number;
  project: number;
}

export interface ApiTagging {
  id: number;
  tag_contents: string;
  offset_start: number;
  offset_end: number;
  tag_style: number; // 0: 문제, 1: 아이디어, 2: 해결 (이라고 가정)
  memo: number;
}

export interface MemoCreateResponse {
  results: ApiMemo;
  log_result?: { success: boolean; message: string };
}

export interface TaggingCreateResponse {
  results: ApiTagging;
  log_result?: { success: boolean; message: string };
}
