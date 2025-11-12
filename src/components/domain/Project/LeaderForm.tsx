import { useState } from "react";
import styled from "styled-components";

export default function LeaderForm({
    onSubmit,
}: {
    onSubmit?: (payload: {
        role: "leader";
        title: string;
        startDate: string;
        endDate: string;
    }) => void;
    onClose: () => void;
}) {
    // 입력 상태 관리 (프로젝트명, 시작날짜, 마감날짜)
    const [title, setTitle] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!title.trim()) return alert("프로젝트명을 입력해주세요.");
        if (!startDate || !endDate) return alert("프로젝트 기간을 선택해주세요.");
        if (startDate > endDate)
            return alert("시작일이 종료일보다 늦을 수 없습니다.");

        // 상위 컴포넌트(CreateProjectModal)로 데이터 전달
        onSubmit?.({
            role: "leader",
            title,
            startDate,
            endDate,
        });

    // 생성(제출)하면 초대코드 모달 화면으로!
};

return (
    <Form onSubmit={handleSubmit}>
        <Label>프로젝트명</Label>
        <Input
            placeholder="프로젝트 이름을 입력해주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
        />

        <Label>프로젝트 기간</Label>
        <DateRow>
            <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />
        </DateRow>

        <SubmitButton type="submit">생성</SubmitButton>
    </Form>
    );
}

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
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
    width: 292px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid #d2c8bb;
    padding: 0 12px;

    // placeholdr 폰트 스타일 설정
    &::placeholder {
        color: #969696;
        font-family: LeeSeoyun;
        font-size: 16px;
        font-weight: 400;
    }
`;
const DateRow = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    input {
        width: 132px;
        font-size: 16px;
        color: #969696;
    }
`;
const SubmitButton = styled.button`
    margin-top: 8px;
    height: 50px;
    border: none;
    border-radius: 22px;
    background: #C78550;
    color: white;
    font-weight: 700;
`;
