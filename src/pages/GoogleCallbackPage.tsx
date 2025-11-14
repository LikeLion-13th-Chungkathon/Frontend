import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import axiosInstance from "../lib/axiosInstance";
import { useEffect } from "react";

// 구글 로그인 후 redirect_url로 돌아왔을 떄 실행되는 페이지
export default function GoogleCallbackPage() {

    // URL의 쿼드스트링(?code=xxx)을 읽기 위한 훅
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    // Zustand에 저장된 사용자 데이터를 업데이트하는 함수들
    const setUser = useAuthStore((s) => s.setUser);
    const setStatus = useAuthStore((s) => s.setStatus);


    useEffect(() => {
        console.log("현재 URL:", window.location.href);
        console.log("raw search:", window.location.search);
        console.log("code from searchParams:", searchParams.get("code"));

        const code = searchParams.get("code");
        if (!code) {
            console.error("구글 OAuth code가 없습니다.");
            navigate("/login");
            return;
        }

        (async () => {
            try {
                const res = await axiosInstance.post("/account/google/callback/", { code })
                const { user } = res.data.data;

                setUser(user);
                setStatus("AUTHENTICATED");

                navigate("/home", { replace: true });
            } catch (e) {
                console.error("구글 로그인 처리 중 오류:", e);
                setStatus("UNAUTHENTICATED");
                navigate("/login");
            }
        }) ();
    }, [searchParams, navigate, setUser, setStatus]);

    return <div>구글 로그인 처리 중</div>
}