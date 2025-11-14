import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axiosInstance";

// 구글 로그인 후 redirect_url로 돌아왔을 때 실행되는 페이지
export default function GoogleCallbackPage() {
    // URL의 쿼리스트링(?code=xxx)을 읽기 위한 훅
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Zustand에 저장된 사용자 상태 업데이트 함수들
    const setUser = useAuthStore((s) => s.setUser);
    const setStatus = useAuthStore((s) => s.setStatus);

    useEffect(() => {
        console.log("현재 URL:", window.location.href);
        console.log("raw search:", window.location.search);

        const code = searchParams.get("code");
        console.log("code from searchParams:", code);

        // code가 없으면 로그인 페이지로 돌려보냄
        if (!code) {
        console.error("구글 OAuth code가 없습니다.");
        navigate("/login");
        return;
    }

    (async () => {
        try {
            const res = await axiosInstance.post("/account/google/callback/", { code });

            console.log("구글 콜백 응답:", res.status, res.data);

            // 200: 기존 회원 → 로그인 완료
            if (res.status === 200) {
                const { email, nickname, token } = res.data; // swagger 구조 기준

                // 필요하면 토큰 저장
                // localStorage.setItem("accessToken", token.access_token);

                // TODO: id는 서버 응답에 맞게 수정
                setUser({ id: "", name: nickname, email });
                setStatus("AUTHENTICATED");
                navigate("/home", { replace: true });
                return;
            }

            // 202: 신규 회원 → 닉네임 입력 필요
            if (res.status === 202) {
                console.log("신규 회원, 닉네임 필요:", res.data);

                // TODO: email, username_from_google 를 어딘가에 저장해두고
                // 온보딩(닉네임 입력) 페이지로 이동
                // 예시)
                // setPendingGoogleUser({
                //   email: res.data.email,
                //   username: res.data.username_from_google,
                // });

                navigate("/onboarding", { replace: true });
                return;
            }

                // 그 외 예기치 못한 상태 코드
                console.error("예상치 못한 상태 코드:", res.status, res.data);
                setStatus("UNAUTHENTICATED");
                navigate("/login");
            } catch (e) {
                console.error("구글 로그인 처리 중 오류:", e);
                setStatus("UNAUTHENTICATED");
                navigate("/login");
            }
        })();
    }, [searchParams, navigate, setUser, setStatus]);

    return <div>구글 로그인 처리 중</div>;
}
