import type { HighlightCategory } from "../../types";

/**
 * 백엔드 tag_style ID를 프론트엔드 카테고리명으로 변환
 * (Swagger 기준: 0 = 문제)
 */
export const tagStyleToCategory = (styleId: number): HighlightCategory => {
  if (styleId === 1) return "PROBLEM";
  // (Swagger에 1, 2가 없으므로 임시 지정)
  if (styleId === 2) return "IDEA";
  if (styleId === 3) return "SOLUTION";
  return "PROBLEM"; // 기본값
};

/**
 * 프론트엔드 카테고리명을 백엔드 tag_style ID로 변환
 */
export const categoryToTagStyle = (category: HighlightCategory): number => {
  if (category === "PROBLEM") return 1;
  if (category === "IDEA") return 2;
  if (category === "SOLUTION") return 3;
  return 1; //기본값
};
