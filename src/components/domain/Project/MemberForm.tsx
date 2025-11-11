import { useState } from "react";
import styled from "styled-components";

export default function MemberForm({
    onSubmit,
    onClose,
}: {
    // 상위 컴포넌트(CreateProjectModal)로 데이터 전달
    onSubmit?: (payload: { 
        role: "member"; inviteCode: string 
    }) => void;

    onClose: () => void;
}) {
    //사용자가 입력할 때마다 setInviteCode()로 업데이트
    const [inviteCode, setInviteCode] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return alert("초대코드를 입력해주세요.");

        //입력한 초대코드 데이터 전달
        onSubmit?.({ role: "member", inviteCode });
        onClose();
    };

return (
    <Form onSubmit={handleSubmit}>
        <Label>초대코드</Label>
        <Input
            placeholder="초대코드를 입력해주세요"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
        />
        <SubmitButton type="submit">참여</SubmitButton>
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
