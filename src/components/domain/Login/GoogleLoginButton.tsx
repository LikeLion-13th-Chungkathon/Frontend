// src/components/domain/Login/GoogleLoginButton.tsx
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../../../store/useAuthStore";

export default function GoogleLoginButton() {
  const { setUser } = useAuthStore();

  // 가짜 구글 로그인 (나중에 백엔드 붙일 때 여기만 교체)
  const fakeGoogleLogin = async () => {
    return new Promise<{ id: string; name: string; email: string }>((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: "1",
            name: "테스트 유저",
            email: "test@example.com",
          }),
        800
      )
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: fakeGoogleLogin,
    onSuccess: (user) => {
      setUser(user); // 전역 상태에 로그인 정보 저장
      window.location.href = "/home"; // 홈으로 이동
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#fff",
        cursor: "pointer",
      }}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        width={18}
        height={18}
      />
      {isPending ? "로그인 중..." : "구글로 로그인하기"}
    </button>
  );
}
