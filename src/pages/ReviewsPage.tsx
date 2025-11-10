import styled from "styled-components";
import { useReviewsQuery } from "../lib/api/reviewApi";
import useCalendarStore from "../store/useCalendarStore";

const ReviewsPage = () => {
  // 현재 활성 프로젝트 ID 가져오기
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);

  // React Query로 리뷰 데이터 가져오기
  const { data: reviewData, isLoading } = useReviewsQuery(activeProjectId);

  if (isLoading) {
    return (
      <Wrapper>
        <div>리뷰 불러오는 중...</div>
      </Wrapper>
    );
  }
  if (!reviewData) {
    return (
      <Wrapper>
        <div>데이터가 없습니다.</div>
      </Wrapper>
    );
  }

  const { teamProgress, myHighlights } = reviewData;

  // 하이라이트 데이터를 카테고리로 필터링
  const problemLogs = myHighlights.filter((h) => h.category === "PROBLEM");
  const ideaLogs = myHighlights.filter((h) => h.category === "IDEA");
  const solutionLogs = myHighlights.filter((h) => h.category === "SOLUTION");

  return (
    <Wrapper>
      {/* 팀 통나무 */}
      <TeamProgressHouse progress={teamProgress} />

      <SectionTitle>
        {/* 사용자 이름 */} 님의 [{teamProgress.projectName}] 회고
      </SectionTitle>

      {/* 개인 노트 로그 */}
      <LogCategoryBox color="#FFEC5E">
        {problemLogs.map((log) => (
          <LogItem key={log.id} />
        ))}
      </LogCategoryBox>
      <LogCategoryBox color="#FF83CD">
        {ideaLogs.map((log) => (
          <LogItem key={log.id} />
        ))}
      </LogCategoryBox>
      <LogCategoryBox color="#86FF7B">
        {solutionLogs.map((log) => (
          <LogItem key={log.id} />
        ))}
      </LogCategoryBox>
    </Wrapper>
  );
};

export default ReviewsPage;

// --- 하위 컴포넌트들 ---
const TeamProgressHouse = ({ progress }: { progress: any }) => {
  const percent =
    (progress.teamLogCount / progress.totalLogsForCompletion) * 100;
  return (
    <TeamWrapper>
      <h3>[{progress.projectName}] 팀의 통나무집</h3>
      {/* (통나무/사람 아이콘...) */}
      <HouseImage /> {/* (집 아이콘) */}
      <ProgressBar percent={percent} />
    </TeamWrapper>
  );
};

// --- 스타일 ---
const Wrapper = styled.div`
  padding: 16px;
`;

const TeamWrapper = styled.div`
  /* ... */
`;
const HouseImage = styled.div`
  /* (집 아이콘 스타일) */
`;

const ProgressBar = styled.div<{ percent: number }>`
  width: 100%;
  height: 10px;
  background-color: #eee;
  /* (::before 가상 요소를 사용해 percent만큼 채우기) */
`;
const SectionTitle = styled.h4`
  margin: 20px 0;
`;
const LogCategoryBox = styled.div<{ color: string }>`
  background-color: ${(p) => p.color};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const LogItem = styled.div`
  width: 40px;
  height: 40px;
  /* (기획안의 '나이테' 아이콘/스타일) */
  background-image: url(...);
  border-radius: 50%;
`;
