import { useState } from "react";
import styled from "styled-components";
import { useProjectQuery } from "../../../lib/api/projectApi";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";
import { Plus } from "lucide-react";

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
      <AddButton onClick={() => setIsModalOpen(true)}>
        <Plus size={20} />
      </AddButton>

      {/* 모달창 수정 후 추가 */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(payload) => console.log("새 프로젝트 생성:", payload)}
      />
    </Wrapper>
  );
};

// 수정사항 반영
export default ProjectSelector;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  /* border-bottom: 1px solid #eee; ⬅️ 제거 (시안에 없음) */
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.bodyBg};
`;

const ProjectList = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// 'isActive' prop에 따라 스타일이 바뀌는 버튼
const ProjectButton = styled.button<{ isActive: boolean }>`
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid;
  cursor: pointer;

  border-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "#E0E0E0"}; // 연한 테두리
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "white"};
  color: ${({ isActive, theme }) =>
    isActive ? "white" : theme.colors.textSecondary};

  font-family: ${({ theme }) => theme.fonts.primary}; // ⬅️ 폰트 적용
  font-weight: ${({ isActive }) => (isActive ? "bold" : "normal")};
  cursor: pointer;

  /* 버튼의 최소 크기를 보장 (내용이 짧아도) */
  // min-width: 60px;
`;

const AddButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px dashed ${({ theme }) => theme.colors.primary};
  background-color: white;
  margin-left: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;

  /* ⬇️ 아이콘을 버튼 중앙에 배치 */
  display: flex;
  align-items: center;
  justify-content: center;
`;
