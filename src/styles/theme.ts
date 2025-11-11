// 스타일 변수 저장소
import type { Theme } from "../types/theme.types";

const theme: Theme = {
  colors: {
    //포인트 컬러
    primary: "#CA8853",

    //배경컬러
    bodyBg: "#FFF7ED", // 앱콘텐츠배경
    background: "black", //바깥 부분(페이지 배경)
    background2: "#FFECD4",

    // 텍스트 컬러fff
    text: "black", // 기본 텍스트
    textSecondary: "#969696",
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
