export interface Theme {
  colors: {
    bodyBg: string;
    text: string;
    textSecondary: string;
    // 여기에 추가적인 색상들을 정의
    primary: string;
    primary2: string;
    background: string;
    background2: string;
  };
  fonts: {
    primary: string;
    // 여기에 추가적인 폰트들을 정의
  };
  layout: {
    maxWidth: string;
    padding: string;
  };
}
