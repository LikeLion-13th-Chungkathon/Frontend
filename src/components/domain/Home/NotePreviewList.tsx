import styled from "styled-components";
import { useNotesByDateQuery } from "../../../lib/api/noteApi";
import useCalendarStore from "../../../store/useCalendarStore";
import type { DailyNote, HighlightCategory } from "../../../types";

const categoryColors: Record<HighlightCategory, string> = {
  PROBLEM: "#FFEB3B", // 문제
  IDEA: "#E91E63", // 아이디어
  SOLUTION: "#4CAF50", // 초록
};

interface NoteCardProps {
  note: DailyNote;
}

const NoteCard = ({ note }: NoteCardProps) => {
  return (
    <CardWrapper>
      {/* 1. 노트 전체 텍스트 보여주기 */}
      <CardContent>{note.content}</CardContent>

      {/* 2. 하이라이트 태그 있으면, 색상 점으로 표시 */}
      {note.highlights.length > 0 && (
        <HighlightTagList>
          {note.highlights.map((hl) => (
            <HighlightTag key={hl.id} category={hl.category} />
          ))}
        </HighlightTagList>
      )}
    </CardWrapper>
  );
};

const NotePreviewList = () => {
  // zustand에서 선택된 날짜 가져오기
  const selectedDate = useCalendarStore((state) => state.selectedDate);

  // 리액트 쿼리 훅에 '선택된 날짜' 전달해주고 데이터 가져오기
  const { data: notes, isLoading, isError } = useNotesByDateQuery(selectedDate);

  // 로딩 에러 데이터 없는 경우 처리
  const renderContent = () => {
    if (isLoading) {
      return <StatusText>노트를 불러오는 중...</StatusText>;
    }
    if (isError) {
      return <StatusText>노트를 불러오는 중 에러 발생</StatusText>;
    }
    if (!notes || notes.length === 0) {
      return <StatusText>작성된 노트가 없습니다.</StatusText>;
    }

    // 데이터 없으면 NoteCard 컴포넌트로 렌더링
    return notes.map((note) => <NoteCard key={note.id} note={note} />);
  };

  return <Wrapper>{renderContent()}</Wrapper>;
};

export default NotePreviewList;

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px; // 카드 사이의 간격
`;

// "노트가 없습니다" 등의 상태를 표시할 텍스트
const StatusText = styled.div`
  text-align: center;
  color: #888;
  padding: 20px 0;
  font-size: 14px;
`;

// 노트 카드 (기획안의 '네모박스')
const CardWrapper = styled.div`
  background-color: #f9f9f9; // 기획안의 연한 회색 배경
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #eee;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CardContent = styled.p`
  font-size: 14px;
  color: #333;
  line-height: 1.6; // 줄 간격
  margin: 0;

  /* ⬇️ 사용자가 입력한 줄바꿈(enter)을 그대로 표시해 줍니다. */
  white-space: pre-wrap;
`;

// 하이라이트 점(태그)들을 감싸는 리스트
const HighlightTagList = styled.div`
  display: flex;
  flex-wrap: wrap; // 태그가 많으면 줄바꿈
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee; // 내용과 구분선
`;

// 하이라이트 색상 점
const HighlightTag = styled.div<{ category: HighlightCategory }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;

  /* ⬇️ 카테고리(prop)에 따라 배경색을 동적으로 설정합니다. */
  background-color: ${({ category }) => categoryColors[category] || "#ccc"};
`;
