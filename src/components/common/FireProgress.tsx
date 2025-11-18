import styled, { css } from "styled-components";
import FlameIcon from "../../assets/images/fire-img.svg";

type FireProgressSize = "project" | "tag" | "tagbottom";

interface FireProgressProps {
    value: number;
    size?: FireProgressSize;
    className?: string;
}

// 값이 0~100 범위를 넘어가지 않도록 보정하는 함수
const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

const FireProgress = ({ value, size = "project", className }: FireProgressProps) => {
    //progress 값 보정
    const progress = clamp(value, 0, 100);

    const iconLeft = `${clamp(progress, 5, 95)}%`;

    return (
        <Container $size={size} className={className}>
            {/* 진행 바 (배경, 테두리 포함) */}
            <Bar $size={size}>
                {/* 채워지는 부분 */}
                <Fill style={{ width: `${progress}%` }} />
            </Bar>

            {/* 불꽃 아이콘 */}
            <FlameWrapper $size={size} style={{ left: iconLeft }}>
                <img src={FlameIcon} alt="진행률" />
                <PercentText $size={size}>{Math.round(progress)}%</PercentText>
            </FlameWrapper>
        </Container>
    )
}

export default FireProgress;

const Container = styled.div<{ $size: FireProgressSize }>`
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    /* 프리셋별 전체 컨테이너 사이즈 */
    ${({ $size }) => {
        switch ($size) {
        case "project":
            // ProjectInfo.tsx에서 쓰는 기존 기본 사이즈
            return css`
            width: 130px;
            height: 28px;
            `;
        case "tag":
            // 첫 번째 와이드 버전: 프레임 283 × 21
            return css`
            width: 283px;
            height: 21px;
            `;
        case "tagbottom":
            // 두 번째 와이드 버전: 프레임 327 × 21
            return css`
            width: 327px;
            height: 21px;
            `;
        }
    }}
`;

const Bar = styled.div<{ $size: FireProgressSize }>`
    /* position: absolute;
    top: 50%;
    transform: translateY(-50%); */
    position: absolute;
    top: 50%;
    left: 50%;                /* 가운데 기준 */
    transform: translate(-50%, -50%);
    
    border-style: solid;
    border-color: #ca8853;
    border-radius: 20px;
    background: #dddddd; // 남은 구간 색
    overflow: hidden; // Fill이 삐져나오지 않도록

    /* 프리셋별 바 사이즈(SPEC) */
    ${({ $size }) => {
        switch ($size) {
        case "project":
            return css`
            width: 100%; /* 130px에 맞게 */
            height: 12px;
            border-width: 4px;
            `;
        case "tag":
            return css`
            width: 265px; /* 피그마 지정 */
            height: 20px;
            border-width: 5px;
            `;
        case "tagbottom":
            return css`
            width: 307px; /* 피그마 지정 */
            height: 20px;
            border-width: 5px;
            `;
        }
    }}
`;

/* 채워지는 진행 영역 */
const Fill = styled.div`
    height: 100%;
    background: linear-gradient(90deg, #f9dcb7 0%, #AF2E11 100%);
    border-radius: 20px;
    transition: width 0.4s ease-out;
`;

/* 불꽃 아이콘 */
const FlameWrapper = styled.div<{ $size: FireProgressSize }>`
    position: absolute;
    top: 60%; // 바의 세로 중앙보다 살짝 위 느낌
    transform: translate(-50%, -50%);
    transition: left 0.4s ease-out; // 움직임 부드럽게
    z-index: 1;

    img {
        display: block;

        /* 프리셋별 불꽃 크기 */
        ${({ $size }) => {
        switch ($size) {
            case "project":
            return css`
                width: 28px;
                height: 28px;
            `;
            case "tag":
            case "tagbottom":
            // 큰 불꽃 버전
            return css`
                width: 44px;
                height: 44px;
            `;
        }
        }}
    }
`;

/* 퍼센트 텍스트 */
const PercentText = styled.span<{ $size: FireProgressSize }>`
    flex-shrink: 0;
    z-index: 1;
    margin-left: 8px;
    min-width: 20px;

    color: #8b4b03;
    text-align: center;

    ${({ $size, theme }) => {
        switch ($size) {
        case "project":
            // 기존 ProjectInfo 스타일
            return css`
            font-family: ${theme.fonts.primary};
            font-size: 12px;
            font-weight: 600;
            `;

        case "tag":
        case "tagbottom":
            // 새 디자인에서 사용하는 큰 텍스트
            return css`
            font-family: "LeeSeoyun", ${theme.fonts.primary};
            font-size: 14px;
            font-weight: 400;
            `;
        }
    }}
`;