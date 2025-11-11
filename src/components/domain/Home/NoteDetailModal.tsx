import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useEditorStore } from "../../../store/useEditorStore";
import {
  useNoteByIdQuery,
  useUpdateNoteMutation,
} from "../../../lib/api/noteApi";
import type { Highlight, HighlightCategory } from "../../../types";

interface NoteDetailModalProps {
  noteId: string; //어떤 노트를 열지 ID를 받음
  onClose: () => void; //모달을 닫는 함수를 받음
}

// 노트 페이지
const NoteDetailModal = ({ noteId, onClose }: NoteDetailModalProps) => {
  // 4. (신규) noteId로 노트 데이터를 "조회"
  const { data: noteData, isLoading: isLoadingNote } = useNoteByIdQuery(noteId);

  // 5. (신규) noteId에 대한 "수정" 뮤테이션 준비
  const updateNoteMutation = useUpdateNoteMutation(noteId);

  const { activeCategory, actions: editorActions } = useEditorStore();

  // 6. 로컬 상태 (기본값을 빈 값으로)
  const [content, setContent] = useState("");
  const [highlights, setHighlights] = useState<Omit<Highlight, "id">[]>([]);

  // 7. (신규) React Query가 데이터를 "불러오면" 로컬 상태에 세팅
  useEffect(() => {
    if (noteData) {
      setContent(noteData.content);
      setHighlights(noteData.highlights);
    }
  }, [noteData]); // ⬅️ noteData가 변경될 때만 실행

  // '완료' 버튼 핸들러 (handleSubmit)
  const handleSubmit = () => {
    updateNoteMutation.mutate(
      {
        content: content,
        highlights: highlights,
      },
      {
        onSuccess: () => {
          onClose(); // ⬅️ 저장 성공 시 모달 닫기
        },
      }
    );
  };
  // 텍스트 하이라이트 로직 (onSelect 이벤트)
  const handleTextSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // 선택된 카테고리가 있고 & 텍스트가 실제로 드래그 되었다면
    if (activeCategory && start !== end) {
      const newHighlight: Omit<Highlight, "id"> = {
        category: activeCategory,
        startIndex: start,
        endIndex: end,
        text: content.slice(start, end),
      };

      // 하이트라이트 추가 및 카테고리 선택 해제
      setHighlights((prev) => [...prev, newHighlight]);
      editorActions.setActiveCategory(null);
    }
  };

  // 현재 시간 포맷팅
  const currentTime = useMemo(() => {
    const now = new Date();
    return `${
      now.getMonth() + 1
    }월 ${now.getDate()}일 기록 ${now.getHours()}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  }, []); // 컴포넌트 마운트 시 한번만 계산되도록.

  if (isLoadingNote) {
    return (
      <PageWrapper>
        <div>노트 불러오는 중...</div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper onClick={onClose}>
      {" "}
      {/* 8. 뒷배경 클릭 시 닫기 */}
      <Card onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* 9. 모달 클릭은 닫기 방지 */}
        <CloseButton onClick={onClose}>X</CloseButton> {/* 10. X 버튼 추가 */}
        <Header>
          [{noteData?.projectId || "..."}의 {currentTime}]{" "}
          {/* (데이터에서 렌더링) */}
        </Header>
        <TagButtons>
          <TagButton
            color="#FFEC5E"
            active={activeCategory === "PROBLEM"}
            onClick={() => editorActions.setActiveCategory("PROBLEM")}
          >
            문제
          </TagButton>
          {/* 아이디어 버튼 */}
          <TagButton
            color="#FF83CD"
            active={activeCategory === "IDEA"}
            onClick={() => editorActions.setActiveCategory("IDEA")}
          >
            아이디어
          </TagButton>
          {/* 해결 버튼 */}
          <TagButton
            color="#86FF7B"
            active={activeCategory === "SOLUTION"}
            onClick={() => editorActions.setActiveCategory("SOLUTION")}
          >
            해결
          </TagButton>
        </TagButtons>
        <EditorWrapper>
          <HighlightRenderer content={content} highlights={highlights} />
          <NoteEditor
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleTextSelect}
            spellCheck="false"
          />
        </EditorWrapper>
        <Footer>
          <Button onClick={onClose}>취소</Button>{" "}
          {/* 11. navigate(-1) 대신 onClose */}
          <Button
            primary
            onClick={handleSubmit}
            disabled={updateNoteMutation.isPending}
          >
            {updateNoteMutation.isPending ? "저장 중..." : "완료"}
          </Button>
        </Footer>
      </Card>
    </PageWrapper>
  );
};

export default NoteDetailModal;

const categoryColors = {
  PROBLEM: "rgba(255, 236, 94, 0.7)", // #FFEC5E
  IDEA: "rgba(255, 131, 205, 0.7)", // #FF83CD
  SOLUTION: "rgba(134, 255, 123, 0.7)", // #86FF7B
};

// 텍스트랑 하이라이트 배열 받아서
// 형광팬이 칠해진 HTML을 렌더링
const HighlightRenderer = ({
  content,
  highlights,
}: {
  content: string;
  highlights: Omit<Highlight, "id">[];
}) => {
  // 하이라이트 시작 인덱스(startIndex) 기준으로 정렬
  const sortedHighlights = [...highlights].sort(
    (a, b) => a.startIndex - b.startIndex
  );

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // 텍스트를 일반 텍스트와 하이라이트 조각으로 자르기
  sortedHighlights.forEach((hl, i) => {
    //하이라이트 전 '일반 텍스트' 추가
    if (hl.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${i}`}>{content.slice(lastIndex, hl.startIndex)}</span>
      );
    }

    // 하이라이트 텍스트 추가
    parts.push(
      <HighlightMark key={`hl}-${i}`} category={hl.category}>
        {content.slice(hl.startIndex, hl.endIndex)}
      </HighlightMark>
    );
    lastIndex = hl.endIndex;
  });

  // 마지막 하이라이트 이후의 '일반 텍스트' 추가
  if (lastIndex < content.length) {
    parts.push(<span key="text-last">{content.slice(lastIndex)}</span>);
  }
  return <RendererContainer>{parts}</RendererContainer>;
};

