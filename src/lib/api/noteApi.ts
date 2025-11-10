import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CraeteNoteDTO, CreateNoteResponse, DailyNote } from "../../types";
import { fakeFetch } from "./projectApi";
import { DUMMY_NOTES } from "./_dummyData";
import { useModalActions } from "../../store/useModalStore";

// 특정 날짜의 모든 노트를 가져오는 훅
export const useNotesByDateQuery = (date: string) => {
  return useQuery<DailyNote[]>({
    queryKey: ["notes", date], // 날짜별로 캐싱
    queryFn: async () => {
      const allNotes = await fakeFetch(DUMMY_NOTES);
      return allNotes.filter((note) => note.date === date);
    },
  });
};

// 노트 완료 버튼 생성 및 수정 API

// (가짜 API 함수)
const createNote = async (
  noteData: CraeteNoteDTO
): Promise<CreateNoteResponse> => {
  // const {data} = await myAxios.post('/note', noteData);

  // 더미 데이터 응답
  console.log("API 요청:", noteData);
  const data: CreateNoteResponse = {
    newNote: {
      id: "note-new-123",
      date: new Date().toISOString().split("T")[0],
      content: noteData.content,
      highlights: noteData.highlights.map((h, i) => ({
        ...h,
        id: `hl-new-${i}`,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // 50% 확률로 '첫 기여' 모달이 뜬다고 가정
    isFirstContribution: Math.random() < 0.5,
  };
  return new Promise((res) => setTimeout(() => res(data), 1000));
  // --- 더미 데이터 끝 ---
};

// 노트 생성/수정 뮤테이션
export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();
  const { openLogAcquiredModal } = useModalActions(); // zustand 모달 액션

  return useMutation({
    mutationFn: createNote,
    onSuccess: (data, variables) => {
      // API 요청 성공 시

      // 벡엔드에서 첫번째 노트 생성이라고 알려줘야함
      if (data.isFirstContribution) {
        // 일단 프로젝트 ID로 프로젝트 이름 찾기 전에 DTO의 projectId 사용
        openLogAcquiredModal(variables.projectId);
      }

      // 최신 상태 업데이트 invalidate 쿼리
      queryClient.invalidateQueries({ queryKey: ["note"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (error) => {
      console.log("노트 저장 실패:", error);
      alert("저장에 실패했습니다.");
    },
  });
};
