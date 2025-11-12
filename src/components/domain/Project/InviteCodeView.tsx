import { useState } from "react";
import styled from "styled-components";

export default function InviteCodeView({
    code, // 생성된 코드
    onClose,
}: {
    code: string;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }

    return (
        <Wrap>
            <TextBox>
                <Title>프로젝트가 생성되었습니다!</Title>
                <Title>아래 코드를 팀원에게 공유하세요.</Title>
            </TextBox>
            <CodeText>초대코드: {code}</CodeText>

            <BtnContainer>
                <CopyBtn type="button" onClick={handleCopy} >
                    {copied ? "복사됨!" : "초대코드 복사"}
                </CopyBtn>
                <SubmitBtn type="button" onClick={onClose}>
                    완료
                </SubmitBtn>
            </BtnContainer>
        </Wrap>
    )
}

const Wrap = styled.div`
    display: grid;
    gap: 12px;
    margin-top: 40px; // 모달 위쪽 margin(추후 스타일 수정필요)
`;

const Title = styled.div`
    color: #000;
    text-align: center;
    font-family: LeeSeoyun;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const TextBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const BtnContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const CodeText = styled.div`
    color: #000;
    text-align: center;
    font-family: LeeSeoyun;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 36px;
    margin-bottom: 28px;
`

const CopyBtn = styled.button`
    width: 287px;
    height: 44px;
    flex-shrink: 0;

    height: 50px;
    border: none;
    border-radius: 22px;
    background: #C78550;
    color: white;
    font-weight: 700;
`

const SubmitBtn = styled.button`
    width: 287px;
    height: 44px;
    flex-shrink: 0;

    height: 50px;
    border: none;
    border-radius: 22px;
    background: #C78550;
    color: white;
    font-weight: 700;
`