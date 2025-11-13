import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useEditorStore } from "../../../store/useEditorStore";
import {
  useNoteByIdQuery,
  useUpdateNoteMutation,
} from "../../../lib/api/noteApi";
import type { Highlight, HighlightCategory } from "../../../types";
import { X } from "lucide-react";
import Modal from "../../common/Modal";

interface NoteDetailModalProps {
  isOpen: boolean;
  noteId: string; //어떤 노트를 열지 ID를 받음
  onClose: () => void; //모달을 닫는 함수를 받음
}

// 노트 페이지
const NoteDetailModal = ({ noteId, onClose, isOpen }: NoteDetailModalProps) => {
  // noteId로 노트 데이터를 "조회"
  const { data: noteData, isLoading: isLoadingNote } = useNoteByIdQuery(
    noteId! // enable 제어
  );

  // noteId에 대한 "수정" 뮤테이션 준비
  const updateNoteMutation = useUpdateNoteMutation(noteId!);

  const { activeCategory, actions: editorActions } = useEditorStore();

  // 로컬 상태 (기본값을 빈 값으로)
  const [content, setContent] = useState("");
  const [highlights, setHighlights] = useState<Omit<Highlight, "id">[]>([]);

  //  React Query가 데이터를 "불러오면" 로컬 상태에 세팅
  useEffect(() => {
    if (noteData) {
      setContent(noteData.content);
      setHighlights(noteData.highlights);
    } else {
      setContent("");
      setHighlights([]);
    }
  }, [noteData, noteId]); // ⬅️ noteData가 변경될 때만 실행

  // 버튼 핸들러 (handleSubmit)
  const handleSubmit = () => {
    if (!noteId) return; // noteId가 없으면 중단

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
    // noteData가 있을 땐 noteData의 시간을, 없으면 현재 시간
    const dateToFormat = noteData ? new Date(noteData.updatedAt) : new Date();
    return `${
      dateToFormat.getMonth() + 1
    }월 ${dateToFormat.getDate()}일 기록 ${dateToFormat.getHours()}:${String(
      dateToFormat.getMinutes()
    ).padStart(2, "0")}`;
  }, [noteData]); // 컴포넌트 마운트 시 한번만 계산되도록.

  if (isLoadingNote) {
    return (
      <PageWrapper>
        <div>노트 불러오는 중...</div>
      </PageWrapper>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={335}>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>
      <ContentContainer>
        <Header>
          [{noteData?.projectId || "프로젝트"}]의 {currentTime}
        </Header>

        {/* 12. (수정) TagButtons 스타일 및 '+' 버튼 추가 */}
        <TagButtons>
          <TagButton
            $active={activeCategory === "PROBLEM"}
            onClick={() => editorActions.setActiveCategory("PROBLEM")}
            color="#FFEC5E" // ⬅️ 노랑 (문제)
          >
            문제
          </TagButton>
          <TagButton
            $active={activeCategory === "IDEA"}
            onClick={() => editorActions.setActiveCategory("IDEA")}
            color="#FF83CD" // ⬅️ 분홍 (아이디어)
          >
            아이디어
          </TagButton>
          <TagButton
            $active={activeCategory === "SOLUTION"}
            onClick={() => editorActions.setActiveCategory("SOLUTION")}
            color="#86FF7B" // ⬅️ 초록 (해결)
          >
            해결
          </TagButton>
          {/* <AddTagButton onClick={() => alert("새 태그 추가 (미구현)")}>
            <Plus size={16} />
          </AddTagButton> */}
        </TagButtons>

        {/*에디터 래퍼 스타일*/}
        <EditorWrapper>
          <HighlightRenderer content={content} highlights={highlights} />
          <NoteEditor
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleTextSelect}
            spellCheck="false"
            // (로딩 중일 때 입력 방지)
            disabled={isLoadingNote || updateNoteMutation.isPending}
          />
        </EditorWrapper>

        {/* Footer 버튼 스타일 */}
        <Footer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={updateNoteMutation.isPending}
          >
            {updateNoteMutation.isPending ? "저장 중..." : "완료"}
          </SubmitButton>
        </Footer>
      </ContentContainer>
    </Modal>
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
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px; // ⬅️ 시안 적용
  background-color: white;
  border: 1px solid #e0e0e0; // ⬅️ 연한 테두리
  overflow: hidden; // ⬅️ 렌더러가 삐져나가지 않게
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

const TagButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; // ⬅️ 섹션 간 간격
  margin-top: 40px; // ⬅️ 닫기 버튼과 간격
  font-family: ${({ theme }) => theme.fonts.primary};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
  color: #969696; // ⬅️ 시안의 'X'는 연함
`;

const Header = styled.div`
  font-size: 20px;
  color: black;
  // text-align: center;
`;

const TagButton = styled.button<{ $active: boolean; color: string }>`
  height: 32px;
  padding: 0 14px;
  border-radius: 22px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 14px;
  cursor: pointer;

  /* 활성 상태 */
  background: ${({ $active, color }) => ($active ? color : "#EEEEEE")};
  color: ${({ $active }) => ($active ? "black" : "#969696")};
  border: 1px solid ${({ $active }) => ($active ? "#909090" : "#DDDDDD")};

  /* 비활성 시 투명도 (선택적) */
  /* opacity: ${({ $active }) => ($active ? 1 : 0.7)}; */
`;

// (신규) 태그 '+' 버튼
// const AddTagButton = styled(TagButton).attrs({
//   as: "button",
//   $active: false,
//   color: "#EEEEEE", // ⬅️ 비활성 스타일 강제
// })`
//   width: 32px;
//   height: 32px;
//   padding: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-shrink: 0;
//   color: #969696;
//   border: 1px solid #dddddd;
// `;

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled.button`
  height: 48px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: white;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;

const SubmitButton = styled(CancelButton)`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
