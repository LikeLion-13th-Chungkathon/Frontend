import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axiosInstance";

// 구글 소셜회원 온보딩(닉네임 설정) 페이지
const OnboardingPage = () => {
  const navigate = useNavigate();

  const pendingGoogleUser = useAuthStore((s) => s.pendingGoogleUser);
  const setUser = useAuthStore((s) => s.setUser);
  const setStatus = useAuthStore((s) => s.setStatus);
  const setPendingGoogleUser = useAuthStore((s) => s.setPendingGoogleUser);

  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!pendingGoogleUser) {
      navigate("/login", { replace: true });
    }
  }, [pendingGoogleUser, navigate]);

  if (!pendingGoogleUser) {
    return <div>온보딩 화면 준비 중...</div>;
  }

  const validateNickname = (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2 || trimmed.length > 8) {
      return "닉네임은 2자 이상 8자 이내로 입력해주세요.";
    }
    // 필요하면 한글/영문/숫자 검사 정규식 추가
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isSubmitting) return; // 이미 제출 중이면 무시

  const message = validateNickname(nickname);
  if (message) {
    setError(message);
    return;
  }

  if (!pendingGoogleUser) return;

    try {
      setError(null);
      setIsSubmitting(true);

      const body: any = {
        email: pendingGoogleUser.email,
        nickname: nickname.trim(),
      };

      // usernameFromGoogle이 null/"" 아닐 때만 보냄
      if (pendingGoogleUser.usernameFromGoogle) {
        body.username_from_google = pendingGoogleUser.usernameFromGoogle;
      }

      console.log("📦 보내는 바디:", body);

      const res = await axiosInstance.post("/account/google/signup/", body);

      console.log("✅ 구글 회원가입 완료:", res.data);

      // swagger 기준으로 응답 구조 맞춰서 수정
      const { email, nickname: finalNickname, token } = res.data;

      // access token 저장 (refresh는 서버에서 쿠키로 줄 수도 있음)
      if (token?.access_token) {
        localStorage.setItem("accessToken", token.access_token);
      }

      // TODO: id 필드는 백엔드 응답에 맞게 바꾸기
      setUser({ id: "", name: finalNickname, email });
      setPendingGoogleUser(null);
      setStatus("AUTHENTICATED");

      // 완료 화면으로 전환
      setIsCompleted(true);

      // 살짝 기다렸다가 홈으로 이동
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 1500);
    } catch (err) {
      console.error("구글 회원가입 중 오류:", err);
      setStatus("UNAUTHENTICATED");
      setIsSubmitting(false);
      setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // ----------------- 렌더링 -----------------
  if (isCompleted) {
    // 0.3 온보딩 완료 화면
    return (
      <PageWrapper>
        <Card>
          <TextBlock>
            <BigText>{nickname || "닉네임"}님, 환영합니다.</BigText>
            <SubText>[프로젝트명]의 첫 기록을 시작해보세요!</SubText>
          </TextBlock>
          <LoadingRing />
        </Card>
      </PageWrapper>
    );
  }

  // 0.2 닉네임 입력 화면
  return (
    <PageWrapper>
      <Card as="form" onSubmit={handleSubmit}>
        <TextBlock>
          <TitleText>프로젝트에서 사용할 <br />
            닉네임을 설정해주세요. 🚀</TitleText>
          {/* <DescriptionText>
            한글/영문/숫자 조합, 2자 이상 8자 이내로 입력해주세요.
          </DescriptionText> */}
        </TextBlock>

        <InputWrapper>
          <NicknameInput
            placeholder="팀원들이 나를 식별하는 이름이에요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            disabled={isSubmitting}
          />
          {error && <ErrorText>{error}</ErrorText>}
        </InputWrapper>

        {/* <BottomHint>
          한글/영문/숫자 조합, 2자 이상 8자 이내로 입력해주세요.
        </BottomHint> */}

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "완료 중..." : "완료"}
        </SubmitButton>
      </Card>
    </PageWrapper>
  );
};

export default OnboardingPage;


const PageWrapper = styled.div`
  min-height: calc(100vh - 80px); /* 헤더 높이 대충 감안 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  width: 360px;
  /* min-height: 640px; */
  padding: 48px 32px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 56px;
`;

const TextBlock = styled.div`
  text-align: center;
`;

const TitleText = styled.p`
  color: #000;
  text-align: center;
  font-family: LeeSeoyun;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

// const DescriptionText = styled.p`
//   font-size: 14px;
//   color: #777;
// `;

const BigText = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #666;
`;

const InputWrapper = styled.div`
  margin-top: 44px;
`;

const NicknameInput = styled.input`
  width: 100%;
  padding: 14px 18px;
  border-radius: 999px;
  border: none;
  outline: none;
  background: #ffffff;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);

  &::placeholder {
    color: #969696;
    text-align: center;
    font-family: LeeSeoyun;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;

const ErrorText = styled.p`
  margin-top: 8px;
  font-size: 12px;
  color: #ff5a5a;
  text-align: center;
`;

const SubmitButton = styled.button`
  margin-top: 32px;
  width: 100%;
  padding: 14px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #C78550;
  color: #fff;
  font-size: 15px;
  font-weight: 600;

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;


// 온보딩 성공 시 로딩링
const LoadingRing = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    style={{ animation: "spin 1s linear infinite", display: "block", margin: "0 auto" }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="60"
      cy="60"
      r="42"
      fill="none"
      stroke="#E0D5C5"
      strokeWidth="15"
    />

    <circle
      cx="60"
      cy="60"
      r="42"
      fill="none"
      stroke="#C8864D"
      strokeWidth="15"
      strokeLinecap="round"
      strokeDasharray="180"
      strokeDashoffset="110"
    />

    <style>
      {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
    </style>
  </svg>
);


