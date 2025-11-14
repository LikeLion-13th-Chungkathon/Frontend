// src/components/layout/Layout.tsx
import styled from "styled-components";
// import type { PropsWithChildren } from "react";
import BottomNav from "../BottomNav";
import { Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  // 네비바를 숨길 경로 정의 (정규식 or 문자열 둘 다 가능)
  const HIDE_NAV_PATHS = ["/login", "/onboarding", "/create"];

  // 현재 경로가 제외 목록에 포함되어 있으면 숨기기
  const shouldHideNav = HIDE_NAV_PATHS.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <Wrapper>
      <AppContainer>
          <Outlet />

        {!shouldHideNav && <BottomNav />}
      </AppContainer>
      
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background: ${({ theme }) => theme.colors.background};
`;

const AppContainer = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bodyBg};
  //box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  //Appcontainer 콘텐츠가 BottomNav를 가리지 않도록 아래 패딩값 추가
  /* padding-bottom: 64px; */
`;