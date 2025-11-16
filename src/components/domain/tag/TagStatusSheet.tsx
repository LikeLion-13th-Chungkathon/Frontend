// src/components/domain/tag/TagStatusSheet.tsx
import styled from "styled-components";
import FireProgress from "../../common/FireProgress";
import UserLogProgress from "./UserLogProgress";

interface TagStatusSheetProps {
    open: boolean;
    onClose: () => void;
    projectTitle: string;
    progress: number; // 0~100
}

const TagStatusSheet = ({
    open,
    onClose,
    projectTitle,
    progress,
}: TagStatusSheetProps) => {
    if (!open) return null;

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
                        <SubTitle>완성까지 통나무 n개가 더 필요해요!</SubTitle>
                    </ContentText>
                    

                    {/* 상단 큰 진행률바 - tagbottom 프리셋 사용 */}
                    <ProgressWrapper>
                        <FireProgress value={progress} size="tagbottom" />
                    </ProgressWrapper>
                </ContentContainer>
                {/* TODO: 아래는 사용자별 진행률 (지금은 더미) */}
                <UserList>
                    <UserLogProgress nickname="닉네임123456" value={80} />
                    <UserLogProgress nickname="닉네임234567" value={60} />
                    <UserLogProgress nickname="닉네임345678" value={40} />
                    <UserLogProgress nickname="닉네임456789" value={20} />
                </UserList>
            </Sheet>
        </Overlay>
    );
};

export default TagStatusSheet;


const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(113, 113, 113, 0.60);
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
`

const ContentText = styled.div`
    /* margin-top: 40px; */
    display: flex;
    width: 293px;
    flex-direction: column;
    align-items: center;
    gap: 2px;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: #000;
  font-family: LeeSeoyun;
  font-size: 18px;
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
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UserRow = styled.div`
  color: #000;
  font-family: LeeSeoyun;
  font-size: 14px;
`;
