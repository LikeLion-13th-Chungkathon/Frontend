import { ThemeProvider } from "styled-components";
import GlobalStyle from "./styles/GlobalStyles";
import theme from "./styles/thems";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ReactQueryDevtools initialIsOpen={false} />
        <div>App</div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
