import { useNavigate } from "react-router-dom";
import useCalendarStore from "../store/useCalendarStore";
import { useEditorStore } from "../store/useEditorStore";
import { useProjectQuery } from "../lib/api/projectApi";
import { useMemo, useState } from "react";
import { useCreateNoteMutation } from "../lib/api/noteApi";
import type { Highlight, HighlightCategory } from "../types";
import styled from "styled-components";

// 노트 페이지
const CreateNotePage = () => {
  const navigate = useNavigate();

  // zustand에서 ProjectId & 에디터 상태 가져오기
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  const { activeCategory, actions: editorActions } = useEditorStore();

  // 프로젝트 이름 찾기 (API 캐시 재활용)
  const { data: projects } = useProjectQuery();
  const project = projects?.find((p) => p.id === activeProjectId);

  // 해당 페이지의 로컬 상태
  const defaultText = `${
    project?.title || "이"
  } 프로젝트 진행 중에 떠오른 생각을 적어주세요!`;
  const [content, setContent] = useState(defaultText);
  const [highlights, setHighlights] = useState<Omit<Highlight, "id">[]>([]);

  // API 뮤데이션 훅
  const createNoteMutation = useCreateNoteMutation();

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

  // '완료' 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (!project) return;

    createNoteMutation.mutate(
      {
        projectId: project.id,
        content: content,
        highlights: highlights,
      },
      {
        onSuccess: () => {
          navigate("/home"); // 저장 성공 시 홈으로
        },
      }
    );
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

  return (
    <PageWrapper>
      <Card>
        <Header>
          [{project?.title || "프로젝트"}]의 {currentTime}
        </Header>

        <TagButtons>
          {/* 문제 버튼 */}
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

          {/*  해결 버튼 */}
          <TagButton
            color="#86FF7B"
            active={activeCategory === "SOLUTION"}
            onClick={() => editorActions.setActiveCategory("SOLUTION")}
          >
            해결
          </TagButton>
        </TagButtons>

        {/* 하이라이트 색깔 칠하기 */}
        <EditorWrapper>
          {/* 2. (뒤) 하이라이트를 실제로 렌더링하는 <div> */}
          <HighlightRenderer content={content} highlights={highlights} />

          {/* 3. (앞) 투명하지만 실제 입력과 선택을 담당하는 <textarea> */}
          <NoteEditor
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onSelect={handleTextSelect} // 하이라이트 로직 연결
            spellCheck="false"
          />
        </EditorWrapper>

        <Footer>
          <Button onClick={() => navigate(-1)}>취소</Button>
          <Button
            primary
            onClick={handleSubmit}
            disabled={createNoteMutation.isPending}
          >
            {createNoteMutation.isPending ? "저장 중..." : "완료"}
          </Button>
        </Footer>
      </Card>
    </PageWrapper>
  );
};

export default CreateNotePage;

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
  background-color: rgba(0, 0, 0, 0.4); // 뒷 배경 어둡게
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;
const Card = styled.div`
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
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
const TagButton = styled.button<{ color: string; active: boolean }>`
  background-color: ${(p) => p.color};
  border: 2px solid
    ${(p) => (p.active ? p.theme.colors.primary : "transparent")};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
`;

const Button = styled.button<{ primary?: boolean }>`
  /* (버튼 스타일링...) */
`;
