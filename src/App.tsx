import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyles";
import theme from "./styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Layout from "./components/common/layout/Layout";
import LandingPage from "./pages/LandingPage";
import NewNotePage from "./pages/NewNotePage";
import LoginPage from "./pages/LoginPage";
import OnboardingPage from "./pages/OnboardingPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import { LogAcquiredModal } from "./components/common/Modal/LogAcquiredModal";
import TagPage from "./pages/TagPage";

const queryClient = new QueryClient();

// (아직 만들지 않은 페이지는 임시로 만듭니다)
const MyPage = () => <div>마이페이지</div>;

// 라우터 지도 정의
export const router = createBrowserRouter([
  {
    // Layout이 필요한 페이지들
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <HomePage /> },
      { path: "tags", element: <TagPage /> },
      { path: "mypage", element: <MyPage /> },

      { path: "create", element: <NewNotePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "onboarding", element: <OnboardingPage /> },
      { path: "account/google/callback/*", element: <GoogleCallbackPage /> },

      // '/'로 접속 시 '/login'으로 자동 이동
      { index: true, element: <LandingPage /> },
    ],
  },

  // {
  //   path: "/account/google/callback/*",
  //   element: <HomePage />, // 나중에 GoogleCallbackPage로 바꿀 예정
  // },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
        {/* 통나무 획득 페이지 전역 모달로 만들어주기 */}
        <LogAcquiredModal />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
