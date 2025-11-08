import { useState } from "react";
import styled from "styled-components";
import { useProjectQuery } from "../../../lib/api/projectApi";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";

// 0. (임시) 모달 컴포넌트 - 나중에 분리하세요.
const CreateProjectModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>새 프로젝트 만들기</h2>
        <p>프로젝트 생성 폼이 여기에 들어갑니다.</p>
        <button onClick={onClose}>닫기</button>
      </ModalContent>
    </ModalBackdrop>
  );
};

const ProjectSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Query로 프로젝트 목록 가져오기
  const { data: projects, isLoading } = useProjectQuery();

  //Zustand 활성 프로젝트 ID
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  const { setActiveProjectId } = useCalendarActions();

  if (isLoading) {
    return <Wrapper>프로젝트 로딩 중...</Wrapper>;
  }

  return (
    <Wrapper>
      <ProjectList>
        {projects?.map((project) => (
          <ProjectButton
            key={project.id}
            isActive={project.id === activeProjectId}
            onClick={() => setActiveProjectId(project.id)}
          >
            {project.title}
          </ProjectButton>
        ))}
      </ProjectList>

      {/* + 버튼 */}
      <AddButton onClick={() => setIsModalOpen(true)}>+</AddButton>

      {/* 모달 */}
      {isModalOpen && (
        <CreateProjectModal onClose={() => setIsModalOpen(false)} />
      )}
    </Wrapper>
  );
};

export default ProjectSelector;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box; // ⬅️ padding을 줘도 width 100% 유지
`;

const ProjectList = styled.div`
  flex: 1; // ⬅️ '+' 버튼을 제외한 모든 공간을 차지
  display: flex;
  gap: 8px; // 버튼 사이 간격
  overflow-x: auto; // ⬅️ 핵심: 내용이 넘치면 가로 스크롤
  white-space: nowrap; // ⬅️ 버튼들이 한 줄로 나열됨

  /* 스크롤바 숨기기 (디자인을 위해) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

// 'isActive' prop에 따라 스타일이 바뀌는 버튼
const ProjectButton = styled.button<{ isActive: boolean }>`
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid;

  /* ⬇️ 활성화 여부에 따라 다른 스타일 적용 */
  border-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "#ddd"};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "white"};
  color: ${({ isActive }) => (isActive ? "white" : "black")};

  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
  cursor: pointer;

  /* 버튼의 최소 크기를 보장 (내용이 짧아도) */
  min-width: 60px;
`;

const AddButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px dashed #aaa;
  background-color: #f5f5f5;
  margin-left: 12px; // ⬅️ 스크롤 영역과 간격
  cursor: pointer;
  font-size: 20px;
  color: black;

  /* ⬇️ flex: 1 때문에 줄어들지 않도록 고정 */
  flex-shrink: 0;
`;

// (임시) 모달 스타일
const ModalBackdrop = styled.div`
  position: fixed; // ⬅️ max-width(375px)를 벗어나 전체 화면을 덮음
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
`;
