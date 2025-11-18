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
import { useMyInfoQuery } from "../lib/api/authApi";

const TagPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // 노트 모달 상태
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // 로그인 유저 정보
  const {
    data: me,
    isLoading: isMyLoading,
    isError: isMyError,
    error: myError,
  } = useMyInfoQuery();

  console.log("[TagPage] me =", me);
  console.log("[TagPage] isMyError =", isMyError, myError);

  // 3. (추가) Zustand 스토어에서 현재 활성 프로젝트 ID 가져오기
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  // 4. (추가) 실제 API 호출
  const {
    data: reviewData,
    isLoading,
    isError,
  } = useReviewsQuery(activeProjectId);

  console.log("[TagPage] activeProjectId =", activeProjectId);
  console.log("[TagPage] reviewData =", reviewData);
  console.log("[TagPage] isError =", isError);

  //progress 퍼센트 3개로 나눠서
  const getHouseImage = (progress: number) => {
    if (progress < 34) return LogHouseImg1;
    if (progress < 67) return LogHouseImg2;
    return LogHouseImg3;
  };

  // API 데이터 기반으로 변수들 계산
  const { teamProgress, problemLogs, ideaLogs, solutionLogs } = useMemo(() => {
    if (!reviewData)
      return {
        teamProgress: null,
        problemLogs: [],
        ideaLogs: [],
        solutionLogs: [],
      };

    // 5-1. 하이라이트 배열을 카테고리별로 필터링
    const pLogs = reviewData.myHighlights
      .filter((h) => h.category === "PROBLEM")
      .map((h) => ({ noteId: h.memoId! })); // ⬅️ TagResult가 원하는 타입으로 매핑

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

  // API에서 받은 진행률 사용
  const progressPercentage = teamProgress?.progressPercent || 0;

  const openSheet = () => setIsSheetOpen(true);
  const closeSheet = () => setIsSheetOpen(false);

  // 통나무(개별 로그) 클릭 → noteId로 모달 열기
  const handleClickLog = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsNoteModalOpen(true);
  };

  const closeNoteModal = () => {
    setIsNoteModalOpen(false);
    setSelectedNoteId(null);
  };

  // // 유저 정보
  // const user = useAuthStore((s) => s.user);
  // const nickname = user?.name ?? "사용자";

  // console.log("[TagPage] user from store =", user);
  // console.log("[TagPage] nickname used in title =", nickname);

  // 로딩 / 에러 처리에서 myInfo까지 같이 봐주기
  // if (isMyLoading || isLoading) return <Wrapper>Loading...</Wrapper>;
  // if (isMyError || !me || isError || !teamProgress || !reviewData) {
  //   return <Wrapper>Error...</Wrapper>;
  // }

  // 1) 유저 정보 로딩
  if (isMyLoading) return <Wrapper>Loading...</Wrapper>;

  // 2) 유저 정보 에러
  if (isMyError || !me) return <Wrapper>유저 정보 에러</Wrapper>;

  // 3) 아직 활성 프로젝트가 없거나 / 리뷰가 아직 안 온 상태
  //   → 상단에 ProjectSelector만 보여주기 (홈이랑 느낌 같게)
  if (!activeProjectId || isLoading || !reviewData || !teamProgress) {
    return (
      <Wrapper>
        <HouseBackground>
            <ProjectSelector />
            <EmptyHouseSpace /> 
        </HouseBackground>
        <EmptyReviewText>작성된 회고가 없습니다.</EmptyReviewText>
      </Wrapper>
    );
  }

  // 4) 진짜 API 에러일 때만 Error...
  if (isError) return <Wrapper>Error...</Wrapper>;

  const nickname = me.nickname;

  return (
    <Wrapper>
      <HouseBackground>
        <ProjectSelector />
        <TitleContainer>
          {/* 실제데이터로 교체 */}
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
        // 12. (수정) 실제 데이터 props로 전달
        projectId={activeProjectId} // ⬅️ 시트가 API를 호출하도록 ID 전달
        projectTitle={teamProgress.projectName}
        progress={progressPercentage}
        totalRequiredLogs={teamProgress.totalLogsForCompletion}
        currentLogs={teamProgress.teamLogCount}
      />

      {/* 개별 통나무 클릭시 노트 모달 */}
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
  height: 100%; // 부모(AppLayout)가 준 높이 꽉 채우기
  display: flex;
  flex-direction: column;
  align-items: center; // 가운데 정렬은 가로만
  justify-content: flex-start; // 위에서부터 쌓이게
  overflow-y: auto; // 내용 길어지면 여기서 스크롤
  padding-bottom: 68px; // 바텀탭/네브에 안 가리게 여백
  gap: 12px;
`;

const HouseBackground = styled.div`
  width: 375px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; // 위에서부터 쌓이게
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

const LogHouseImg = styled.img`
  margin-top: 28px;
  margin-bottom: 24px;
  width: 292px;
  height: 210px;
  transform: scale(1.05);
  /* transform-origin: center; */
  flex-shrink: 0;
  aspect-ratio: 146/105;
`;

const TagResultBox = styled.div`
  display: flex;
  width: 352px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
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

const EmptyHouseSpace = styled.div`
  width: 100%;
  height: 260px;
  flex-shrink: 0;
`;

const EmptyReviewText = styled.div`
  color: #969696;
  text-align: center;
  font-family: LeeSeoyun;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 8px;
`;