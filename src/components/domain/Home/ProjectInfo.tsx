import styled from "styled-components";
import type { ProjectEvent } from "../../../types";
import PersonIcon from "../../../assets/images/human-Img.svg";
import FlameIcon from "../../../assets/images/fire-img.svg";
import { useProjectMembersQuery } from "../../../lib/api/projectApi";

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

  // project.id를 사용하여 API를 호출합니다.
  const { data: members } = useProjectMembersQuery(project.id);
  // 멤버 수 계산 (데이터가 없으면 기본값 1 또는 project.memberCount 사용)
  const memberCount = members ? members.length : project.memberCount;

  // 1. InviteCodeView의 복사 로직을 가져옵니다.
  const handleTitleClick = async () => {
    // 2. project.inviteCode가 있는지 확인합니다.
    if (!project.inviteCode) {
      alert("초대 코드가 없습니다.");
      return;
    }

    try {
      // 3. 클립보드에 초대 코드를 복사합니다.
      await navigator.clipboard.writeText(project.inviteCode);
      alert(`초대 코드가 복사되었습니다!\n\n${project.inviteCode}`);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
      alert("초대 코드 복사에 실패했습니다.");
    }
  };

  return (
    <Wrapper>
      {/* 1. 상단 정보 (기간, D-day, 인원) */}
      <InfoRow>
        <InfoPeriodText>{period}</InfoPeriodText>
        <InfoDDayChip>{dDay}</InfoDDayChip>
      </InfoRow>

      <TitleRow>
        {/* 좌측 그룹: 제목 + 인원 */}
        <LeftGroup>
          <Title onClick={handleTitleClick}>{project.title}</Title>
          <InfoPersonInfo>
            <img src={PersonIcon} alt="인원" /> {memberCount}
          </InfoPersonInfo>
        </LeftGroup>

        {/* 진행률 그래프 */}
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill style={{ width: `${progressPercent}%` }} />
          </ProgressBar>
          <FlameIconWrapper style={{ left: `${progressPercent}%` }}>
            <img src={FlameIcon} alt="진행률" />
          </FlameIconWrapper>
        </ProgressContainer>
      </TitleRow>
    </Wrapper>
  );
};

export default ProjectInfo;

// --- 스타일 정의 ---

const Wrapper = styled.div`
  width: 100%;
  padding: 16px;
  background-color: transparent;
  box-sizing: border-box;
`;

const InfoPeriodText = styled.span`
  color: #000;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  /* '유도리 있게' 다른 칩들과 높이를 맞추기 위한 패딩 */
  padding: 4px 2px 4px 0px;
  margin-left: 4px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center; // 혹시 좁아지면 줄바꿈
  margin-bottom: 4px;
`;

const InfoDDayChip = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  height: 20px;
  padding: 5px 11px;
  margin-left: 4px;
  box-sizing: border-box;

  border-radius: 12px;
  background-color: #7d4519;
  color: white;

  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const InfoPersonInfo = styled.span`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;

  padding: 4px 8px;
  margin-left: -2px;
  height: 18px;
  box-sizing: border-box;

  color: #8c8c8c;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  img {
    width: 16px;
    height: 16px;
    opacity: 1;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // ⬅️ 양쪽으로 분리
  margin-top: 6px;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin: 0;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
`;

const ProgressContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  flex-shrink: 0;
  width: 130px;
  margin-left: 16px;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: 4px solid #ca8853;
  width: 100%; // ⬅️ 부모(ProgressContainer)의 100%
  height: 12px; // ⬅️ 시안처럼 조금 더 두껍게
  border-radius: 20px;
  background: #dddddd; // ⬅️ 남은 부분(우측)의 색상
  overflow: hidden; // ⬅️ ProgressFill이 삐져나가지 않게
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f9dcb7 0%, #ca8853 100%);
  border-radius: 20px;
  transition: width 0.4s ease-out;
`;

const FlameIconWrapper = styled.div`
  position: absolute;
  top: 40%; // ⬅️ 세로 중앙 정렬
  transform: translate(-50%, -50%); // ⬅️ 자신의 중앙 기준으로 정렬

  transition: left 0.4s ease-out;
  z-index: 1; // ⬅️ ProgressBar 위에 오도록

  img {
    width: 28px;
    height: 28px;
    display: block;
  }
`;
