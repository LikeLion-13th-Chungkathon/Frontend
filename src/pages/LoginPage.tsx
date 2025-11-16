// src/pages/LoginPage.tsx
import styled from "styled-components";
import GoogleLoginButton from "../components/domain/Login/GoogleLoginButton";
import LogoImage from "../../../assets/images/lion-head.png";

export default function LoginPage() {
  console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);
  console.log(
    "VITE_GOOGLE_CALLBACK_URI:",
    import.meta.env.VITE_GOOGLE_CALLBACK_URI
  );
  console.log("VITE_GOOGLE_REDIRECT:", import.meta.env.VITE_GOOGLE_REDIRECT);
  console.log(
    "VITE_GOOGLE_SCOPE_USERINFO:",
    import.meta.env.VITE_GOOGLE_SCOPE_USERINFO
  );

  return (
    <Container>
      <img src={LogoImage} alt="log:lion logo" width={201} height={204} />
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
  gap: 24px;
  background: ${({ theme }) => theme.colors?.bodyBg || "#fafafa"};
`;
