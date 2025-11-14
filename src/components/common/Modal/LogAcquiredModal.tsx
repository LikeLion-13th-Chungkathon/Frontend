import styled from "styled-components";
import { useModalStore, useModalActions } from "../../../store/useModalStore";
import LogImage from "../../../assets/images/one-log.png";
import Modal from "../Modal";
import { router } from "../../../App";

export const LogAcquiredModal = () => {
  // const navigate = useNavigate();

  // zustand에서 모달 상태와 프로젝트 이름 가져오기
  const { isLogAcquiredModalOpen, completedProjectName } = useModalStore();
  const { closeLogAcquiredModal } = useModalActions();

  console.log("통나무 모달 상태:", isLogAcquiredModalOpen);

  const handleNavigate = () => {
    closeLogAcquiredModal(); // 모달 달기
    // navigate("/reviews"); // 태깅 완료 후 결과 페이지로 이동
    router.navigate("/reviews");
  };

  // 모달 안열려있으면 렌더링X
  if (!isLogAcquiredModalOpen) return null;

  return (
    <Modal
      isOpen={isLogAcquiredModalOpen}
      onClose={closeLogAcquiredModal}
      width={335}
    >
      <ContentWrapper>
        <Title>
          [{completedProjectName}]의 기록이
          <br />
          🪵단단한 통나무가 되어
          <br />
          통나무집을 완성했어요!
        </Title>

        {/* 5. (요청 2) 통나무 이미지 */}
        <LogImageStyled src={LogImage} alt="통나무 획득" />

        <NavigateButton onClick={handleNavigate}>
          [{completedProjectName}] 통나무집 구경가기
        </NavigateButton>
      </ContentWrapper>
    </Modal>
  );
};

const ContentWrapper = styled.div`
  width: 100%;
  border-radius: 20px; // ⬅️ 시안의 둥근 모서리
  padding: 24px;
  box-sizing: border-box;

  font-family: ${({ theme }) => theme.fonts.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 18px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin: 16px 0;
`;

const LogImageStyled = styled.img`
  width: 210px;
  height: 130px;
  margin: 20px 0;
  object-fit: contain;
`;

const NavigateButton = styled.button`
  width: 100%;
  height: 48px;
  padding: 0 16px;

  background-color: #c78550;
  color: white;
  border: none;
  border-radius: 22px;

  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
`;
