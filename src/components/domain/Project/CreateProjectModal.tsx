import { useEffect, useState } from "react";
import Modal from "../../common/Modal";
import styled from "styled-components";
import LeaderForm from "./LeaderForm";
import MemberForm from "./MemberForm";
import InviteCodeView from "./InviteCodeView";
import { useCreateProjectMutation } from "../../../lib/api/projectApi";
import { useCalendarActions } from "../../../store/useCalendarStore";

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
                const { project, inviteCode } =
                  await createMutation.mutateAsync({
                    title,
                    startDate,
                    endDate,
                  });

                setActiveProjectId(project.id);

                // TODO: 실제 API 연동해서 inviteCode 받아오면 여기 채우기
                const generatedCode = "LIKELION-LOG";
                setInviteCode(generatedCode);

                // invite 단계(초대코드 화면)로 전환
                setInviteCode(inviteCode);
                setStep("invite");
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
