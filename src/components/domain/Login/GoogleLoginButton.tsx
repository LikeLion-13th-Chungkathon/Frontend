import googleImg from "../../../assets/images/google-Img.png";

export default function GoogleLoginButton() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_SEVER_REDIRECT_URL = import.meta.env.VITE_GOOGLE_REDIRECT;
  const GOOGLE_SCOPE = import.meta.env.VITE_GOOGLE_SCOPE_USERINFO;
  const GOOGLE_CALLBACK_URL = import.meta.env.VITE_GOOGLE_CALLBACK_URI;

  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_CALLBACK_URL,
      response_type: "code",
      scope: GOOGLE_SCOPE,
      access_type: "offline",
      prompt: "consent",
    });

    const googleAuthUrl = `${GOOGLE_SEVER_REDIRECT_URL}?${params.toString()}`;
    console.log("🔎 googleAuthUrl = ", googleAuthUrl);
    window.location.href = googleAuthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      // disabled={isPending}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        // padding: "10px 16px",
        border: "none",
        color: "white",
        fontSize: "16px",
        width: "239px",
        height: "51px",
        borderRadius: "26px",
        background: "#CA8853",
        cursor: "pointer",
      }}
    >
      <img
        src={googleImg}
        alt="Google logo"
        width={24}
        height={24}
        style={{ backgroundColor: "transparent" }} // ⬅️ 추가
      />
      구글로 시작하기
    </button>
  );
}
