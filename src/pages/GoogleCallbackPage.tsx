import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axiosInstance";
import type { AxiosError } from "axios";

// 구글 로그인 후 redirect_url로 돌아왔을 때 실행되는 페이지
export default function GoogleCallbackPage() {

    // URL의 쿼리스트링(?code=xxx)을 읽기 위한 훅
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Zustand에 저장된 사용자 상태 업데이트 함수들
    const setUser = useAuthStore((s) => s.setUser);
    const setStatus = useAuthStore((s) => s.setStatus);
    const setPendingGoogleUser = useAuthStore((s) => s.setPendingGoogleUser);

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
                const { email, nickname, token, user } = res.data; // swagger 구조 기준

                // token 안에 access_token이 있다면 저장
                const accessToken  = token?.access_token;
                if (accessToken) {
                    localStorage.setItem("accessToken", accessToken);
                }
                
                // user.id가 있다면 그걸 쓰고 없으면 일단 빈 문자열
                const id = user?.id?.toString?.() ?? "";

                setUser({ id, name: nickname, email });
                setStatus("AUTHENTICATED");
                setPendingGoogleUser(null);

                navigate("/home", { replace: true });
                return;
            }

            // 202: 신규 회원 → 닉네임 입력 필요
            if (res.status === 202) {
                const { email, username_from_google } = res.data;
                console.log("신규 회원, 닉네임 필요:", res.data);

                // 온보딩 페이지에서 쓸 정보 저장
                setPendingGoogleUser({
                    email,
                    usernameFromGoogle: username_from_google ?? "",
                });

                setStatus("PENDING_GOOGLE_ONBOARDING");
                navigate("/onboarding", { replace: true });
                return;
            }

                // 그 외 예기치 못한 상태 코드
                console.error("예상치 못한 상태 코드:", res.status, res.data);
                setStatus("UNAUTHENTICATED");
                navigate("/login", { replace: true });
            } catch (e) {
                const err = e as AxiosError<any>;
                const status = err.response?.data;
                const data = err.response?.data;
                console.error("구글 로그인 처리 중 오류:", status, data);

                // 구글 인증 토큰 만료 등
                if (status === 400) {
                    alert("구글 인증 코드가 유효하지 않습니다. 다시 로그인해 주세요.")
                } else {
                    alert("구글 로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
                }

                setStatus("UNAUTHENTICATED");
                setPendingGoogleUser(null);
                navigate("/login", { replace: true });
            }
        })();
    }, [searchParams, navigate, setUser, setStatus, setPendingGoogleUser]);

    return <div>구글 로그인 처리 중</div>;
}
