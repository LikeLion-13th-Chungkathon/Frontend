import ProjectSelector from '../components/domain/Home/ProjectSelector'
import styled from 'styled-components'
import LogHouseImg1 from '../assets/images/loghouse1.png'
import FireProgress from '../components/common/FireProgress'
import { calculateProgress } from '../lib/utils/projectProgress'
import TagResult from '../components/domain/tag/TagResult'

const TagPage = () => {
    // TODO: 실제로는 여기서 선택된 프로젝트 정보(Zustand, props 등) 가져오기
    const dummyProject = {
        startDate: "2025-11-01",
        endDate: "2025-12-01",
    };

    // 숫자로 된 진행률 계산 (0~100)
    const progressPercentage = calculateProgress(
        dummyProject.startDate,
        dummyProject.endDate
    );

  return (
    <Wrapper>
        <HouseBackground >
            <ProjectSelector />
            <TitleContainer>
                {/* TODO: 실제 누르고 있는 프로젝트 이름 나오도록 해야함 */}
                <Title>[프로젝트123456] 팀의 통나무집</Title>
                <CountContainer>
                    <CountBox>
                        <CountTextBox>
                            🪵 n
                        </CountTextBox>
                    </CountBox>
                    <CountBox>
                        <CountTextBox>
                            👤 n
                        </CountTextBox>
                    </CountBox>
                </CountContainer>

                <LogHouseImg src={LogHouseImg1}/>

                <FireProgress value={progressPercentage} size='tag'/>
            </TitleContainer>
        </HouseBackground>

        <Title>닉네임명1234의 [프로젝트명1] 회고</Title>

        <TagResultBox>
            <TagResult variant="problem" title="문제" count={1} />
            <TagResult variant="idea" title="아이디어" count={3} />
            <TagResult variant="solution" title="해결" count={5} />
        </TagResultBox>
    </Wrapper>
  )
}

export default TagPage

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const HouseBackground = styled.div`
    width: 375px;
    height: 450px; // 디자인에 맞게 조절 필요
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: linear-gradient(180deg, #FFF7ED 18.27%, rgba(148, 235, 246, 0.80) 66.35%, rgba(127, 209, 114, 0.80) 82.21%, #FFF7ED 100%);
`

const TitleContainer = styled.div`
    display: flex;
    width: 257px;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    margin-top: 32px;
`

const Title = styled.div`
    align-self: stretch;
    color: #000;
    text-align: center;
    font-family: LeeSeoyun;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`

const CountContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

const CountBox = styled.div`
    width: 46px;
    height: 23px;
    flex-shrink: 0;
    border-radius: 11.5px;
    border: 1px solid var(--main, #CA8853);
    background: #FFF;
`

const LogHouseImg = styled.img`
    width: 292px;
    height: 210px;
    flex-shrink: 0;
    aspect-ratio: 146/105;
`

const TagResultBox = styled.div`
    display: flex;
    width: 352px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
`

const CountTextBox = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;

    color: #684F3C;
    text-align: center;
    font-family: LeeSeoyun;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`