import { Home, Tag, Pencil, Star, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "홈", icon: <Home size={22} />, path: "/home" },
    { name: "태그", icon: <Tag size={22} />, path: "/tags" },
    { name: "리뷰", icon: <Star size={22} />, path: "/reviews" },
    { name: "마이페이지", icon: <User size={22} />, path: "/mypage" },
  ];

  const handleCreate = () => navigate("/create");

  return (
    <NavContainer>
      <NavGroup>
        {navItems.slice(0, 2).map((item) => (
          <NavButton
            key={item.name}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavButton>
        ))}
      </NavGroup>

      <FloatingButton onClick={handleCreate}>
        <Pencil size={24} />
      </FloatingButton>

      <NavGroup>
        {navItems.slice(2).map((item) => (
          <NavButton
            key={item.name}
            active={location.pathname === item.path}
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

/* ---------------- Styled Components ---------------- */

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
  background-color: white;
  border-top: 1px solid #e5e7eb;
  z-index: 50;
`;

const NavGroup = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;
`;

const NavButton = styled.button<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: ${(props) => (props.active ? "#3B82F6" : "#6B7280")};
  background: none;
  border: none;
  outline: none;
  cursor: pointer;

  svg {
    stroke: ${(props) => (props.active ? "#3B82F6" : "#6B7280")};
    transition: stroke 0.2s;
  }

  span {
    margin-top: 4px;
  }

  &:hover {
    color: #3b82f6;
    svg {
      stroke: #3b82f6;
    }
  }
`;

const FloatingButton = styled.button`
  position: relative;
  transform: translateY(-20%);
  background-color: #3b82f6;
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
    background-color: #2563eb;
    transform: translateY(-25%) scale(1.05);
  }
`;