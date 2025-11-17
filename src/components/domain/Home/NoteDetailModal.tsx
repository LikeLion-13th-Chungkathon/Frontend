import React, { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { useEditorStore } from "../../../store/useEditorStore";
import {
  useNoteByIdQuery,
  useUpdateMemoMutation,
  useCreateTaggingMutation,
  useDeleteTaggingMutation,
} from "../../../lib/api/noteApi";
import type {
  Highlight,
  HighlightCategory,
  ProjectEvent,
} from "../../../types";
import { X } from "lucide-react";
import Modal from "../../common/Modal";
import { useModalActions } from "../../../store/useModalStore";
import { useQueryClient } from "@tanstack/react-query";

// --- 1. 모드 정의 ---
type TabMode = "EDIT_TEXT" | "EDIT_TAGS";

interface NoteDetailModalProps {
  isOpen: boolean;
  noteId: string | null; //어떤 노트를 열지 ID를 받음
  onClose: () => void; //모달을 닫는 함수를 받음
}

// 노트 페이지
const NoteDetailModal = ({ noteId, onClose, isOpen }: NoteDetailModalProps) => {
  // noteId로 노트 데이터를 "조회"
  const queryClient = useQueryClient(); // ⬅️ queryClient 인스턴스
  const { data: noteData, isLoading: isLoadingNote } = useNoteByIdQuery(
    noteId,
    { enabled: isOpen && !!noteId }
  );

  // 뮤테이션 준비
  const updateMemoMutation = useUpdateMemoMutation(noteId!);
  const createTaggingMutation = useCreateTaggingMutation(noteId!);
  const deleteTaggingMutation = useDeleteTaggingMutation();

  const { openLogAcquiredModal } = useModalActions();
  const { activeCategory, actions: editorActions } = useEditorStore();

  const [mode, setMode] = useState<TabMode>("EDIT_TAGS");
  const [content, setContent] = useState("");

  // 로컬 하이라이트 상태 (API 데이터 + 로컬 추가 데이터)
  const [localHighlights, setLocalHighlights] = useState<
    (Highlight | Omit<Highlight, "id">)[]
  >([]);

  // 초기 데이터 로드 시 로컬 상태 동기화
  useEffect(() => {
    if (noteData) {
      setContent(noteData.content);
      setLocalHighlights(noteData.highlights);
    } else {
      setContent("");
      setLocalHighlights([]);
    }
  }, [noteData]);

  // --- 핸들러: 텍스트 저장 ---
  const handleSaveText = () => {
    if (!noteData) return;
    if (content !== noteData.content) {
      updateMemoMutation.mutate(
        { content, memo: noteData },
        {
          onSuccess: () => setMode("EDIT_TAGS"),
        }
      );
    } else {
      setMode("EDIT_TAGS");
    }
  };

  // --- 핸들러: 태그 저장 및 닫기 ---
  const handleSaveTagsAndClose = async () => {
    if (!noteData || !noteId) return;

    // A. 변경 사항 계산
    const originalIds = noteData.highlights.map((h) => h.id);
    const currentIds = localHighlights
      .filter((h): h is Highlight => "id" in h)
      .map((h) => h.id);

    const idsToDelete = originalIds.filter((id) => !currentIds.includes(id));
    const tagsToCreate = localHighlights.filter((h) => !("id" in h));

    try {
      // B. API 호출
      const deletePromises = idsToDelete.map((tagId) =>
        deleteTaggingMutation.mutateAsync({ memoId: noteId, taggingId: tagId })
      );
      const createPromises = tagsToCreate.map((tag) =>
        createTaggingMutation.mutateAsync(tag as Omit<Highlight, "id">)
      );

      await Promise.all(deletePromises);
      const createResults = await Promise.all(createPromises);

      // C. 통나무 보상 체크
      const hasReward = createResults.some((res) => res.log_result?.success);
      if (hasReward) {
        openLogAcquiredModal("이 프로젝트"); // (TODO: 실제 프로젝트명 필요)
      }
    } catch (e) {
      console.error(e);
      alert("태그 저장 중 오류가 발생했습니다.");
    } finally {
      onClose();
    }
  };

  // --- 핸들러: 로컬 태그 추가 ---
  const handleLocalCreateTag = (
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    if (mode !== "EDIT_TAGS") return;

    const textarea = e.currentTarget;
    const start = Math.min(textarea.selectionStart, textarea.selectionEnd);
    const end = Math.max(textarea.selectionStart, textarea.selectionEnd);

    if (activeCategory && start !== end) {
      const text = content.slice(start, end);

      // 겹치는 태그 제거 (덮어쓰기)
      const nonOverlapping = localHighlights.filter((hl) => {
        return hl.endIndex <= start || hl.startIndex >= end;
      });

      const newTag: Omit<Highlight, "id"> = {
        category: activeCategory,
        startIndex: start,
        endIndex: end,
        text: text,
      };

      setLocalHighlights([...nonOverlapping, newTag]);
      editorActions.setActiveCategory(null);
    }
  };

  // --- 핸들러: 로컬 태그 삭제 ---
  const removeTagByStart = (startIndex: number) => {
    if (mode !== "EDIT_TAGS") return;
    setLocalHighlights((prev) =>
      prev.filter((h) => h.startIndex !== startIndex)
    );
  };

  // --- 시간 포맷팅 ---
  const { datePart, timePart, projectName } = useMemo(() => {
    const dateToFormat = noteData ? new Date(noteData.updatedAt) : new Date();

    const datePart = `${
      dateToFormat.getMonth() + 1
    }월 ${dateToFormat.getDate()}일 기록`;
    const timePart = `${dateToFormat.getHours()}:${String(
      dateToFormat.getMinutes()
    ).padStart(2, "0")}`;

    // [핵심] 캐시된 프로젝트 목록에서 이름 찾기
    let projName = "프로젝트";
    if (noteData) {
      // "projects" 키로 캐시된 데이터를 가져옵니다.
      const projects = queryClient.getQueryData<ProjectEvent[]>(["projects"]);

      // ID가 일치하는 프로젝트를 찾습니다.
      const foundProject = projects?.find((p) => p.id === noteData.projectId);

      if (foundProject) {
        projName = foundProject.title;
      }
    }

    return { datePart, timePart, projectName: projName };
  }, [noteData, queryClient]); // queryClient 의존성 추가

  if (isLoadingNote && !noteData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} width={335}>
        <div>Loading...</div>
      </Modal>
    );
  }

  const isMutating =
    updateMemoMutation.isPending ||
    createTaggingMutation.isPending ||
    deleteTaggingMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={335}>
      <CloseButton onClick={onClose}>
        <X size={24} />
      </CloseButton>

      <ContentContainer>
        <Header>[{projectName}]</Header>
        <Header>
          {datePart} <TimeText>{timePart}</TimeText>
        </Header>

        <TabContainer>
          <TabButton
            $active={mode === "EDIT_TEXT"}
            onClick={() => setMode("EDIT_TEXT")}
          >
            글 수정
          </TabButton>
          <TabButton
            $active={mode === "EDIT_TAGS"}
            onClick={() => setMode("EDIT_TAGS")}
          >
            태그 달기
          </TabButton>
        </TabContainer>

        {mode === "EDIT_TAGS" && (
          <TagButtons>
            <TagButton
              $active={activeCategory === "PROBLEM"}
              onClick={() => editorActions.setActiveCategory("PROBLEM")}
              color="#FFEC5E"
            >
              문제
            </TagButton>
            <TagButton
              $active={activeCategory === "IDEA"}
              onClick={() => editorActions.setActiveCategory("IDEA")}
              color="#FF83CD"
            >
              아이디어
            </TagButton>
            <TagButton
              $active={activeCategory === "SOLUTION"}
              onClick={() => editorActions.setActiveCategory("SOLUTION")}
              color="#89F3FF"
            >
              해결
            </TagButton>
          </TagButtons>
        )}
        {mode === "EDIT_TEXT" && <div style={{ height: "32px" }} />}

        <EditorWrapper>
          {mode === "EDIT_TAGS" && (
            <HighlightRenderer
              content={content}
              highlights={localHighlights}
              onTagClick={removeTagByStart}
            />
          )}
          <NoteEditor
            value={content}
            onChange={(e) => mode === "EDIT_TEXT" && setContent(e.target.value)}
            onSelect={handleLocalCreateTag}
            spellCheck="false"
            disabled={isMutating}
            $isTagMode={mode === "EDIT_TAGS"}
            // readOnly={mode === "EDIT_TAGS"} // readOnly를 쓰면 모바일에서 키보드가 안 뜸 (Good)
            // 하지만 일부 브라우저에서 선택(드래그)도 막힐 수 있으므로 주의.
            // 여기서는 onChange 제어로 처리함.
          />
        </EditorWrapper>

        <Footer>
          {mode === "EDIT_TEXT" ? (
            // 1. (수정) 글 수정 모드일 때: 취소 / 저장 버튼 (두 개로 나눔)
            <>
              <CancelButton onClick={() => setMode("EDIT_TAGS")}>
                취소
              </CancelButton>
              <SubmitButton onClick={handleSaveText} disabled={isMutating}>
                {updateMemoMutation.isPending ? "저장 중..." : "수정 완료"}
              </SubmitButton>
            </>
          ) : (
            // 2. (수정) 태그 모드일 때: 닫기 버튼 (SubmitButton 하나만 꽉 차게 사용하거나, FullWidthButton 사용)
            // 여기서는 디자인 일관성을 위해 SubmitButton을 재활용하거나 FullWidthButton을 유지할 수 있습니다.
            // 에러를 없애기 위해 SubmitButton을 활용하는 예시입니다.
            <SubmitButton
              onClick={handleSaveTagsAndClose}
              disabled={isMutating}
              style={{ gridColumn: "1 / -1" }} // ⬅️ 그리드 전체 너비 차지하게
            >
              {isMutating ? "저장 중..." : "저장 및 닫기"}
            </SubmitButton>
          )}
        </Footer>
      </ContentContainer>
    </Modal>
  );
};

