import type { ProjectEvent, DailyNote } from "../../types";

// 렌딩페이지에 쓸 더미데이터
export const DUMMY_PROJECTS: ProjectEvent[] = [
  {
    id: "proj-1",
    title: "프로젝트명-중커톤",
    startDate: "2025-10-29",
    endDate: "2025-11-18",
    category: "HACKATHON",
    memberCount: 5,
  },
  {
    id: "proj-2",
    title: "사이드 프로젝트",
    startDate: "2025-11-20",
    endDate: "2025-12-10",
    category: "CONFERENCE",
    memberCount: 3,
  },
];

// 렌딩페이지에 쓸 노트 기록 데이터
export const DUMMY_NOTES: DailyNote[] = [
  {
    id: "note-1",
    date: "2025-11-04", // 11월 4일자 노트
    content: "오늘 달력 컴포넌트 구현했다.",
    highlights: [],
    createdAt: "2025-11-04T10:00:00Z",
    updatedAt: "2025-11-04T10:00:00Z",
  },
  {
    id: "note-2",
    date: "2025-11-04", // 11월 4일자 노트
    content: "저녁에 아이디어 회의함. 문제 정의 다시.",
    highlights: [
      {
        id: "hl-1",
        category: "PROBLEM",
        startIndex: 16,
        endIndex: 22,
        text: "문제 정의",
      },
    ],
    createdAt: "2025-11-04T19:30:00Z",
    updatedAt: "2025-11-04T19:30:00Z",
  },
  {
    id: "note-3",
    date: "2025-11-07", // 11월 7일자 노트
    content: "API 명세서 초안 작성 완료.",
    highlights: [
      {
        id: "hl-2",
        category: "SOLUTION",
        startIndex: 0,
        endIndex: 16,
        text: "API 명세서 초안 작성 완료.",
      },
    ],
    createdAt: "2025-11-07T14:00:00Z",
    updatedAt: "2025-11-07T14:00:00Z",
  },
];
