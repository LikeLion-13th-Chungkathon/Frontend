// styles/GlobalStyles.ts
import { createGlobalStyle } from "styled-components";

// normalize.css나 reset.css를 import하여 기본 스타일을 초기화
import normalize from "styled-normalize";

const GlobalStyle = createGlobalStyle`
  /* (수정) .ttf 경로 대신, 이 표준 CDN을 사용 */
  @import url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2/LeeSeoyun.css');

  // 이서윤체 로컬로 불러오는거 삭제
  // @font-face {
  //   font-family: "LeeSeoyun";
  //   src: url("/fonts/LeeSeoyun.ttf") format("truetype");
  //   font-weight: normal;
  //   font-style: normal;
  // }

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

    /* (추가) input 요소에도 폰트가 적용되도록 명시하는 것이 좋습니다 */
    font-family: inherit;
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
