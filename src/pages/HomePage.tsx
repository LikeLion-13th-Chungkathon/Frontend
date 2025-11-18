import { useEffect, useState } from "react";
import styled from "styled-components";

// 4단계에서 만든 하위 컴포넌트들
import ProjectSelector from "../components/domain/Home/ProjectSelector";
import ProjectInfo from "../components/domain/Home/ProjectInfo";
import HomeCalendar from "../components/domain/Home/HomeCalendar";
import NotePreviewList from "../components/domain/Home/NotePreviewList";
import NoteDetailModal from "../components/domain/Home/NoteDetailModal";

// 5단계에서 만들 공통 컴포넌트
// import TabBar from '../components/common/Layout/TabBar';

// 1, 3단계에서 만든 훅
import useCalendarStore, {
  useCalendarActions,
} from "../store/useCalendarStore";
import { useProjectsQuery } from "../lib/api/projectApi";

const HomePage = () => {
  // 1. React Query로 프로젝트 목록을 가져옵니다.
  const { data: projects, isLoading } = useProjectsQuery();

  // 2. Zustand에서 활성 프로젝트 ID와 액션을 가져옵니다.
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  const { setActiveProjectId } = useCalendarActions();

  // 모달 제어를 위한 상태
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // 3. 앱 로드 시, 첫 번째 프로젝트를 활성 프로젝트로 자동 설정합니다.
  useEffect(() => {
    if (!activeProjectId && projects && projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [projects, activeProjectId, setActiveProjectId]);

  // 4. 현재 활성화된 프로젝트 정보 찾기
  const activeProject = projects?.find((p) => p.id === activeProjectId);

  if (isLoading) {
    return <div>로딩 중...</div>; // (나중에 스켈레톤 UI로 대체)
  }

  return (
    <HomePageContainer>
      {/* 1. 프로젝트 선택기 */}
      <ProjectSelector />

      {/* 2. 프로젝트 정보 (활성 프로젝트가 있을 때만 표시) */}
      {activeProject && <ProjectInfo project={activeProject} />}

      {/* 3. 달력 (활성 프로젝트가 있을 때만 표시) */}
      {/* {activeProject && <HomeCalendar />} */}
      <HomeCalendar />

      {/* 4. 노트 미리보기 리스트 (날짜에 따라 자동 업데이트됨) */}
      <NotePreviewList
        // 3. (해결책) 'onNoteClick' prop을 전달합니다.
        //    "카드가 클릭되면, editingNoteId를 그 카드의 ID로 설정해라"
        onNoteClick={(noteId) => setEditingNoteId(noteId)}
      />

      {/* editingNoteId가 생기면 모달 렌더링 */}
      {editingNoteId && (
        <NoteDetailModal
          isOpen={!!editingNoteId} // noteId 있으면 true, 없으면 false
          noteId={editingNoteId} // noteId가 null이어도 전달
          onClose={() => setEditingNoteId(null)}
        />
      )}

      {/* 5. 하단 탭바 (별도 Layout으로 빠질 수도 있음) */}
      {/* <TabBar /> */}
    </HomePageContainer>
  );
};

export default HomePage;

const HomePageContainer = styled.div`
  width: 100%;
  height: 100%; // Layout 컴포넌트가 높이를 줬다고 가정
  display: flex;
  flex-direction: column;
  overflow-y: auto; // 내용이 길어지면 스크롤
  padding-bottom: 60px; // ⬅️ TabBar 높이만큼 여백

  &::-webkit-scrollbar {
    display: none;
  }
`;
