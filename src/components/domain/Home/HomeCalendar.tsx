import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { ProjectEvent } from "../../../types";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";
import TreeTrunkBg from "../../../assets/images/tree-trunk.png";

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

  // 통나무 배경 적용
  background-image: url(${TreeTrunkBg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;

  /* react-calendar의 기본 스타일을 오버라이드(덮어쓰기)합니다. */
  .react-calendar {
    width: 100%;
    border: none;
    background: transparent; // ⬅️ 캘린더 배경 투명하게
    font-family: ${({ theme }) => theme.fonts.primary};
  }

  //* 네비게이션 ( < 11월 > ) */
  .react-calendar__navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1em;
    padding: 0 10%; // ⬅️ 좌우 여백
  }
  .react-calendar__navigation button {
    background: none;
    border: none;
    font-size: 1.5em;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
  }
  .react-calendar__navigation button:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
  .react-calendar__navigation__label {
    flex-grow: 1 !important;
    font-size: 1.2em;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.text};
  }

  /* 요일 (일,월,화...) */
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 0.8em;
    margin-bottom: 0.5em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;
    text-decoration: none; // ⬅️ 밑줄 제거
    color: ${({ theme }) => theme.colors.textSecondary}; // ⬅️ 회색 텍스트
  }
  /* 일요일(빨강) */
  .react-calendar__month-view__weekdays__weekday--weekend:first-child {
    color: #de6464;
  }
  /* 토요일(파랑) - 시안에 있음 */
  .react-calendar__month-view__weekdays__weekday--weekend:last-child {
    color: #6495de;
  }

  /* 날짜 타일 (1, 2, 3...) */
  .react-calendar__tile {
    max-width: 100%;
    text-align: center;
    padding: 0.5em 0.25em;
    background: none;
    border: none;
    border-radius: 50%;
    height: 40px; // ⬅️ 높이 강제 (디자인에 맞게 조절)
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9em;
    color: ${({ theme }) => theme.colors.text};
  }

  /* 오늘 날짜 (시안의 '4') */
  .react-calendar__tile--now {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
    font-weight: 900;
  }

  /* 선택된 날짜 (오늘과 겹칠 수 있음) */
  .react-calendar__tile--active {
    background-color: ${({ theme }) => theme.colors.primary} !important;
    color: white;
    font-weight: 900;
  }

  /* 프로젝트 기간 (기존 로직) */
  .project-day {
    &:not(.react-calendar__tile--active):not(.react-calendar__tile--now) {
      background-color: rgba(202, 136, 83, 0.2); // ⬅️ Primary 색상 투명하게
    }
  }

  /* 주말 날짜 */
  .react-calendar__month-view__days__day--weekend:first-child {
    // 일요일
    color: #de6464;
  }
  .react-calendar__month-view__days__day--weekend:last-child {
    // 토요일
    color: #6495de;
  }

  /* 다른 달 날짜 숨기기 */
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #bdbdbd; // ⬅️ 아주 연하게
  }
`;
