import styled from "styled-components";
import type { ProjectEvent } from "../../../types";
import PersonIcon from "../../../assets/images/human-Img.svg";
import FlameIcon from "../../../assets/images/fire-img.svg";

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
        <InfoPeriodText>{period}</InfoPeriodText>
        <InfoDDayChip>{dDay}</InfoDDayChip>
        <InfoPersonInfo>
          <img src={PersonIcon} alt="인원" /> {project.memberCount}
        </InfoPersonInfo>
      </InfoRow>

      <TitleRow>
        {/* 프로젝트 제목 (이제 ... 처리가 됨) */}
        <Title>{project.title}</Title>

        {/* 진행률 그래프 */}
        <ProgressContainer>
          <ProgressBar />
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
  padding: 4px 10px 4px 0px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap; // 혹시 좁아지면 줄바꿈
  margin-bottom: 8px;
`;

const InfoDDayChip = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;

  /* 피그마 18px 높이를 맞추기 위해 box-sizing 사용 */
  height: 20px;
  padding: 5px 11px;
  box-sizing: border-box;

  border-radius: 16px; // ⬅️ 시안보다 둥글게 (유도리)
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

// ⬇️ (신규) 3. 인원 (회색 텍스트 + 아이콘)
const InfoPersonInfo = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px; // ⬅️ 피그마 10px는 너무 넓어 4px로 '유도리 있게' 수정

  /* 다른 요소들과 높이/패딩 맞춤 */
  padding: 4px 10px;
  height: 18px;
  box-sizing: border-box;

  color: #8c8c8c; // ⬅️ 피그마 지정 회색
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  img {
    width: 16px;
    height: 16px;
    opacity: 1; // ⬅️ 아이콘이 너무 튀지 않게 (유도리)
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // ⬅️ 양쪽으로 분리
  gap: 16px; // ⬅️ 제목과 바 사이의 최소 간격
  margin-top: 10px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.primary};
  margin: 0; // ⬅️ margin은 부모(TitleRow)가 관리

  /* --- ⬇️ ... 처리를 위한 핵심 4줄 --- */
  flex: 1; /* 1. 남는 공간을 모두 차지 */
  min-width: 0; /* 2. (중요) flex-item이 줄어들 수 있도록 허용 */
  white-space: nowrap; /* 3. 줄바꿈 방지 */
  overflow: hidden; /* 4. 넘치는 내용 숨기기 */
  text-overflow: ellipsis; /* 5. ... 표시 */
`;

const ProgressContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;

  flex-shrink: 0;
  width: 140px; /* ⬅️ 진행률 바의 '최소/고정' 너비 (디자인에 맞게 조절) */
`;

const FlameIconWrapper = styled.div`
  position: absolute;
  top: 45%; // ⬅️ 세로 중앙 정렬
  transform: translate(-50%, -50%); // ⬅️ 자신의 중앙 기준으로 정렬

  transition: left 0.4s ease-out;
  z-index: 1; // ⬅️ ProgressBar 위에 오도록

  img {
    width: 28px;
    height: 28px;
  }
`;

const ProgressBar = styled.div`
  position: absolute; // ⬅️ 불꽃 뒤에 깔림
  top: 50%; // ⬅️ 세로 중앙 정렬
  transform: translateY(-50%);

  width: 100%;
  height: 10px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    #f9dcb7 0%,
    #ca8853 100%
  ); // ⬅️ 요청하신 그라데이션
  overflow: hidden;
`;

// const ProgressFill = styled.div`
//   height: 100%;
//   background: linear-gradient(90deg, #f9dcb7 0%, #ca8853 100%);
//   border-radius: 10px; // ⬅️ radius 맞춤
//   transition: width 0.4s ease-out;
// `;
