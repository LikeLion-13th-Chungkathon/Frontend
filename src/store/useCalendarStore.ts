// 달력 중심. 현재 유저가 보고있는/선택한 날짜를 전역 상태로 다루는 파일
import { create } from "zustand";

// ⬇️ 1. (수정) 한국 시간(로컬 타임존)을 정확히 구하는 함수 추가
const getTodayString = () => {
  const today = new Date();
  // 현재 타임존과 UTC의 차이(분)를 밀리초로 변환
  const offset = today.getTimezoneOffset() * 60000;
  // 차이만큼 뺀 날짜 객체 생성 (한국 시간 기준)
  const localDate = new Date(today.getTime() - offset);

  return localDate.toISOString().split("T")[0];
};

// ⬇️ 2. (수정) 함수 실행 결과를 변수에 저장
const today = getTodayString();
const firstDayOfMonth = today.slice(0, 8) + "01";

interface CalendarState {
  /**
   * 사용자가 달력에서 선택한 *특정 날짜* (e.g., "2025-11-08")
   * React Query가 'DailyNote'를 불러올 때 사용합니다.
   * (queryKey: ['notes', selectedDate])
   */
  selectedDate: string;

  /**
   * 사용자가 현재 보고 있는 *달의 1일* (e.g., "2025-11-01")
   * React Query가 'ProjectEvent'(해커톤 일정)를 불러올 때 사용합니다.
   * (queryKey: ['events', currentMonth])
   */
  currentMonth: string;

  // 활성화된 프로젝트 ID
  activeProjectId: string | null;

  // 상태 변경 액션
  actions: {
    setSelectedDate: (date: string) => void;
    setCurrentMonth: (month: string) => void;
    setActiveProjectId: (id: string) => void;
  };
}

const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: today,
  currentMonth: firstDayOfMonth,
  activeProjectId: null,

  actions: {
    setSelectedDate: (date) => set({ selectedDate: date }),
    setCurrentMonth: (month) => set({ currentMonth: month }),
    setActiveProjectId: (id) => set({ activeProjectId: id }),
  },
}));

export const useCalendarActions = () =>
  useCalendarStore((state) => state.actions);

export default useCalendarStore;
