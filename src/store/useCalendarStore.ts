// 달력 중심. 현재 유저가 보고있는/선택한 날짜를 전역 상태로 다루는 파일
import { create } from "zustand";
import { persist } from "zustand/middleware";

// 오늘 날짜와 이달의 1일 YYYY-MM-DD 형식 구하기
const today = new Date().toISOString().split("T")[0];
const firstDayOfMonth = today.slice(0, 8) + "01";

interface CalendarState {
  selectedDate: string;
  currentMonth: string;
  activeProjectId: string | null;

  // 액션들
  setSelectedDate: (date: string) => void;
  setCurrentMonth: (month: string) => void;
  setActiveProjectId: (id: string | null) => void;
}

const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      selectedDate: today,
      currentMonth: firstDayOfMonth,
      activeProjectId: null,

      setSelectedDate: (date) => set({ selectedDate: date }),
      setCurrentMonth: (month) => set({ currentMonth: month }),
      setActiveProjectId: (id) => set({ activeProjectId: id }),
    }),
    {
      name: "calendar-store",
      partialize: (state) => ({
        selectedDate: state.selectedDate,
        currentMonth: state.currentMonth,
        // activeProjectId는 저장 안함
      }),
    }
  )
)

export const useCalendarActions = () =>
  useCalendarStore((state) => ({
    setSelectedDate: state.setSelectedDate,
    setCurrentMonth: state.setCurrentMonth,
    setActiveProjectId: state.setActiveProjectId,
  }));

export default useCalendarStore;
