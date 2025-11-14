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
    inviteCode: "CHUNGANG",
  },
  {
    id: "proj-2",
    title: "사이드 프로젝트",
    startDate: "2025-11-20",
    endDate: "2025-12-10",
    category: "CONFERENCE",
    memberCount: 3,
    inviteCode: "SIDE",
  },

  //팀원 초대코드 확인용
  {
    id: "proj-3",
    title: "멋쟁이사자즈",
    startDate: "2025-11-24",
    endDate: "2025-12-5",
    category: "CONFERENCE",
    memberCount: 5,
    inviteCode: "LIKELIONS-13",
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
    content: "오늘 날짜의 노트",
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
