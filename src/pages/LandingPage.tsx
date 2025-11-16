import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/images/lion-head.png";
import styled, { keyframes } from "styled-components";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 3초 후에 실행될 함수
    const timer = setTimeout(() => {
      //토큰 확인
      const token = localStorage.getItem("accessToken");

      if (token) {
        // 로그인 된 경우 /home으로 이동
        navigate("/home", { replace: true });
      } else {
        // 로그인 안된 경우 /login으로 이동
        navigate("/login", { replace: true });
      }
    }, 3000); // 3초

    return () => clearTimeout(timer);
  }, [navigate]); // navigate 함수가 바뀔때만 실행

  return (
    <Wrapper>
      <img src={LogoImage} alt="log:lion logo" width={270} height={274} />
      <Title>log:lion</Title>
    </Wrapper>
  );
};

export default LandingPage;

// 8. (추가) 부드럽게 나타나는 효과
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ca8853;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* 10. (추가) 0.5초 동안 부드럽게 나타나도록 */
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Title = styled.h1`
  color: #ffecd4;
  font-family: ${({ theme }) => theme.fonts.primary};
  margin-top: 150px;
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 1px;
`;
