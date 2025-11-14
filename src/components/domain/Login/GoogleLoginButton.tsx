export default function GoogleLoginButton() {
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_SEVER_REDIRECT_URL = import.meta.env.VITE_GOOGLE_REDIRECT
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
      구글로 로그인하기
    </button>
  );
}
