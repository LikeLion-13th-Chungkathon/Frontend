import { useState } from "react";
import styled from "styled-components";
import { useProjectsQuery } from "../../../lib/api/projectApi";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";
import { Plus } from "lucide-react";

import CreateProjectModal from "../Project/CreateProjectModal";

const ProjectSelector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // React Query로 프로젝트 목록 가져오기
  const { data: projects, isLoading } = useProjectsQuery();

  if (!isLoading && (!projects || projects.length === 0)) {
    return (
      <EmptyWrapper>
        <EmptyText>프로젝트를 등록하고 매일을 기록해보세요!</EmptyText>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
        </AddButton>
        {isModalOpen && (
          <CreateProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </EmptyWrapper>
    );
  }

  if (isLoading) {
    return <Wrapper>프로젝트 로딩 중...</Wrapper>;
  }

  //Zustand 활성 프로젝트 ID
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  const { setActiveProjectId } = useCalendarActions();

  return (
    <Wrapper>
      <ProjectList>
        {projects?.map((project) => (
          <ProjectButton
            key={project.id}
            isActive={project.id === activeProjectId}
            onClick={() => setActiveProjectId(project.id)}
            title={project.title} // ⬅️ (기능 1) 마우스 올리면 전체 제목 툴팁
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
  gap: 10px;
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
  padding: 4px 11px;
  border-radius: 20px;
  border: none;
  cursor: pointer;

  border-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "#C5C5C5"}; // 연한 테두리
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary : "#C5C5C5"};
  color: ${({ isActive, theme }) =>
    isActive ? "white" : theme.colors.textSecondary};

  font-family: ${({ theme }) => theme.fonts.primary}; // ⬅️ 폰트 적용
  font-weight: 400;
  cursor: pointer;

  max-width: 100px; // ⬅️ 최대 너비 지정 (적절히 조절)
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; // ⬅️ ... 처리
`;

const AddButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.primary};
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

// (기능 2) 프로젝트 없을 때 UI
const EmptyWrapper = styled(Wrapper)`
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  height: 115px; // 시안 높이
  background-color: #fff7ed; // (또는 theme.colors.bodyBg)
  border: 1px solid #ca8853; // 테두리
  border-radius: 12px;
`;
const EmptyText = styled.div`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;
