import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyles";
import theme from "./styles/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "./components/common/layout/Layout";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Layout>
          <ReactQueryDevtools initialIsOpen={false} />
          <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
            헤더 자리
          </header>

          <main style={{ flex: 1, padding: 16, overflow: "auto" }}>
            메인내용 부분
          </main>

          <footer style={{ padding: 16, borderTop: "1px solid #eee" }}>
            하단 탭바 자리
          </footer>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
