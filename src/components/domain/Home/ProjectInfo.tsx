import styled from "styled-components";
import type { ProjectEvent } from "../../../types";

// 프로젝트 인포 컴포넌트

/** (예: "2025-10-29" -> "25.10.29") */
const formatShortDate = (dateStr: string) => {
  return dateStr.slice(2).replace(/-/g, ".");
};

/** D-day 계산기 */
const calculateDday = (endDate: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 오늘 날짜의 0시 0분 0초
  const end = new Date(endDate);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "D-Day";
  if (diffDays < 0) return `D+${Math.abs(diffDays)}`; // 마감일 지남
  return `D-${diffDays}`;
};

/** 진행률(%) 계산기 */
const calculateProgress = (startDate: string, endDate: string): number => {
  const today = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  const totalDuration = end - start;
  if (totalDuration <= 0) return 0; // 기간 설정 오류 방지

  const elapsedDuration = today - start;

  // 진행률 계산
  const progress = (elapsedDuration / totalDuration) * 100;

  // 0% 미만, 100% 초과 방지
  return Math.max(0, Math.min(100, progress));
};

// --- 메인 컴포넌트 ---

interface ProjectInfoProps {
  project: ProjectEvent;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  // 1. 계산 함수들 호출
  const period = `${formatShortDate(project.startDate)}-${formatShortDate(
    project.endDate
  )}`;
  const dDay = calculateDday(project.endDate);
  const progressPercent = calculateProgress(project.startDate, project.endDate);

  return (
    <Wrapper>
      {/* 1. 상단 정보 (기간, D-day, 인원) */}
      <InfoRow>
        <InfoChip>{period}</InfoChip>
        <InfoChip>{dDay}</InfoChip>
        <InfoChip>👥 {project.memberCount}명</InfoChip>
      </InfoRow>

      {/* 2. 프로젝트 제목 */}
      <Title>{project.title}</Title>

      {/* 3. 진행률 그래프 */}
      <ProgressContainer>
        <ProgressBar>
          {/* 채워지는 바 (width가 %로 조절됨) */}
          <ProgressFill style={{ width: `${progressPercent}%` }} />
        </ProgressBar>
        {/* 불꽃 아이콘 (left가 %로 조절됨) */}
        <FlameIcon style={{ left: `${progressPercent}%` }}>🔥</FlameIcon>
      </ProgressContainer>
    </Wrapper>
  );
};

export default ProjectInfo;

// --- 스타일 정의 ---

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap; // 혹시 좁아지면 줄바꿈
  gap: 6px;
  margin-bottom: 8px;
`;

const InfoChip = styled.span`
  background-color: #f1f1f1;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: #555;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
  color: #000;
`;

const ProgressContainer = styled.div`
  position: relative; // ⬅️ 불꽃 아이콘의 기준점이 됨
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 0; // 불꽃이 잘리지 않게 상하 여백
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: #e0e0e0; // ⬅️ 전체 바
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${({ theme }) =>
    theme.colors.primary}; // ⬅️ 채워지는 바 (테마 색상)
  border-radius: 3px;
  transition: width 0.4s ease-out; // 부드럽게 움직이도록
`;

const FlameIcon = styled.span`
  position: absolute;
  top: 0; // ProgressContainer의 중앙
  font-size: 20px;

  /* ⬇️ 핵심: 아이콘의 정중앙이 left % 지점에 오도록 함 */
  transform: translateX(-50%);

  transition: left 0.4s ease-out; // 부드럽게 움직이도록
`;
