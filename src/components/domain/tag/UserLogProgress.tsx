// src/components/domain/tag/UserLogProgressRow.tsx
import styled from "styled-components";
import LogIcon from "../../../assets/images/log-icon.png";

interface UserLogProgressProps {
  nickname: string;
  /** 0 ~ 100 */
  value: number;
}

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const UserLogProgress = ({ nickname, value }: UserLogProgressProps) => {
  const progress = clamp(value, 0, 100);
  // 아이콘이 너무 끝에 붙지 않도록 5~95% 사이로 보정
  const iconLeft = `${clamp(progress, 5, 95)}%`;

  return (
    <Row>
      <Nickname>{nickname}</Nickname>

      <BarContainer>
        <BarBackground>
          <BarFill style={{ width: `${progress}%` }} />
        </BarBackground>

        <LogIconWrapper style={{ left: iconLeft }}>
          <img src={LogIcon} alt="통나무 진행 아이콘" />
        </LogIconWrapper>
      </BarContainer>
    </Row>
  );
};

export default UserLogProgress;

/* ================= 스타일 ================= */

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Nickname = styled.span`
  color: #000;
  font-family: LeeSeoyun;
  font-size: 16px;
  flex: 0 0 auto; /* 줄어들지 않게 */
`;

/** 전체 바 영역 (닉네임 오른쪽) */
const BarContainer = styled.div`
  position: relative;
  width: 227px;
  height: 20px; /* 아이콘까지 포함하는 높이 */
  flex-shrink: 0;
`;

/** 회색 배경 + 테두리 */
const BarBackground = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 227px;
  height: 9px;
  border-radius: 20px;
  border: 1px solid #7d4519;
  background: #ddd; /* 남은 구간 색 */
  overflow: hidden;
`;

/** 채워지는 부분 (갈색 그라데이션) */
const BarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f9dcb7 0%, #af2e11 100%);
  border-radius: 20px;
  transition: width 0.3s ease-out;
`;

/** 통나무 아이콘 */
const LogIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%); /* 중앙 정렬 */
  z-index: 1;

  img {
    display: block;
    width: 24px;   /* 디자인 보고 맞춰서 조절 */
    height: 24px;
  }
`;
