import styled from "styled-components";
import TagLog from "../../../assets/images/taglog.png"

type TagVariant = "idea" | "problem" | "solution";

interface TagResultProps {
    /** 아이디어 / 문제 / 해결 */
    variant: TagVariant;
    /** 타이틀 텍스트 (예: '아이디어', '문제') */
    title: string;
    /** 작성 수 = TagLog 이미지 개수 */
    count: number;
}

const TagResult = ({ variant, title, count }: TagResultProps) => {
    // variant에 따라 배경색 결정
    const backgroundColor =
        variant === "idea"
        ? "#FF94ED"
        : variant === "problem"
        ? "#FE0"
        : "#89F3FF";

    return (
        <Wrapper>
            <TagTitle $bg={backgroundColor}>
                {title}
            </TagTitle>
            <LogBox>
                {Array.from({ length: count }).map((_, idx) => (
                    <TagLogImg
                        key={idx}
                        src={TagLog}
                        alt={`${title} 로그 ${idx + 1}`}
                    />
                ))}
            </LogBox>
        </Wrapper>
    )
}

export default TagResult

const Wrapper = styled.div`
    display: flex;
    width: 352px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
`;

const TagTitle = styled.div<{ $bg: string }>`
    display: flex;
    padding: 1px;
    justify-content: center;
    align-items: center;
    gap: 10px;

    /* flex-direction: column;
    align-items: flex-start; */
    /* align-self: stretch; */

    /* variant에 따라 동적으로 변경 */
    background: ${({ $bg }) => $bg};

    color: #000;
    text-align: center;
    font-family: LeeSeoyun;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const LogBox = styled.div`
    display: flex;
    height: 61px;
    padding: 5px 7px;
    flex-direction: row;
    align-items: center;
    /* gap: 8px; */
    align-self: stretch;

    border-radius: 15px;
    border: 1px solid var(--main, #CA8853);
`;

const TagLogImg = styled.img`
    width: 55px;
    height: 51px;
    aspect-ratio: 55/51;
`;