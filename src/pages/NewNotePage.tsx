import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useCalendarStore from "../store/useCalendarStore";
import { useCreateTextNoteMutation } from "../lib/api/noteApi";

// ⬇️ 두루마리 배경 이미지 (예시)
import ScrollBg from "../assets/images/scroll-bg.png";

const NewNotePage: React.FC = () => {
  const navigate = useNavigate();
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  const [content, setContent] = useState("");
  const mutation = useCreateTextNoteMutation();

  const handleSave = () => {
    if (!activeProjectId || !content) return;

    mutation.mutate(
      { projectId: activeProjectId, content },
      {
        onSuccess: () => {
          navigate("/home"); // 저장 후 홈으로
        },
      }
    );
  };

  // 'X' 버튼 (저장 또는 취소 - 기획에 따라 다름. 여기선 '취소'로)
  const handleCancel = () => {
    navigate(-1); // 뒤로가기
  };

  return (
    <PageWrapper>
      <CloseButton onClick={handleCancel}>X</CloseButton>
      <ScrollBackground>
        <Header>{/* ... (날짜 등) */}</Header>
        <TextArea
          placeholder="[프로젝트명] 진행 중에 떠오른 생각을 적어주세요!"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {/* (디자인에 '완료' 버튼이 없으므로, 임시로 추가) */}
        <SaveButton onClick={handleSave} disabled={mutation.isPending}>
          {mutation.isPending ? "저장 중..." : "기록하기"}
        </SaveButton>
      </ScrollBackground>
    </PageWrapper>
  );
};

export default NewNotePage;

// --- 스타일 ---
const PageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background}; // 바깥 배경
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  /* ... (X 버튼 스타일) */
`;
const ScrollBackground = styled.div`
  background-image: url(${ScrollBg});
  background-size: contain;
  background-repeat: no-repeat;
  width: 90%;
  height: 80vh;
  padding: 40px;
  /* ... (두루마리 이미지에 맞게 패딩 조절) */
`;
const Header = styled.div`
  /* ... (날짜 스타일) */
`;
const TextArea = styled.textarea`
  width: 100%;
  height: 60%;
  border: none;
  background: transparent; // ⬅️ 배경 투명
  resize: none;
  font-family: ${({ theme }) => theme.fonts.primary};
`;
const SaveButton = styled.button<{ disabled: boolean }>`
  /* ... */
`;
