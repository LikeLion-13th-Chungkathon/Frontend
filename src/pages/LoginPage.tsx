// src/pages/LoginPage.tsx
import styled from "styled-components";
import GoogleLoginButton from "../components/domain/Login/GoogleLoginButton";

export default function LoginPage() {
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log("VITE_GOOGLE_CALLBACK_URI:", import.meta.env.VITE_GOOGLE_CALLBACK_URI);
  console.log("VITE_GOOGLE_REDIRECT:", import.meta.env.VITE_GOOGLE_REDIRECT);
  console.log("VITE_GOOGLE_SCOPE_USERINFO:", import.meta.env.VITE_GOOGLE_SCOPE_USERINFO);

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
