// 달력 중심. 현재 유저가 보고있는/선택한 날짜를 전역 상태로 다루는 파일
import { create } from "zustand";

// 오늘 날짜와 이달의 1일 YYYY-MM-DD 형식 구하기
const today = new Date().toISOString().split("T")[0];
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
