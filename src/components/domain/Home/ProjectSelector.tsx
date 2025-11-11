import { useState } from "react";
import styled from "styled-components";
import { useProjectQuery } from "../../../lib/api/projectApi";
import useCalendarStore, {
  useCalendarActions,
} from "../../../store/useCalendarStore";
import { Plus } from "lucide-react";

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
      <AddButton onClick={() => setIsModalOpen(true)}>
        <Plus size={20} />
      </AddButton>

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
  font-weight: 500;
  min-width: 60px;
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
