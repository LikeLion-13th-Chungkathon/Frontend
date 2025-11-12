import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyles";
import theme from "./styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import Layout from "./components/common/layout/Layout";
import ReviewsPage from "./pages/ReviewsPage";
import NewNotePage from "./pages/NewNotePage";

const queryClient = new QueryClient();

// (아직 만들지 않은 페이지는 임시로 만듭니다)
const TagsPage = () => <div>태그 페이지</div>;
const MyPage = () => <div>마이페이지</div>;

// 라우터 지도 정의
const router = createBrowserRouter([
  {
    // Layout이 필요한 페이지들
    path: "/",
    element: <Layout />,
    children: [
      { path: "home", element: <HomePage /> },
      { path: "reviews", element: <ReviewsPage /> },
      { path: "tags", element: <TagsPage /> },
      { path: "mypage", element: <MyPage /> },

      // '/'로 접속 시 '/home'으로 자동 이동
      { index: true, element: <Navigate to="/home" replace /> },
    ],
  },
  {
    //Layout이 필요 없는 그룹
    path: "/create",
    element: <NewNotePage />,
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ReactQueryDevtools initialIsOpen={false} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
