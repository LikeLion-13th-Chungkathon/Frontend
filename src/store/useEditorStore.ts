import { create } from "zustand";
import type { HighlightCategory } from "../types";

interface EditorState {
  // 사용자가 현재 활성화 한 하이라이트 카테고리
  activeCategory: HighlightCategory | null; // null이면 비활성화

  actions: {
    // 활성화된 카테고리 설정
    setActiveCategory: (category: HighlightCategory | null) => void;
  };
}

// 노트 에디터의 UI 상태를 관리하는 스토어

export const useEditorStore = create<EditorState>((set) => ({
  activeCategory: null, // 기본값은 null로 선택안함을 표시
  actions: {
    setActiveCategory: (category) => set({ activeCategory: category }),
  },
}));

// 액션 불러오기 훅
export const useEditorActions = () => useEditorStore((state) => state.actions);
