import styled from "styled-components";
import { useNotesByDateQuery } from "../../../lib/api/noteApi";
import useCalendarStore from "../../../store/useCalendarStore";
import type { DailyNote, HighlightCategory } from "../../../types";
import WoodPlankBg from "../../../assets/images/wood-plank.png";

//헬퍼함수
// HH:MM 형식으로 변환
const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  // getHours(), getMinutes()는 브라우저의 로컬 시간대를 따릅니다.
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 텍스트 maxLength

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + "...";
};

const categoryColors: Record<HighlightCategory, string> = {
  PROBLEM: "#FFEB3B", // 문제
  IDEA: "#E91E63", // 아이디어
  SOLUTION: "#4CAF50", // 초록
};

interface NoteCardProps {
  note: DailyNote;
  onClick: () => void; // 클릭 핸들러
}

const NoteCard = ({ note, onClick }: NoteCardProps) => {
  const time = formatTime(note.updatedAt);

  const truncatedContent = truncateText(note.content, 20);

  return (
    <NoteItemContainer onClick={onClick}>
      {/* 3. (수정) 나무 판자 (시간은 이제 외부에 있음) */}
      <CardWrapper>
        <CardContent>{truncatedContent}</CardContent>{" "}
        {/* ⬅️ 잘린 content 전달 */}
        {note.highlights.length > 0 && (
          <HighlightTagList>
            {note.highlights.map((hl) => (
              <HighlightTag key={hl.id} category={hl.category} />
            ))}
          </HighlightTagList>
        )}
      </CardWrapper>

      {/* 4. (신규) 시간이 이미지 밖의 "형제" 요소로 분리됨 */}
      <Timestamp>{time}</Timestamp>
    </NoteItemContainer>
  );
};

// HomePage에서 onNoteClick 함수 받기
interface NotePreviewListProps {
  onNoteClick: (noteId: string) => void;
}

const NotePreviewList = ({ onNoteClick }: NotePreviewListProps) => {
  // zustand에서 선택된 날짜 가져오기
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);

  // 리액트 쿼리 훅에 '선택된 날짜' 전달해주고 데이터 가져오기
  const {
    data: notes,
    isLoading,
    isError,
  } = useNotesByDateQuery(activeProjectId, selectedDate);

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
    return notes.map((note) => (
      <NoteCard
        key={note.id}
        note={note}
        onClick={() => onNoteClick(note.id)}
      />
    ));
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

  background-color: ${({ theme }) => theme.colors.bodyBg};
`;

// "노트가 없습니다" 등의 상태를 표시할 텍스트
const StatusText = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 20px 0;
  font-size: 14px;
`;

const NoteItemContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  align-items: flex-end;

  gap: 8px;
  cursor: pointer;
`;

// 노트 카드 (기획안의 '네모박스')
const CardWrapper = styled.div`
  background-image: url(${WoodPlankBg});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: none;
  box-shadow: none;
  padding: 16px 20px;
  max-width: 85%;
`;

const CardContent = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;
  margin: 0;

  /* ⬇️ 텍스트 길이에 따라 높이가 유동적으로 변하도록 pre-wrap 유지 */
  white-space: pre-wrap;

  /* 텍스트가 너무 길어질 때를 대비 (선택적) */
  word-break: break-all;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;

  padding-bottom: 16px;
`;

// 하이라이트 점(태그)들을 감싸는 리스트
const HighlightTagList = styled.div`
  display: flex;
  flex-wrap: wrap; // 태그가 많으면 줄바꿈
  gap: 6px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(202, 136, 83, 0.3);
`;

// 하이라이트 색상 점
const HighlightTag = styled.div<{ category: HighlightCategory }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;

  /* ⬇️ 카테고리(prop)에 따라 배경색을 동적으로 설정합니다. */
  background-color: ${({ category }) => categoryColors[category] || "#ccc"};
`;
