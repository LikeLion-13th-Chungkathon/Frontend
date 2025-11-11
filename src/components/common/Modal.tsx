import { useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    width?: number;
}

export default function Modal({
    isOpen,
    onClose,
    children,
    width = 320,
}: ModalProps) {

    // 모달이 열릴 때 body 스크롤 잠그고 ESC키로 닫기 기능
    useEffect(() => {
        if (!isOpen) return;
        
        // ESC 키를 눌렀을 떄 닫기 동작 처리
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        }
        
        // 키보드 이벤트 등록
        document.addEventListener("keydown", handleKeyDown);

        // 모달이 열릴 때 스크롤 잠그기
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = prev;
        }
    }, [isOpen, onClose]);

    // 모달이 닫혀있으면 렌더링 X
    if (!isOpen) return null;

    // 모달을 body 최상단에 렌더링
    return createPortal(
        // 배경 클릭 시 onClose 실행
        <Backdrop onClick={onClose}>
            <Card width={width} onClick={(e) => e.stopPropagation()}>
                {children}
            </Card>
        </Backdrop>,
        document.body
    )
}

const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45); /* 반투명 검정 배경 */
    display: flex;
    align-items: center;
    justify-content: center; /* 모달을 화면 중앙에 정렬 */
    z-index: 999; /* 다른 요소 위로 표시 */
`;

const Card = styled.div<{ width: number }>`
    position: relative;
    background: ${({ theme }) => theme.colors.bodyBg ?? "#fff"}; /* 배경 색 수정 필요 */
    border-radius: 20px;         
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25); 
    padding: 22px; /* 내부 여백 */
    width: ${({ width }) => width}px; 
    max-height: 85vh; /* 화면 높이의 85%를 넘지 않게 */
`;