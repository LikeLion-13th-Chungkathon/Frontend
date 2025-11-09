// 스타일 변수 저장소

import type { Theme } from "../types/theme.types";

const theme: Theme = {
  colors: {
    bodyBg: "white",
    text: "black",
    background: "#1b1b1b", //바깥 부분(페이지 배경)
    primary: "#007BFF",
  },
  fonts: {
    primary:
      "'LeeSeoyun', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  },
  //기본 레이아웃
  layout: {
    maxWidth: "375px", // 모바일 앱 폭
    padding: "16px",
  },
};
export default theme;