// 스타일 정의

// 1. 텍스트 에디터와 렌더러를 겹치기 위한 래퍼
const EditorWrapper = styled.div`
  position: relative; // 겹치기 기준
  width: 100%;
  height: 200px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white; // 래퍼에 배경색 적용
`;

// 2. (뒤) 하이라이트가 렌더링될 Div
const RendererContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1; // ⬅️ textarea보다 뒤에 위치

  width: 100%;
  height: 100%;
  padding: 12px; // ⬅️ textarea와 동일한 패딩
  font-size: 15px; // ⬅️ textarea와 동일한 폰트
  line-height: 1.5; // ⬅️ textarea와 동일한 줄 간격 (필요시 조절)
  box-sizing: border-box; // ⬅️ 패딩 포함 크기 계산
  white-space: pre-wrap; // ⬅️ 줄바꿈(enter)을 렌더링

  /* 사용자가 이 Div를 클릭/선택하지 못하게 함 */
  pointer-events: none;
`;

// 3. (앞) 실제 입력을 받는 Textarea
const NoteEditor = styled.textarea`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2; // ⬅️ 렌더러보다 앞에 위치

  width: 100%;
  height: 100%;
  padding: 12px; // ⬅️ 렌더러와 동일한 패딩
  font-size: 15px; // ⬅️ 렌더러와 동일한 폰트
  line-height: 1.5; // ⬅️ 렌더러와 동일한 줄 간격 (필요시 조절)
  box-sizing: border-box;
  resize: none;
  border: none;
  outline: none;

  /* ⬇️ 핵심: 배경과 글자색을 투명하게 */
  background: transparent;
  color: transparent;

  /* ⬇️ 커서(깜빡이) 색상은 보이게 */
  caret-color: black;
`;

// 4. 하이라이트용 <mark> 태그
const HighlightMark = styled.mark<{ category: HighlightCategory }>`
  background-color: ${({ category }) => categoryColors[category] || "yellow"};
  border-radius: 3px;
`;

const PageWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

//   background-image: url(${WoodBarkBg});
const Card = styled.div`
  position: relative; // ⬅️ X 버튼을 위해
  width: 90%;
  max-width: 400px;
  background-color: #fff7ed; // (테마 bodyBg)
  border-radius: 12px;
  padding: 16px;
`;
const Header = styled.div`
  font-size: 14px;
  color: #555;
  margin-bottom: 12px;
`;
const TagButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  /* ... (X 버튼 스타일) */
`;

const Button = styled.button<{ primary?: boolean }>`
  /* (버튼 스타일링...) */
`;

const TagButton = styled.button<{ color: string; active: boolean }>`
  background-color: ${(p) => p.color};
  border: 2px solid
    ${(p) => (p.active ? p.theme.colors.primary : "transparent")};
`;
