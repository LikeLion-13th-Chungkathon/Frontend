import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import styled from "styled-components";
import LeaderForm from "./LeaderForm";
import MemberForm from "./MemberForm";
import InviteCodeView from "./InviteCodeView";
import { useCreateProjectMutation } from "../../../lib/api/projectApi";
import { useCalendarActions } from "../../../store/useCalendarStore";
import type { AxiosError } from "axios";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: // onSubmit,
{
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: any) => void;
}) {
  // 기본 역할 상태: 팀대표
  const [role, setRole] = useState<"leader" | "member">("leader");
  // 초대 코드 단계 상태 추가
  const [step, setStep] = useState<"select" | "invite">("select");
  // 초대 코드 저장용
  const [inviteCode, setInviteCode] = useState<string>("");

  // 프로젝트 생성 훅
  const createMutation = useCreateProjectMutation();
  const { setActiveProjectId } = useCalendarActions();

  // 모달 열릴 때마다 기본 화면으로 초기화
  useEffect(() => {
    if (isOpen) {
      setRole("leader");
      setStep("select");
      setInviteCode("");
    }
  }, [isOpen]);

  return (
    // 공동 Modal 컴포넌트 사용해서 기본 틀 적용
    <Modal isOpen={isOpen} onClose={onClose} width={335}>
      <CloseButton onClick={onClose}>x</CloseButton>

      {step === "select" && (
        <ButtonContainer>
          <Title>프로젝트를 생성하고 팀원을 초대해요!</Title>
          <Label>이번 프로젝트에서 나는?</Label>

          <RoleButtons>
            {/* 팀 대표 버튼 */}
            <RoleButton
              $active={role === "leader"}
              onClick={() => setRole("leader")}
            >
              팀 대표
            </RoleButton>

            {/* 팀원 버튼 */}
            <RoleButton
              $active={role === "member"}
              onClick={() => setRole("member")}
            >
              팀원
            </RoleButton>
          </RoleButtons>

          {/* 팀대표 or 팀원 역할에 따라 조건부 렌더링 */}
          {role === "leader" ? (
            <LeaderForm
              onSubmit={async ({ title, startDate, endDate }) => {
                // 폼 데이터(title)를 API 페이로드(project_name)로 매핑
                const apiPayload = {
                  project_name: title,
                  date_start: startDate,
                  date_end: endDate,
                };

                try {
                  // API 호출
                  const { project, inviteCode } =
                    await createMutation.mutateAsync(apiPayload);

                  // 성공 시 로직
                  setActiveProjectId(project.id);
                  setInviteCode(inviteCode);
                  setStep("invite");
                } catch (e) {
                  // 실패 시 에러 처리
                  const error = e as AxiosError<any>; // 2. 에러 타입 단언
                  console.error("프로젝트 생성 실패:", error);

                  if (error.response) {
                    const { status, data } = error.response;

                    // 3. 400 Bad Request 처리
                    if (status === 400 && data) {
                      // Case A: 날짜 오류 (invalid_date)
                      if (data.invalid_date) {
                        alert(data.invalid_date.error);
                        return;
                      }

                      // Case B: 이름 길이 오류 (limit_project_name)
                      if (data.limit_project_name) {
                        alert(data.limit_project_name.error);
                        return;
                      }

                      // Case C: 그 외 400 에러 (일반적인 메시지가 올 경우 대비)
                      if (data.message) {
                        alert(data.message);
                        return;
                      }

                      // Case D: 백엔드에서 예상치 못한 키를 보냈을 때
                      alert("입력값이 올바르지 않습니다. 다시 확인해주세요.");
                    }
                    // 4. 500 등 서버 오류 처리
                    else {
                      alert(
                        "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
                      );
                    }
                  } else {
                    // 5. 네트워크 오류 (서버 응답 없음)
                    alert("네트워크 연결을 확인해주세요.");
                  }
                  // ⬆️ ⬆️ ⬆️ 에러 핸들링 로직 수정 ⬆️ ⬆️ ⬆️
                }
              }}
              onClose={onClose}
            />
          ) : (
            <MemberForm
              // onSubmit={() => {
              //     // TODO: 초대코드 검증 API 등 처리 후 닫기
              //     onClose();
              // }}
              onClose={onClose}
            />
          )}
        </ButtonContainer>
      )}

      {step === "invite" && (
        <InviteCodeView code={inviteCode} onClose={onClose} />
      )}
    </Modal>
  );
}

const Title = styled.div`
  color: #000;
  text-align: center;
  font-family: LeeSeoyun;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  /* margin-top: 24px; */
  margin-bottom: 24px;
`;

const CloseButton = styled.button`
  position: absolute; //헤더 내부 오른쪽 위로 고정
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
`;

const Label = styled.div`
  color: #000;
  font-family: LeeSeoyun;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 40px;
`;

const RoleButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; // 가로 정렬
  gap: 16px;
`;

const RoleButton = styled.button<{ $active: boolean }>`
  display: flex;
  width: 138px;
  height: 44px;
  padding: 0px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 11px;
  margin-bottom: 10px;

  border: 1px solid ${({ $active }) => ($active ? "#fff" : "#969696")};
  background: ${({ $active }) => ($active ? "#C78550" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#969696")};
`;
