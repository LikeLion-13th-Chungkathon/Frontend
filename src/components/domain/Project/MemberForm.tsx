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
        const err = error as AxiosError<any>; // TypeScript에게 AxiosError임을 알림

        if (err.response) {
          // 1. 서버가 응답을 주었으나, 2xx 범위가 아닌 경우 (4xx, 5xx)
          const { status, data } = err.response;

          console.log("에러 상태:", status);
          console.log("에러 데이터:", data);

          if (status === 404) {
            // 404: 초대 코드가 틀린 경우
            alert("초대 코드가 유효하지 않습니다.");
          } else if (status === 400) {
            // 400: 이미 가입된 경우 등 (백엔드 메시지 활용)
            alert(data.message || "잘못된 요청입니다.");
          } else {
            // 500 등 그 외 서버 에러
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        } else {
          // 2. 응답 자체가 없는 경우 (네트워크 연결 끊김, CORS 등)
          console.error("네트워크 오류:", err);
          alert("서버와 연결할 수 없습니다. 네트워크를 확인해주세요.");
        }
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
