import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { ProjectEvent } from "../../../types";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";

type Value = Date | null | [Date | null, Date | null];

// 헬퍼함수

// YYYY-MM-DD 형식 날짜 문자열을 Date 객체로 반환
const parseDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

interface HomeCalendarProps {
  project: ProjectEvent;
}

const HomeCalendar = ({ project }: HomeCalendarProps) => {
  // zustand 상태 액션 가져오기
  const { selectedDate } = useCalendarStore();
  const { setSelectedDate, setCurrentMonth } = useCalendarActions();

  // 변수 선언
  const projectStartDate = parseDate(project.startDate);
  const projectEndDate = parseDate(project.endDate);

  // 날짜 클릭 시 샐행될 핸들러
  // vlaue는 Date 객체. YYYY-MM-DD 문자열로 변환하여 스토어에 저장
  const handleDateChange = (value: Value) => {
    // value가 Date 객체가 아니면(null이거나 배열이면) 무시
    if (!(value instanceof Date)) return;

    // 표준시(UTC) 문제 방지를 위한 안전한 로컬 날짜 변환
    // (toISOString은 UTC 기준이라 하루가 밀릴 수 있음)
    const offset = value.getTimezoneOffset() * 60000;
    const localDate = new Date(value.getTime() - offset);
    const newDate = localDate.toISOString().split("T")[0];

    setSelectedDate(newDate);
  };

  // 달력의 월(Month) 변경시 실행될 핸들러
  const handleMonthChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      const newMonth =
        activeStartDate.toISOString().split("T")[0].slice(0, 8) + "01";
      setCurrentMonth(newMonth);
    }
  };

  // 각 날짜 타일에 클래스 이름을 부여
  const getTileClassName = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }): string | null => {
    if (view === "month") {
      // 비교를 위해 시간을 0시 0분 0초로 초기화
      date.setHours(0, 0, 0, 0);
      const start = new Date(projectStartDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(projectEndDate);
      end.setHours(0, 0, 0, 0);

      // 2. [해결] 이제 projectStartDate, projectEndDate를 사용할 수 있음
      if (date >= start && date <= end) {
        return "project-day";
      }
    }
    return null;
  };

  return (
    <CalendarWrapper>
      <Calendar
        value={new Date(selectedDate)} // 선택된 날짜 from store
        onChange={handleDateChange} // 날짜 클릭 핸들러
        onActiveStartDateChange={handleMonthChange}
        tileClassName={getTileClassName} // 프로젝트 기간 하이라이팅
        // 달력 UI 설정
        formatDay={(_locale, date) => date.getDate().toString()} // '일' 제거
        calendarType="gregory"
        locale="ko-KR" // 한국어 설정
      />
    </CalendarWrapper>
  );
};

export default HomeCalendar;

const CalendarWrapper = styled.div`
  width: 100%;
  padding: 0 16px; // 좌우 여백
  box-sizing: border-box;

  /* react-calendar의 기본 스타일을 오버라이드(덮어쓰기)합니다. */
  .react-calendar {
    width: 100%;
    border: none;
  }

  /* (날짜) 타일 기본 스타일 */
  .react-calendar__tile {
    height: 40px; // 타일 높이 조절
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%; // 동그랗게
  }

  /* 오늘 날짜 (기본 제공 클래스) */
  .react-calendar__tile--now {
    background-color: #f0f0f0; // ⬅️ 기획안의 회색 동그라미
    color: black;
  }

  /* 선택된 날짜 (기본 제공 클래스) */
  .react-calendar__tile--active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  /* ⬇️ [핵심] 5번에서 반환한 'project-day' 클래스 스타일 */
  .project-day {
    /* 이미 선택되었거나 오늘 날짜가 아니면 */
    &:not(.react-calendar__tile--active):not(.react-calendar__tile--now) {
      background-color: #e6f2ff; // ⬅️ 프로젝트 기간 하이라이트 (연한 파랑)
    }
  }

  /* 주말(토/일) 글자색 (기본 제공) */
  .react-calendar__month-view__days__day--weekend {
    color: #d10000; // (일요일 예시)
  }
`;
