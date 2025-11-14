import { Home, Tag, Pencil, Star, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import useCalendarStore from "../../store/useCalendarStore";

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    // 날짜 상태 가져오기
    const selectedDate = useCalendarStore((s) => s.selectedDate);
    const activeProjectId = useCalendarStore((s) => s.activeProjectId);

 //네비게이션 데이터 (name, icon, path)
    const navItems = [
        { name: "홈", icon: <Home size={22} />, path: "/home" },
        { name: "태그", icon: <Tag size={22} />, path: "/tags" },
        { name: "리뷰", icon: <Star size={22} />, path: "/reviews" },
        { name: "마이페이지", icon: <User size={22} />, path: "/mypage" },
    ];

    const handleCreate = () => {
        if (!activeProjectId) {
            alert("먼저 프로젝트를 선택해주세요");
            return;
        }
        navigate(`/create?date=${selectedDate}`);
    }

    return (
        <NavContainer>
            {/* 플로팅 버튼 왼쪽 부분 (홈, 태그 버튼) */}
            <NavGroup>
                {navItems.slice(0, 2).map((item) => (
                    <NavButton
                        key={item.name}
                        $active={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavButton>
                ))}
            </NavGroup>
        
            {/* 가운데 플로팅 버튼 (작성 버튼) */}
            <FloatingButton onClick={handleCreate}>
                <Pencil size={24} />
            </FloatingButton>
        
            {/* 플로팅 버튼 오른쪽 부분 (리뷰, 마이페이지 버튼) */}
            <NavGroup>
                {navItems.slice(2).map((item) => (
                <NavButton
                    key={item.name}
                    $active={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                >
                    {item.icon}
                    <span>{item.name}</span>
                </NavButton>
                ))}
            </NavGroup>
        </NavContainer>
    );
}


const NavContainer = styled.nav`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);

    width: 100%;
    max-width: ${({ theme }) => theme.layout.maxWidth};

    height: 64px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: ${({ theme }) => theme.colors.background2};
    border-top: 1px solid #e5e7eb;
    z-index: 50;
`;

const NavGroup = styled.div`
    display: flex;
    gap: 40px;
    align-items: center;
`;

const NavButton = styled.button<{ $active: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 12px;
    color: ${({ theme, $active }) => ($active ? theme.colors.primary2 : theme.colors.primary)};
    background: none;
    border: none;
    outline: none;
    cursor: pointer;

    svg {
        stroke: ${({ theme, $active }) => ($active ? theme.colors.primary2 : theme.colors.primary)};
        transition: stroke 0.2s;
    }

    span {
        margin-top: 4px;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.primary2};
        svg {
        stroke: ${({ theme }) => theme.colors.primary2};
        }
    }
`;

const FloatingButton = styled.button`
    position: relative;
    transform: translateY(-40%);
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border: none;
    outline: none;
    cursor: pointer;
    width: 60px; 
    height: 60px;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background-color 0.2s;

    &:hover {
        background: ${({ theme }) => theme.colors.primary2};;
        transform: translateY(-25%) scale(1.05);
    }
`;