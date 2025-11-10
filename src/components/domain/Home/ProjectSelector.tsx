import { useState } from "react";
import styled from "styled-components";
import { useProjectQuery } from "../../../lib/api/projectApi";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";
import CreateProjectModal from "../Project/CreateProjectModal";

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

      {/* 모달창 수정 후 추가 */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(payload) => console.log("새 프로젝트 생성:", payload)}
      />
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
