// styles/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

// normalize.css나 reset.css를 import하여 기본 스타일을 초기화
import normalize from "styled-normalize";

const GlobalStyle = createGlobalStyle`
  //프리텐다드 폰트 불러오기
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');

  ${normalize}

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  html, body, #root {
    height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    
    // theme.ts에서 값 참조
    font-family: ${({ theme }) => theme.fonts.primary};
    background-color: ${({ theme }) => theme.colors.bodyBg};
    color: ${({ theme }) => theme.colors.text};
  }

  input, textarea, [contenteditable] {
    -webkit-user-select: text;
    user-select: text;
  }
  
  /* #root 스타일링 관련:
    여기서 중앙 정렬을 하는 것도 좋지만, 
    앱의 유연한 레이아웃을 위해 <App /> 컴포넌트 내부에서 
    <Layout> 컴포넌트를 만들어 처리하는 것도 좋은 방법입니다.
    현재 방식도 웹앱에서는 문제 없습니다.
  */

  #root {
    display: flex;
    justify-content: center;  
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;

export default GlobalStyle;
