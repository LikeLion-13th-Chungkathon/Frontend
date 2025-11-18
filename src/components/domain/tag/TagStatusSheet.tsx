// src/components/domain/tag/TagStatusSheet.tsx
import styled from "styled-components";
import FireProgress from "../../common/FireProgress";
import UserLogProgress from "./UserLogProgress";
import { useProjectContributionQuery } from "../../../lib/api/reviewApi";


interface TagStatusSheetProps {
  open: boolean;
  onClose: () => void;
  projectId: string | null;
  projectTitle: string;
  progress: number; // 0~100

  totalRequiredLogs: number;
  currentLogs: number;
}

const TagStatusSheet = ({
  open,
  onClose,
  projectId,
  projectTitle,
  progress,
  totalRequiredLogs,
  currentLogs,
}: TagStatusSheetProps) => {
  if (!open) return null;

  // 실제 팀원 기여도 데이터 API 호출
  const { data: contributions, isLoading } =
    useProjectContributionQuery(projectId);

     const remainingLogs = Math.max(totalRequiredLogs - currentLogs, 0);
  return (
    <Overlay onClick={onClose}>
      {/* 시트 내부 클릭 시 닫히지 않도록 */}
      <Sheet onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <ContentContainer>
          <ContentText>
            <Header>
              <Title>[{projectTitle}] 통나무집 참여 현황</Title>
              {/* <CloseButton onClick={onClose}>✕</CloseButton> */}
            </Header>
            <SubTitle>완성까지 통나무 {remainingLogs}개가 더 필요해요!</SubTitle>
          </ContentText>

          {/* 상단 큰 진행률바 - tagbottom 프리셋 사용 */}
          <ProgressWrapper>
            <FireProgress value={progress} size="tagbottom" />
          </ProgressWrapper>
        </ContentContainer>
        {/* TODO: 아래는 사용자별 진행률 (지금은 더미) */}
        <UserList>
          {isLoading ? (
            <SubTitle>참여 현황 불러오는 중...</SubTitle>
          ) : (
            contributions?.map((user) => (
              <UserLogProgress
                key={user.nickname}
                nickname={user.nickname}
                // (주의) API가 0-100이 아닌 0-1 값을 준다면
                // value={user.contribution_percent * 100}
                value={user.contribution_percent}
              />
            ))
          )}
        </UserList>
      </Sheet>
    </Overlay>
  );
};

export default TagStatusSheet;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(113, 113, 113, 0.6);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 999;
`;

const Sheet = styled.div`
  position: relative;

  width: 100%;
  max-width: 377px;
  min-height: 350px;
  max-height: 80vh;
  background: #fff0da;
  border-radius: 24px 24px 0 0;
  padding: 20px 20px 28px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  gap: 24px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  align-self: stretch;
`;

const ContentText = styled.div`
  /* margin-top: 40px; */
  display: flex;
  width: 293px;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: #000;
  font-family: LeeSeoyun;
  font-size: 20px;
  font-weight: 400;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;

  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
`;

const SubTitle = styled.p`
  margin: 0;
  color: #7b6a54;
  font-family: LeeSeoyun;
  font-size: 14px;
`;

const ProgressWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 12px;
  width: 293px;           /* 텍스트랑 같은 폭 */
  display: flex;
  justify-content: center;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
