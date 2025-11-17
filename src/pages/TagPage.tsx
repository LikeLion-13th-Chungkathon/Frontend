import ProjectSelector from "../components/domain/Home/ProjectSelector";
import styled from "styled-components";
import houseBackground from "../assets/images/tagbackground.png";
import LogHouseImg1 from "../assets/images/loghouse1.png";
import LogHouseImg2 from "../assets/images/loghouse2.png";
import LogHouseImg3 from "../assets/images/loghouse3.png";
import FireProgress from "../components/common/FireProgress";

import TagResult from "../components/domain/tag/TagResult";
import { useMemo, useState } from "react";
import TagStatusSheet from "../components/domain/tag/TagStatusSheet";
import NoteDetailModal from "../components/domain/Home/NoteDetailModal";

// API 훅 & zustand 스토어 추가
import useCalendarStore from "../store/useCalendarStore";
import { useReviewsQuery } from "../lib/api/reviewApi";
import useAuthStore from "../store/useAuthStore";

const TagPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 노트 모달 상태
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // 1) 현재 활성 프로젝트 ID
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);

  console.log("[TagPage] activeProjectId =", activeProjectId);

  // 1-1) 프로젝트가 아직 선택 안 된 경우 → 그냥 안내만 띄우고 API 호출 안 함
  if (!activeProjectId) {
    return (
      <Wrapper>
        <HouseBackground>
          <ProjectSelector />
          <Title>먼저 프로젝트를 선택해주세요 🏠</Title>
        </HouseBackground>
      </Wrapper>
    );
  }

  // 2) 리뷰 API 호출 (projectId가 있을 때만)
  const {
    data: reviewData,
    isLoading,
    isError,
  } = useReviewsQuery(activeProjectId);

  console.log("[TagPage] reviewData =", reviewData);
  console.log("[TagPage] isError =", isError);

  //progress 퍼센트 3개로 나눠서
  const getHouseImage = (progress: number) => {
    if (progress < 34) return LogHouseImg1;
    if (progress < 67) return LogHouseImg2;
    return LogHouseImg3;
  };

  // 3) API 데이터 기반으로 변수들 계산
  const { teamProgress, problemLogs, ideaLogs, solutionLogs } = useMemo(() => {
    if (!reviewData)
      return {
        teamProgress: null,
        problemLogs: [],
        ideaLogs: [],
        solutionLogs: [],
      };

    const pLogs = reviewData.myHighlights
      .filter((h) => h.category === "PROBLEM")
      .map((h) => ({ noteId: h.memoId! }));

    const iLogs = reviewData.myHighlights
      .filter((h) => h.category === "IDEA")
      .map((h) => ({ noteId: h.memoId! }));

    const sLogs = reviewData.myHighlights
      .filter((h) => h.category === "SOLUTION")
      .map((h) => ({ noteId: h.memoId! }));

    return {
      teamProgress: reviewData.teamProgress,
      problemLogs: pLogs,
      ideaLogs: iLogs,
      solutionLogs: sLogs,
    };
  }, [reviewData]);

  const progressPercentage = teamProgress?.progressPercent || 0;

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  const handleClickLog = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setSelectedNoteId(null);
  };

  // 유저 정보
  const user = useAuthStore((s) => s.user);
  const nickname = user?.name ?? "사용자";

  // 4) 로딩 / 에러 처리
  if (isLoading) {
    return (
      <Wrapper>
        <HouseBackground>
          <ProjectSelector />
          <Title>통나무집 로딩 중... 🔥</Title>
        </HouseBackground>
      </Wrapper>
    );
  }

  if (isError || !teamProgress || !reviewData) {
    return (
      <Wrapper>
        <HouseBackground>
          <ProjectSelector />
          <Title>회고 데이터를 불러오지 못했어요 🥲</Title>
        </HouseBackground>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <HouseBackground>
        <ProjectSelector />
        <TitleContainer>
          <Title>[{teamProgress.projectName}] 팀의 통나무집</Title>
          <CountContainer>
            <CountBox>
              <CountTextBox>🪵 {teamProgress.teamLogCount}</CountTextBox>
            </CountBox>
            <CountBox>
              <CountTextBox>👤 {teamProgress.teamMemberCount}</CountTextBox>
            </CountBox>
          </CountContainer>

          <LogHouseImg
            src={getHouseImage(progressPercentage)}
            onClick={openSheet}
          />

          <FireProgress value={progressPercentage} size="tag" />
        </TitleContainer>
      </HouseBackground>

      <Title>
        {nickname}의 [{teamProgress.projectName}] 회고
      </Title>

      <TagResultBox>
        <TagResult
          variant="problem"
          title="문제"
          logs={problemLogs}
          onClickLog={handleClickLog}
        />
        <TagResult
          variant="idea"
          title="아이디어"
          logs={ideaLogs}
          onClickLog={handleClickLog}
        />
        <TagResult
          variant="solution"
          title="해결"
          logs={solutionLogs}
          onClickLog={handleClickLog}
        />
      </TagResultBox>

      <TagStatusSheet
        open={isSheetOpen}
        onClose={closeSheet}
        projectId={activeProjectId}
        projectTitle={teamProgress.projectName}
        progress={progressPercentage}
        totalRequiredLogs={teamProgress.totalLogsForCompletion}
        currentLogs={teamProgress.teamLogCount}
      />

      <NoteDetailModal
        isOpen={isNoteModalOpen}
        noteId={selectedNoteId}
        onClose={closeNoteModal}
      />
    </Wrapper>
  );
};

export default TagPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto;
  padding-bottom: 68px;
  gap: 12px;
`;

const HouseBackground = styled.div`
  width: 375px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  flex-shrink: 0;
  margin-bottom: 20px;

  background: url(${houseBackground}) center/cover no-repeat,
    linear-gradient(
      180deg,
      #fff7ed 18.27%,
      rgba(148, 235, 246, 0.8) 66.35%,
      rgba(127, 209, 114, 0.8) 82.21%,
      #fff7ed 100%
    );

  background-size: 100%, cover;
  background-position: calc(50%) calc(100% - 64px), center;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 257px;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin-top: 32px;
`;

const Title = styled.div`
  align-self: stretch;
  color: #000;
  text-align: center;
  font-family: LeeSeoyun;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const CountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountBox = styled.div`
  width: 46px;
  height: 23px;
  flex-shrink: 0;
  border-radius: 11.5px;
  border: 1px solid var(--main, #ca8853);
  background: #fff;
`;

const CountTextBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;

  color: #684f3c;
  text-align: center;
  font-family: LeeSeoyun;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const LogHouseImg = styled.img`
  margin-top: 28px;
  margin-bottom: 24px;
  width: 292px;
  height: 210px;
  transform: scale(1.05);
  flex-shrink: 0;
  aspect-ratio: 146 / 105;
`;

const TagResultBox = styled.div`
  display: flex;
  width: 352px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;
