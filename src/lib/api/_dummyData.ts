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
    id: "note-today-1",
    date: "2025-11-11", // ⬅️ 오늘 날짜로 수정
    content: "오늘 날짜의 테스트 노트입니다. 클릭하세요.",
    highlights: [],
    projectId: "proj-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-today-2",
    date: "2025-11-11", // ⬅️ 오늘 날짜로 수정
    content: "오늘 날짜의 테스트 노트입니다. 클릭하세요.",
    highlights: [],
    projectId: "proj-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-today-3",
    date: "2025-11-11", // ⬅️ 오늘 날짜로 수정
    content: "오늘 날짜의 테스트 노트입니다. 클릭하세요.",
    highlights: [],
    projectId: "proj-1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
