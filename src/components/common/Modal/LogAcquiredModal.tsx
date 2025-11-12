import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useModalStore, useModalActions } from "../../../store/useModalStore";

export const LogAcqiredModal = () => {
  const navigate = useNavigate();

  // zustand에서 모달 상태와 프로젝트 이름 가져오기
  const { isLogAcquiredModalOpen, completedProjectName } = useModalStore();
  const { closeLogAcquiredModal } = useModalActions();

  const handleNavigate = () => {
    closeLogAcquiredModal(); // 모달 달기
    navigate("/reviews"); // 태깅 완료 후 결과 페이지로 이동
  };

  // 모달 안열려있으면 렌더링X
  if (!isLogAcquiredModalOpen) return null;

  return (
    <ModalBackdrop onClick={closeLogAcquiredModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <p>[{completedProjectName}]의 기록</p>
        <p>단단한 통나무가 되어 통나무집을 완성했어요!</p>
        {/* 통나무 아이콘이 여기 들어가야함 */}
        <button onClick={handleNavigate}>
          [{completedProjectName}] 통나무집 구경가기
        </button>
      </ModalContent>
    </ModalBackdrop>
  );
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4); // 뒷 배경 어둡게
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;
const ModalContent = styled.div`
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: #f0f0f0;
`;
