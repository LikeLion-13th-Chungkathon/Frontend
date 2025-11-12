// src/pages/LoginPage.tsx
import styled from "styled-components";
import GoogleLoginButton from "../components/domain/Login/GoogleLoginButton";

export default function LoginPage() {
  return (
    <Container>
      <Title>환영합니다</Title>
      <Subtitle>Google 계정으로 간편하게 시작하세요</Subtitle>
      <GoogleLoginButton />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 16px;
  background: ${({ theme }) => theme.colors?.bodyBg || "#fafafa"};
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
`;