export default NoteDetailModal;

// --- Helper Components ---

const categoryColors: Record<HighlightCategory, string> = {
  PROBLEM: "rgba(255, 236, 94, 0.7)",
  IDEA: "rgba(255, 131, 205, 0.7)",
  SOLUTION: "rgba(137, 243, 255, 0.7)",
};

const HighlightRenderer = ({
  content,
  highlights,
  onTagClick,
}: {
  content: string;
  highlights: (Highlight | Omit<Highlight, "id">)[];
  onTagClick: (startIndex: number) => void;
}) => {
  const sortedHighlights = [...highlights].sort(
    (a, b) => a.startIndex - b.startIndex
  );
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  sortedHighlights.forEach((hl, idx) => {
    if (hl.startIndex > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {content.slice(lastIndex, hl.startIndex)}
        </span>
      );
    }
    parts.push(
      <HighlightMark
        key={`mark-${hl.startIndex}-${idx}`}
        category={hl.category}
        onMouseDown={(e) => {
          e.stopPropagation();
          onTagClick(hl.startIndex);
        }}
      >
        {content.slice(hl.startIndex, hl.endIndex)}
      </HighlightMark>
    );
    lastIndex = hl.endIndex;
  });

  if (lastIndex < content.length) {
    parts.push(<span key="text-end">{content.slice(lastIndex)}</span>);
  }

  return <RendererContainer>{parts}</RendererContainer>;
};

