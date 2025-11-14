import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import useCalendarStore, { useCalendarActions } from "../store/useCalendarStore";
import { useCreateTextNoteMutation } from "../lib/api/noteApi";

// ⬇️ 두루마리 배경 이미지 (예시)
import ScrollBg from "../assets/images/scroll-bg.png";
import ProjectSelector from "../components/domain/Home/ProjectSelector";
import ProjectInfo from "../components/domain/Home/ProjectInfo";
import { useProjectQuery } from "../lib/api/projectApi";
import { Button } from "../components/common/Button";

const NewNotePage: React.FC = () => {
  const navigate = useNavigate();
  const activeProjectId = useCalendarStore((state) => state.activeProjectId);
  const selectedDate = useCalendarStore((state) => state.selectedDate);
  const [content, setContent] = useState("");
  const mutation = useCreateTextNoteMutation();

  // 1. React Query로 프로젝트 목록을 가져옵니다.
  const { data: projects } = useProjectQuery();

  const { setActiveProjectId, setSelectedDate } = useCalendarActions();

  // 3. 앱 로드 시, 첫 번째 프로젝트를 활성 프로젝트로 자동 설정합니다.
    useEffect(() => {
      if (!activeProjectId && projects && projects.length > 0) {
        setActiveProjectId(projects[0].id);
      }
    }, [projects, activeProjectId, setActiveProjectId]);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const dateFromQuery = params.get("date");
      if (dateFromQuery) {
        setSelectedDate(dateFromQuery);
      }
    }, [location.search, setSelectedDate]);

  // 4. 현재 활성화된 프로젝트 정보 찾기
  const activeProject = projects?.find((p) => p.id === activeProjectId);

  const handleSave = () => {
    if (!activeProjectId || !content) return;

    mutation.mutate(
      { projectId: activeProjectId,content },
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

  // "2025-11-04" -> "2025년 11월 4일 월요일"
  const formatKoreanDate = (dateStr: string) => {
    if (!dateStr) return "";

    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr; // 혹시 이상한 값이면 그냥 원본 반환

    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const day = dayNames[d.getDay()];

    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${day}요일`;
  };


  return (
    <PageWrapper>
      <ProjectSelector/>
      {/* 2. 프로젝트 정보 (활성 프로젝트가 있을 때만 표시) */}
      {activeProject && <ProjectInfo project={activeProject} />}

      {/* <CloseButton onClick={handleCancel}>X</CloseButton> */}
      <MemoContainer>
        <MemoTitle>[프로젝트명] 진행 중에 떠오른 생각을 적어주세요!</MemoTitle>
        <ScrollBackground>
          <ScrollContent>
            <MemoTitle>{formatKoreanDate(selectedDate)}</MemoTitle>
            <TextArea
              placeholder="입력해주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </ScrollContent>
        </ScrollBackground>

        <ButtonRow>
          <Button variant="secondary" size="small" onClick={handleCancel}>취소</Button>
          <Button variant="primary" size="small" onClick={handleSave}>등록</Button>
        </ButtonRow>
      </MemoContainer>
    </PageWrapper>
  );
};

export default NewNotePage;

// --- 스타일 ---
const PageWrapper = styled.div`
  flex: 1;
  width: 100%;
  /* padding-top: 68px; */
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScrollBackground = styled.div`
  background-image: url(${ScrollBg});
  background-repeat: no-repeat;
  background-size: 100% 100%;      /* 박스를 꽉 채우도록 */
  
  width: 100%;
  max-width: 374px;
  aspect-ratio: 374 / 503;

  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextArea = styled.textarea`
  /* flex: 1; */
  width: 206px;
  height: 257px;
  flex-shrink: 0;
  border-radius: 15px;
  background: #FFF;
  padding: 9px 14px;
`;

const MemoTitle = styled.div`
  color: #000;
  font-family: LeeSeoyun;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const MemoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;             /* 제목과 두루마리 사이 간격 */
`

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;           /* 버튼 사이 간격 */
  margin-top: 16px;
  width: 100%;         /* 가운데 정렬 위해 width 100% */
`;

const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;          /* 날짜와 TextArea 사이 간격 */
  width: 206px;       /* TextArea와 동일 폭 */
  margin-top: 64px;
  align-items: center;
`
