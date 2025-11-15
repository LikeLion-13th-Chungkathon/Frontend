import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { useEditorStore } from "../../../store/useEditorStore";
import {
  useNoteByIdQuery,
  useUpdateMemoMutation, // ⬅️ "텍스트" 수정용
  useCreateTaggingMutation, // ⬅️ "하이라이트" 생성용
} from "../../../lib/api/noteApi";
import type {
  Highlight,
  HighlightCategory,
  ProjectEvent,
} from "../../../types";
import { X } from "lucide-react";
import Modal from "../../common/Modal";
import { useQueryClient } from "@tanstack/react-query";

interface NoteDetailModalProps {
  isOpen: boolean;
  noteId: string | null; //어떤 노트를 열지 ID를 받음
  onClose: () => void; //모달을 닫는 함수를 받음
}

// 노트 페이지
const NoteDetailModal = ({ noteId, onClose, isOpen }: NoteDetailModalProps) => {
  const queryClient = useQueryClient();
  // noteId로 노트 데이터를 "조회"
  const { data: noteData, isLoading: isLoadingNote } = useNoteByIdQuery(
    noteId,
    {
      enabled: isOpen && !!noteId,
    }
  );

  // noteId에 대한 "수정" 뮤테이션 준비
  const updateMemoMutation = useUpdateMemoMutation(noteId!);
  const createTaggingMutation = useCreateTaggingMutation(noteId!);

  const { activeCategory, actions: editorActions } = useEditorStore();

  // 로컬 상태 (기본값을 빈 값으로)
  const [content, setContent] = useState("");
  const [highlights, setHighlights] = useState<Omit<Highlight, "id">[]>([]);

  // noteData가 로드되면 'content'만 동기화
  useEffect(() => {
    if (noteData) {
      setContent(noteData.content);
      setHighlights(noteData.highlights.map(({ id, ...rest }) => rest));
    } else {
      setContent("");
      setHighlights([]);
    }
  }, [noteData, noteId]);

  // 버튼 핸들러 (handleSubmit)
  // 6. (수정) handleSubmit - 이제 "텍스트 저장"만 담당
  const handleSubmit = async () => {
    if (!noteId || !noteData) return;
    // (참고) noteApi.ts의 useUpdateMemoMutation는 원본 'memo' 객체를 필요로 합니다.
    // A. 텍스트가 변경되었는지 확인하고, 변경되었으면 텍스트 수정 API 호출
    const isContentChanged = noteData.content !== content;
    if (isContentChanged) {
      await updateMemoMutation.mutateAsync({
        content: content,
        memo: noteData,
      });
    }

    // B. 하이라이트 API 호출 (Promise.all로 병렬 처리)
    // (참고: 기존 태깅을 모두 지우고 새로 생성하는 로직이 더 안전할 수 있음)
    // 여기서는 로컬 상태(highlights) 기준으로 생성 API만 호출
    try {
      await Promise.all(
        highlights.map((hl) => createTaggingMutation.mutateAsync(hl))
      );
    } catch (err) {
      console.error("하이라이트 저장 중 오류:", err);
      // (에러 처리)
    }

    onClose(); // 모든 작업 완료 후 모달 닫기
  };

  // 텍스트 하이라이트 로직 (onSelect 이벤트)
  // 덮어쓰기 로직 추가
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

      // (수정) API 즉시 호출 대신, 로컬 상태(highlights)를 업데이트
      setHighlights((prevHighlights) => {
        // (문제 3 해결) 새 하이라이트와 겹치는 기존 하이라이트를 필터링
        const filteredHighlights = prevHighlights.filter(
          (hl) => hl.startIndex >= end || hl.endIndex <= start // 겹치지 않는 것만 남김
        );
        // 필터링된 목록에 새 하이라이트 추가
        return [...filteredHighlights, newHighlight];
      });

      editorActions.setActiveCategory(null);
    }
  };

  // 현재 시간 포맷팅
  const { datePart, timePart, projectName } = useMemo(() => {
    const dateToFormat = noteData ? new Date(noteData.updatedAt) : new Date();

    // 1. 날짜 부분
    const datePart = `${
      dateToFormat.getMonth() + 1
    }월 ${dateToFormat.getDate()}일 기록`;

    // 2. 시간 부분
    const timePart = `${dateToFormat.getHours()}:${String(
      dateToFormat.getMinutes()
    ).padStart(2, "0")}`;

    let projName = "프로젝트";
    if (noteData) {
      // 1. ["projects"] 키로 캐시된 프로젝트 목록을 가져옴
      const projects = queryClient.getQueryData<ProjectEvent[]>(["projects"]);

      // 2. 목록에서 ID가 일치하는 프로젝트를 찾음
      const project = projects?.find(
        (p) => p.id === noteData.projectId // ⬅️ noteData.projectId는 string
      );

      if (project) {
        projName = project.title;
      }
    }

    return { datePart, timePart, projectName: projName };
  }, [noteData, queryClient]);

  if (isLoadingNote && !noteData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} width={335}>
        <ContentContainer>
          <div>노트 불러오는 중...</div>
        </ContentContainer>
      </Modal>
    );
  }

  // disabeld 로직 변경
  const isMutating =
    updateMemoMutation.isPending || createTaggingMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={335}>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>
      <ContentContainer>
        <Header>[{projectName}]</Header>
        <Header>
          {/* 1. 날짜 부분 (기본 Header 스타일) */}
          {datePart} {/* 2. 시간 부분 (새로운 TimeText 스타일) */}
          <TimeText>{timePart}</TimeText>
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
            color="#89F3FF" // ⬅️ (해결)
          >
            해결
          </TagButton>
          {/* <AddTagButton onClick={() => alert("새 태그 추가 (미구현)")}>
            <Plus size={16} />
          </AddTagButton> */}
        </TagButtons>

        {/*에디터 래퍼 스타일*/}
        <EditorWrapper>
          {/* 렌더러가 로컬 highlights 상태를 바라보도록 수정 */}
          <HighlightRenderer content={content} highlights={highlights} />
          <NoteEditor
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleTextSelect}
            spellCheck="false"
            disabled={isMutating} // ⬅️ 로딩/저장 중 입력 방지
          />
        </EditorWrapper>

        {/* Footer 버튼 스타일 */}
        <Footer>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <SubmitButton
            onClick={handleSubmit}
            disabled={isMutating} // 로딩/저장 중 클릭 방지
          >
            {updateMemoMutation.isPending ? "저장 중..." : "완료"}
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
  SOLUTION: "rgba(137, 243, 255, 0.7)", // #89F3FF
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
  font-size: 18px; // ⬅️ textarea와 동일한 폰트
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
  font-size: 18px; // ⬅️ 렌더러와 동일한 폰트
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

// const PageWrapper = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.4);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 100;
// `;

const TagButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; // ⬅️ 섹션 간 간격
  margin-top: 30px; // ⬅️ 닫기 버튼과 간격
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
  margin-top: -8px;
  // text-align: center;
`;

const TimeText = styled.span`
  /* 요청하신 스타일 적용 */
  font-size: 12px;
  padding-left: 4px;
  color: #969696;

  /* 나머지 스타일은 Header와 동일하게 유지 */
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: 400;
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
  border-radius: 22px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #c78550;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 18px;
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
