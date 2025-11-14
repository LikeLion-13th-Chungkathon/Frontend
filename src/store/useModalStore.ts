import { create } from "zustand";

interface ModalState {
  // 통나무 획득 모달의 표시 여부
  isLogAcquiredModalOpen: boolean;
  completedProjectName: string | null;

  actions: {
    // 모달 열기
    openLogAcquiredModal: (projectName: string) => void;

    // 모달 닫기
    closeLogAcquiredModal: () => void;
  };
}

export const useModalStore = create<ModalState>((set) => ({
  isLogAcquiredModalOpen: false,
  completedProjectName: null,
  actions: {
    openLogAcquiredModal: (projectName) => {
      console.log("2. [Zustand] openLogAcquiredModal 액션 실행됨!");
      set({
        isLogAcquiredModalOpen: true,
        completedProjectName: projectName,
      });
    },
    closeLogAcquiredModal: () =>
      set({
        isLogAcquiredModalOpen: false,
        completedProjectName: null,
      }),
  },
}));

export const useModalActions = () => useModalStore((state) => state.actions);
