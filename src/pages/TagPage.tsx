import ProjectSelector from '../components/domain/Home/ProjectSelector'
import styled from 'styled-components'
import houseBackground from '../assets/images/tagbackground.png'
import LogHouseImg1 from '../assets/images/loghouse1.png'
import LogHouseImg2 from '../assets/images/loghouse2.png'
import LogHouseImg3 from '../assets/images/loghouse3.png'
import FireProgress from '../components/common/FireProgress'
import { calculateProgress } from '../lib/utils/projectProgress'
import TagResult from '../components/domain/tag/TagResult'
import { useState } from 'react'
import TagStatusSheet from '../components/domain/tag/TagStatusSheet'
import NoteDetailModal from '../components/domain/Home/NoteDetailModal'

const TagPage = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    // 노트 모달 상태
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    //progress 퍼센트 3개로 나눠서
    const getHouseImage = (progress: number) => {
        if (progress < 34) return LogHouseImg1;
        if (progress < 67) return LogHouseImg2;
        return LogHouseImg3;
    };

    // TODO: 실제로는 여기서 선택된 프로젝트 정보(Zustand, props 등) 가져오기
    const dummyProject = {
        startDate: "2025-11-01",
        endDate: "2025-11-10",
        title: "프로젝트123456",
    };

    // TODO: 실제 데이터로 교체 (각 통나무 = 한 번의 회고 기록)
    const problemLogs = [
        { noteId: "note-problem-1" },
    ];

    const ideaLogs = [
        { noteId: "note-idea-1" },
        { noteId: "note-idea-2" },
        { noteId: "note-idea-3" },
    ];

    const solutionLogs = [
        { noteId: "note-solution-1" },
        { noteId: "note-solution-2" },
        { noteId: "note-solution-3" },
        { noteId: "note-solution-4" },
        { noteId: "note-solution-5" },
    ];


    // 숫자로 된 진행률 계산 (0~100)
    const progressPercentage = calculateProgress(
        dummyProject.startDate,
        dummyProject.endDate
    );

    const openSheet = () => setIsSheetOpen(true);
    const closeSheet = () => setIsSheetOpen(false);

    // 통나무(개별 로그) 클릭 → noteId로 모달 열기
    const handleClickLog = (noteId: string) => {
        setSelectedNoteId(noteId);
        setIsNoteModalOpen(true);
    };

    const closeNoteModal = () => {
        setIsNoteModalOpen(false);
        setSelectedNoteId(null);
    };

  return (
    <Wrapper>
        <HouseBackground>
            <ProjectSelector />
            <TitleContainer>
                {/* TODO: 실제 누르고 있는 프로젝트 이름 나오도록 해야함 */}
                <Title>[{dummyProject.title}] 팀의 통나무집</Title>
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

                <LogHouseImg src={getHouseImage(progressPercentage)} onClick={openSheet}/>

                <FireProgress value={progressPercentage} size='tag'/>
            </TitleContainer>
        </HouseBackground>

        <Title>닉네임명1234의 [프로젝트명1] 회고</Title>

        <TagResultBox>
            <TagResult
                variant="problem"
                title="문제"
                logs={problemLogs}
                onClickLog={handleClickLog}
            />
            <TagResult
                variant="idea"
                title="아이디어"
                logs={ideaLogs}
                onClickLog={handleClickLog}
            />
            <TagResult
                variant="solution"
                title="해결"
                logs={solutionLogs}
                onClickLog={handleClickLog}
            />
        </TagResultBox>

        <TagStatusSheet
            open={isSheetOpen}
            onClose={closeSheet}
            projectTitle={dummyProject.title}
            progress={progressPercentage}
        />

        {/* 개별 통나무 클릭시 노트 모달 */}
        <NoteDetailModal
            isOpen={isNoteModalOpen}
            noteId={selectedNoteId}
            onClose={closeNoteModal}
        />
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
    height: 520px; // 디자인에 맞게 조절 필요
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    background: 
        url(${houseBackground}) center/cover no-repeat,
        linear-gradient(
            180deg, 
            #FFF7ED 18.27%, 
            rgba(148, 235, 246, 0.80) 66.35%, 
            rgba(127, 209, 114, 0.80) 82.21%, 
            #FFF7ED 100%
        );
    
    background-size:
        100%,
        cover;

    background-position:
        calc(50%) calc(100% - 104px),
        center;
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
    margin-top: 28px;
    margin-bottom: 24px;
    width: 292px;
    height: 210px;
    transform: scale(1.05);
    /* transform-origin: center; */
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