// --- Styles ---

const EditorWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background-color: white;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const RendererContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 12px;
  font-size: 18px;
  line-height: 1.5;
  box-sizing: border-box;
  white-space: pre-wrap;
  pointer-events: none;
`;

const NoteEditor = styled.textarea<{ $isTagMode?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 12px;
  font-size: 18px;
  line-height: 1.5;
  box-sizing: border-box;
  resize: none;
  border: none;
  outline: none;
  background: transparent;
  color: transparent;
  caret-color: black;

  ${({ $isTagMode }) =>
    $isTagMode &&
    css`
      z-index: 0;
      color: transparent;
    `}
  ${({ $isTagMode }) =>
    !$isTagMode &&
    css`
      z-index: 2;
      color: black;
    `}
`;

const HighlightMark = styled.mark<{ category: HighlightCategory }>`
  background-color: ${({ category }) => categoryColors[category] || "yellow"};
  border-radius: 3px;
  cursor: pointer;
  pointer-events: auto;
  &:hover {
    filter: brightness(0.9);
  }
`;

const TagButtons = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 30px;
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
  color: #969696;
`;

const Header = styled.div`
  font-size: 20px;
  color: black;
  margin-top: -8px;
`;

const TimeText = styled.span`
  font-size: 12px;
  padding-left: 4px;
  color: #969696;
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
  background: ${({ $active, color }) => ($active ? color : "#EEEEEE")};
  color: ${({ $active }) => ($active ? "black" : "#969696")};
  border: 1px solid ${({ $active }) => ($active ? "#909090" : "#DDDDDD")};
`;

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

// const FullWidthButton = styled.button`
//   width: 100%;
//   height: 48px;
//   border-radius: 12px;
//   background-color: ${({ theme }) => theme.colors.primary};
//   color: white;
//   border: none;
//   font-size: 16px;
//   font-weight: bold;
//   cursor: pointer;
//   font-family: ${({ theme }) => theme.fonts.primary};
//   &:disabled {
//     opacity: 0.5;
//   }
// `;

const SubmitButton = styled(CancelButton)`
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  color: white;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 12px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: none;
  background: none;
  font-size: 16px;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: ${({ $active }) => ($active ? "bold" : "normal")};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : "#999")};
  cursor: pointer;
  padding: 4px 8px;
  border-bottom: 2px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : "transparent")};
  transition: all 0.2s;
`;
