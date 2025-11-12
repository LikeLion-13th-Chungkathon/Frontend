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
