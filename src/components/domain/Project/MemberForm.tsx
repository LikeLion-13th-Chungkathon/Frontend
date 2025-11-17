import { useState } from "react";
import styled from "styled-components";
import { useJoinProjectMutation } from "../../../lib/api/projectApi";
import type { AxiosError } from "axios";

export default function MemberForm({ onClose }: { onClose: () => void }) {
  //사용자가 입력할 때마다 setInviteCode()로 업데이트
  const [inviteCode, setInviteCode] = useState("");

  // React Query mutation 훅
  const joinProject = useJoinProjectMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return alert("초대코드를 입력해주세요.");

    //초대코드로 참여 시도
    joinProject.mutate(inviteCode, {
      onSuccess: (response) => {
        alert(`"${response.message}" 프로젝트 참여 완료`);
        onClose();
      },
      onError: (error) => {
        // 에러 객체를 AxiosError로 타입 단언
        const err = error as AxiosError<any>;
        const errorData = err.response?.data;

        // 4. 상태 코드별/필드별 에러 처리
        if (errorData) {
          // 400 에러: { "message": "이미 해당 프로젝트에 속해있습니다." }
          if (errorData.message) {
            alert(errorData.message);
            return;
          }

          // 404 에러: { "detail": "Not found." }
          if (errorData.detail) {
            // "Not found."는 불친절하므로 한글로 변환해서 보여주거나, 그대로 보여줍니다.
            if (errorData.detail === "Not found.") {
              alert("존재하지 않는 초대코드입니다.");
            } else {
              alert(errorData.detail);
            }
            return;
          }
        }

        // 5. 그 외 알 수 없는 에러
        alert("프로젝트 참여 중 오류가 발생했습니다.");
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Label>초대코드</Label>
      <Input
        placeholder="초대코드를 입력해주세요"
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
      />
      <SubmitButton type="submit" disabled={joinProject.isPending}>
        {joinProject.isPending ? "확인 중..." : "참여"}
      </SubmitButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
`;
const Label = styled.label`
  color: #000;
  font-family: LeeSeoyun;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const Input = styled.input`
  height: 44px;
  border-radius: 12px;
  border: 1px solid #d2c8bb;
  padding: 0 12px;
`;
const SubmitButton = styled.button`
  margin-top: 8px;
  height: 50px;
  border-radius: 18px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 700;
`;
