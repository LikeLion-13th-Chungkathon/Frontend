const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = import.meta.env.VITE_GOOGLE_SCOPE_USERINFO;
const CALLBACK_URI = import.meta.env.VITE_GOOGLE_CALLBACK_URI;
const GOOGLE_REDIRECT = import.meta.env.VITE_GOOGLE_REDIRECT;

export function buildGoogleAuthUrl() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: CALLBACK_URI,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

  return `${GOOGLE_REDIRECT}?${params.toString()}`;
}