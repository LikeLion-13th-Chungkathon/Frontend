// src/components/layout/Layout.tsx
import styled from "styled-components";
import type { PropsWithChildren } from "react";

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.background};
`;

const AppContainer = styled.main`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bodyBg};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
`;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Wrapper>
      <AppContainer>{children}</AppContainer>
    </Wrapper>
  );
}
