import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";
import TreeTrunkBg from "../../../assets/images/tree-trunk.png";

type Value = Date | null | [Date | null, Date | null];

// 헬퍼함수

// YYYY-MM-DD 형식 날짜 문자열을 Date 객체로 반환
// const parseDate = (dateStr: string): Date => {
//   const [year, month, day] = dateStr.split("-").map(Number);
//   return new Date(year, month - 1, day);
// };

// interface HomeCalendarProps {
//   project: ProjectEvent;
// }

const HomeCalendar = () => {
  // zustand 상태 액션 가져오기
  const { selectedDate } = useCalendarStore();
  const { setSelectedDate, setCurrentMonth } = useCalendarActions();

  // 변수 선언
  // const projectStartDate = parseDate(project.startDate);
  // const projectEndDate = parseDate(project.endDate);

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

  return (
    <CalendarWrapper>
      <Calendar
        value={new Date(selectedDate)} // 선택된 날짜 from store
        onChange={handleDateChange} // 날짜 클릭 핸들러
        onActiveStartDateChange={handleMonthChange}
        showFixedNumberOfWeeks
        navigationLabel={({ date }) => `${date.getMonth() + 1}월`} // ⬅️ "11월" 형식
        prevLabel="<"
        nextLabel=">"
        prev2Label={null} // ⬅️ 년도 이동 제거
        next2Label={null} // ⬅️ 년도 이동 제거
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
  padding: 0 0 10px 0;
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
    background: transparent;
    font-family: ${({ theme }) => theme.fonts.primary};

    /* ⬇️ (수정) 1. 글자가 이미지 안쪽으로 오도록 패딩 추가 */
    padding: 30px 40px;
    box-sizing: border-box; // ⬅️ 패딩 포함
  }

  //* 네비게이션 ( < 11월 > ) */
  .react-calendar__navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.02em;
    padding: 0; // ⬅️ 좌우 여백
  }
  .react-calendar__navigation button {
    background: none !important;
    border: none;
    font-size: 1.2em;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;

    min-width: 30px;
  }
  // .react-calendar__navigation button:hover {
  //   color: ${({ theme }) => theme.colors.primary};
  // }
  .react-calendar__navigation__label {
    flex-grow: 1 !important;
    font-size: 1em;
    font-weight: 900;
    // color: ${({ theme }) => theme.colors.text};
  }

  /* 요일 (일,월,화...) */
  .react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1em;
    margin-bottom: 0.3em;
  }
  .react-calendar__month-view__weekdays__weekday {
    padding: 0.5em;

    color: black;
    abbr {
      text-decoration: none !important; /* ⬅️ 확실하게 !important를 씁니다 */
      cursor: default; /* (클릭 가능하다는 오해를 막기 위해) */
    }
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
    padding: 0.25em;
    background: none;
    border: none;
    border-radius: 50%;
    height: 32px; // ⬅️ 높이 강제 (디자인에 맞게 조절)
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    color: ${({ theme }) => theme.colors.text};
  }

  /* 오늘 날짜 (시안의 '4') */
  .react-calendar__tile--now {
    background-color: #e1c9b5;
    color: black;
    font-weight: 900;
  }

  /* 선택된 날짜 (오늘과 겹칠 수 있음) */
  .react-calendar__tile--active {
    background-color: #7d4519 !important; // ⬅️ !important로 우선순위
    color: white;
    font-weight: 900;
  }
  .react-calendar__tile:hover:not(.react-calendar__tile--active):not(
      .react-calendar__tile--now
    ) {
    background-color: #e1c9b5; /* ⬅️ 요청하신 호버 색상 */
    color: balck; /* (연한 배경에 어두운 글씨) */
    cursor: pointer;
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
