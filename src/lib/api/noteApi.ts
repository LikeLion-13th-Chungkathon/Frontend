import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  DailyNote,
  CreateTextNoteDTO,
  UpdateNoteDTO,
  UpdateNoteResponse,
} from "../../types";
import { fakeFetch } from "./projectApi";
import { DUMMY_NOTES } from "./_dummyData";
import { useModalActions } from "../../store/useModalStore";

// 노트 완료 버튼 생성 및 수정 API

// (가짜 API 함수)
// 더미 데이터 응답
const createTextNote = async (
  noteData: CreateTextNoteDTO
): Promise<DailyNote> => {
  // const { data } = await myAxios.post('/notes', noteData);
  console.log("API: 텍스트 노트 생성", noteData);
  const data: DailyNote = {
    // 더미데이터
    id: `note-${Math.random()}`, // 임시 ID
    date: new Date().toISOString().split("T")[0],
    content: noteData.content,
    highlights: [], // ⬅️ 처음 생성 시 하이라이트는 비어있음
    projectId: noteData.projectId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return new Promise((res) => setTimeout(() => res(data), 500));
};

const updateNote = async ({
  noteId,
  noteData,
}: {
  noteId: string;
  noteData: UpdateNoteDTO;
}): Promise<UpdateNoteResponse> => {
  // const { data } = await myAxios.patch(`/notes/${noteId}`, noteData);
  console.log("API: 노트 하이라이트 수정", noteId, noteData);
  const data: UpdateNoteResponse = {
    updatedNote: {
      // 더미데이터
      id: noteId,
      date: new Date().toISOString().split("T")[0],
      content: noteData.content,
      highlights: noteData.highlights.map((h, i) => ({
        ...h,
        id: `hl-${i + 1}`, // (백엔드가 ID를 생성해줬다고 가정)
      })),
      projectId: "proj-1", // (임시 프로젝트 ID)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    isFirstContribution: Math.random() < 0.5, // ⬅️ 통나무 모달 50% 확률
  };
  return new Promise((res) => setTimeout(() => res(data), 1000));
};

const fetchNoteById = async (noteId: string): Promise<DailyNote> => {
  console.log("API: 노트 상세 조회", noteId);

  // 더미데이터에서 noteId 일치하는 노트 찾기
  const foundNote = DUMMY_NOTES.find((note) => note.id === noteId);

  if (!foundNote) {
    console.warn(
      `노트(ID: ${noteId})를 찾을 수 없습니다. 기본 노트를 반환합니다.`
    );
    return DUMMY_NOTES[0];
  }

  const data: DailyNote = foundNote;

  return new Promise((res) => setTimeout(() => res(data), 500));
};

// 텍스트 전용 노트 생성 뮤테이션 (데일리 기록 추가 뮤테이션)
export const useCreateTextNoteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTextNote,
    onSuccess: () => {
      // 텍스트 생성 성공 시, 홈의 노트 목록을 갱신
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
};

// 특정 ID의 노트 상세 정보를 가져오는 쿼리 (모달용)
export const useNoteByIdQuery = (noteId: string) => {
  return useQuery<DailyNote>({
    queryKey: ["notes", noteId], // ⬅️ ['notes', 'note-123']
    queryFn: () => fetchNoteById(noteId),
    staleTime: 1000 * 60, // 1분간 캐시
  });
};

// 노트 수정(하이라이팅) 뮤테이션
export const useUpdateNoteMutation = (noteId: string) => {
  const queryClient = useQueryClient();
  // 통나무 모달 열기 액션
  const { openLogAcquiredModal } = useModalActions();

  return useMutation({
    mutationFn: (noteData: UpdateNoteDTO) => updateNote({ noteId, noteData }),
    onSuccess: (data) => {
      // 1. "첫 기여"면 통나무 모달 띄우기
      if (data.isFirstContribution) {
        // (참고: "이 프로젝트" 부분은 나중에 프로젝트 이름을
        //  zustand나 props로 받아와서 채워야 합니다.)
        openLogAcquiredModal("이 프로젝트");
      }

      // 2. 홈 노트 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      // 3. 리뷰 페이지 갱신
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // 4. (중요) 이 노트의 상세 캐시도 갱신
      queryClient.setQueryData(["notes", noteId], data.updatedNote);
    },
  });
};

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

// {
//       id: "note-new-123",
//       date: new Date().toISOString().split("T")[0],
//       content: noteData.content,
//       highlights: noteData.highlights.map((h, i) => ({
//         ...h,
//         id: `hl-new-${i}`,
//       })),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
